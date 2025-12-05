import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Inject,
  forwardRef,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Role, ROLE_LEVELS } from './constants/roles.constant';
import { AuditService } from '../audit/audit.service';
import { SmsService } from '../sms/sms.service';
import { EmailService } from '../email/email.service';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;

interface JwtPayload {
  id: number;
  email: string;
  role: UserRole;
  facility_id: number | null;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private auditService: AuditService,
    @Inject(forwardRef(() => SmsService))
    private smsService: SmsService,
    @Inject(forwardRef(() => EmailService))
    private emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, fullName, phone, role, phcCenterId, staffId } =
      registerDto;

    // Check if email already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Check if staffId already exists (if provided)
    if (staffId) {
      const existingStaffId = await this.usersRepository.findOne({
        where: { staffId },
      });

      if (existingStaffId) {
        throw new ConflictException('Staff ID already registered');
      }
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user - admins are auto-approved, others need approval
    const user = this.usersRepository.create({
      fullName: fullName,
      email: email,
      phone: phone,
      password: hashedPassword,
      role: role,
      phcCenterId: phcCenterId || null,
      staffId: staffId || null,
      status: role === 'admin' ? 'approved' : 'pending',
    } as Partial<User>);

    const savedUser = await this.usersRepository.save(user);

    // For admin users, auto-login after registration
    if (role === 'admin') {
      const payload: JwtPayload = {
        id: savedUser.id,
        email: savedUser.email,
        role: savedUser.role,
        facility_id: savedUser.phcCenterId,
      };

      const token = this.jwtService.sign(payload);

      const nameParts = savedUser.fullName?.split(' ') || ['', ''];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      return {
        message: 'Registration successful',
        token,
        user: {
          id: savedUser.id,
          email: savedUser.email,
          firstName,
          lastName,
          role: {
            id: savedUser.role,
            name: savedUser.role,
            level: ROLE_LEVELS[savedUser.role as Role] || 0,
          },
          facility: null,
        },
      };
    }

    // For non-admin users, notify admins about the new registration
    this.notifyAdminsOfNewRegistration(savedUser.fullName, savedUser.email, savedUser.role);

    // Return success message
    return {
      message:
        'Registration successful. Your account is pending approval by an administrator.',
      user: {
        id: savedUser.id,
        email: savedUser.email,
        fullName: savedUser.fullName,
        role: savedUser.role,
        status: savedUser.status,
      },
    };
  }

  /**
   * Notify all admin users about a new staff registration
   */
  private async notifyAdminsOfNewRegistration(newStaffName: string, newStaffEmail: string, newStaffRole: string): Promise<void> {
    try {
      // Find all admin users with phone numbers
      const admins = await this.usersRepository.find({
        where: { role: 'admin' as UserRole, status: 'approved' },
      });

      const adminsWithPhone = admins.filter(admin => admin.phone);

      // Send SMS to each admin (limit to first 3 to avoid spam)
      if (adminsWithPhone.length > 0) {
        const adminsToNotify = adminsWithPhone.slice(0, 3);

        for (const admin of adminsToNotify) {
          try {
            await this.smsService.sendNewStaffRegistrationSms(
              admin.phone,
              admin.fullName,
              newStaffName,
              newStaffRole,
            );
            this.logger.log(`New registration SMS sent to admin ${admin.fullName}`);
          } catch (error) {
            this.logger.error(`Failed to send SMS to admin ${admin.fullName}: ${error.message}`);
          }
        }
      }

      // Send Email notification to admin
      try {
        await this.emailService.sendNewStaffRegistrationEmail(
          newStaffName,
          newStaffEmail,
          newStaffRole,
        );
        this.logger.log(`New registration email sent to admin`);
      } catch (error) {
        this.logger.error(`Failed to send new registration email: ${error.message}`);
      }
    } catch (error) {
      this.logger.error(`Failed to notify admins of new registration: ${error.message}`);
      // Don't fail registration if notification fails
    }
  }

  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string) {
    const { email, password } = loginDto;

    // First, find user by email only (to check lockout status)
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['phcCenter'],
    });

    if (!user) {
      // Log failed login attempt for non-existent user
      await this.auditService.log({
        action: 'LOGIN_FAILED',
        resource: 'USER',
        details: { email, reason: 'User not found' },
        ipAddress,
        userAgent,
      });
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if account is locked
    if (user.lockedUntil && new Date() < new Date(user.lockedUntil)) {
      const remainingMinutes = Math.ceil(
        (new Date(user.lockedUntil).getTime() - Date.now()) / 60000,
      );
      throw new UnauthorizedException(
        `Account is locked. Please try again in ${remainingMinutes} minute(s).`,
      );
    }

    // Check if account is approved
    if (user.status !== 'approved') {
      throw new UnauthorizedException(
        user.status === 'pending'
          ? 'Your account is pending approval'
          : 'Your account has been suspended or rejected',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Increment failed login attempts
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      // Log failed login attempt
      await this.auditService.log({
        userId: user.id,
        action: 'LOGIN_FAILED',
        resource: 'USER',
        resourceId: user.id,
        details: { reason: 'Invalid password', attempt: user.failedLoginAttempts },
        ipAddress,
        userAgent,
        facilityId: user.phcCenterId,
      });

      // Lock account if max attempts reached
      if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        user.lockedUntil = new Date(
          Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000,
        );
        await this.usersRepository.save(user);
        throw new UnauthorizedException(
          `Account locked due to too many failed attempts. Please try again in ${LOCKOUT_DURATION_MINUTES} minutes.`,
        );
      }

      await this.usersRepository.save(user);
      const remainingAttempts = MAX_FAILED_ATTEMPTS - user.failedLoginAttempts;
      throw new UnauthorizedException(
        `Invalid email or password. ${remainingAttempts} attempt(s) remaining.`,
      );
    }

    // Reset failed login attempts on successful login
    user.failedLoginAttempts = 0;
    user.lockedUntil = null;
    user.lastLoginAt = new Date();
    await this.usersRepository.save(user);

    // Log successful login
    await this.auditService.log({
      userId: user.id,
      action: 'LOGIN',
      resource: 'USER',
      resourceId: user.id,
      details: { email: user.email },
      ipAddress,
      userAgent,
      facilityId: user.phcCenterId,
    });

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      facility_id: user.phcCenterId,
    };

    const token = this.jwtService.sign(payload);

    const nameParts = user.fullName?.split(' ') || ['', ''];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    return {
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName,
        lastName,
        role: {
          id: user.role,
          name: user.role,
          level: ROLE_LEVELS[user.role as Role] || 0,
        },
        facility: user.phcCenterId
          ? { id: user.phcCenterId, name: user.phcCenter?.centerName }
          : null,
      },
    };
  }

  async getProfile(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['phcCenter'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const nameParts = user.fullName?.split(' ') || ['', ''];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    return {
      id: user.id,
      email: user.email,
      firstName,
      lastName,
      role: { id: user.role, name: user.role },
      facility: user.phcCenterId
        ? { id: user.phcCenterId, name: user.phcCenter?.centerName }
        : null,
    };
  }
}
