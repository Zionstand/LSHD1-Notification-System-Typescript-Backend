import {
  Injectable,
  ConflictException,
  BadRequestException,
  Inject,
  forwardRef,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { SmsService } from '../sms/sms.service';
import { EmailService } from '../email/email.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(forwardRef(() => SmsService))
    private smsService: SmsService,
    @Inject(forwardRef(() => EmailService))
    private emailService: EmailService,
    private auditService: AuditService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Check if staffId already exists (if provided)
    if (createUserDto.staffId) {
      const existingStaffId = await this.usersRepository.findOne({
        where: { staffId: createUserDto.staffId },
      });

      if (existingStaffId) {
        throw new ConflictException('Staff ID already registered');
      }
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // Create new user
    const user = this.usersRepository.create({
      fullName: createUserDto.fullName,
      email: createUserDto.email,
      phone: createUserDto.phone,
      password: hashedPassword,
      role: createUserDto.role,
      phcCenterId: createUserDto.phcCenterId || null,
      staffId: createUserDto.staffId || null,
      status: createUserDto.role === 'admin' ? 'approved' : 'pending',
    } as Partial<User>);

    const savedUser = await this.usersRepository.save(user);
    return savedUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['phcCenter'],
    });
  }

  async findAll(status?: string) {
    const whereClause: Record<string, string> = {};
    if (status) {
      whereClause.status = status;
    }

    const users = await this.usersRepository.find({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      relations: ['phcCenter'],
      order: { createdAt: 'DESC' },
    });

    return users.map((u) => this.formatUser(u));
  }

  async findPendingUsers() {
    const users = await this.usersRepository.find({
      where: { status: 'pending' },
      relations: ['phcCenter'],
      order: { createdAt: 'ASC' },
    });

    return users.map((u) => this.formatUser(u));
  }

  private formatUser(u: User) {
    const nameParts = u.fullName?.split(' ') || ['', ''];
    return {
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      phone: u.phone,
      staffId: u.staffId,
      status: u.status,
      isActive: u.status === 'approved',
      role: u.role,
      facilityId: u.phcCenterId,
      facility: u.phcCenter?.centerName || null,
      createdAt: u.createdAt,
      approvedAt: u.approvedAt,
    };
  }

  async findOne(id: number) {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['phcCenter'],
    });
  }

  async approveUser(id: number, approvedBy: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['phcCenter'],
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.status === 'approved') {
      throw new BadRequestException('User is already approved');
    }

    user.status = 'approved';
    user.approvedAt = new Date();
    user.approvedBy = approvedBy;

    const savedUser = await this.usersRepository.save(user);

    // Log the approval action
    await this.auditService.log({
      userId: approvedBy,
      action: 'APPROVE',
      resource: 'USER',
      resourceId: user.id,
      details: {
        staffName: user.fullName,
        staffEmail: user.email,
        staffRole: user.role,
        approvedAt: user.approvedAt,
        previousStatus: 'pending',
      },
      facilityId: user.phcCenterId,
    });
    this.logger.log(`Audit log created: User ${user.fullName} approved by user ID ${approvedBy}`);

    // Send SMS notification to the approved staff member
    if (user.phone) {
      try {
        await this.smsService.sendStaffApprovalSms(
          user.phone,
          user.fullName,
          user.role,
        );
        this.logger.log(`Approval SMS sent to ${user.fullName} (${user.phone})`);
      } catch (error) {
        this.logger.error(`Failed to send approval SMS to ${user.fullName}: ${error.message}`);
        // Don't fail the approval if SMS fails
      }
    }

    // Send Email notification to the approved staff member
    if (user.email) {
      try {
        await this.emailService.sendStaffApprovalEmail(
          user.email,
          user.fullName,
          user.role,
        );
        this.logger.log(`Approval email sent to ${user.fullName} (${user.email})`);
      } catch (error) {
        this.logger.error(`Failed to send approval email to ${user.fullName}: ${error.message}`);
        // Don't fail the approval if email fails
      }
    }

    return {
      message: 'User approved successfully',
      user: this.formatUser(savedUser),
    };
  }

  async rejectUser(id: number, rejectedBy: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['phcCenter'],
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.status === 'rejected') {
      throw new BadRequestException('User is already rejected');
    }

    const previousStatus = user.status;
    user.status = 'rejected';

    const savedUser = await this.usersRepository.save(user);

    // Log the rejection action
    await this.auditService.log({
      userId: rejectedBy,
      action: 'REJECT',
      resource: 'USER',
      resourceId: user.id,
      details: {
        staffName: user.fullName,
        staffEmail: user.email,
        staffRole: user.role,
        rejectedAt: new Date(),
        previousStatus,
      },
      facilityId: user.phcCenterId,
    });
    this.logger.log(`Audit log created: User ${user.fullName} rejected by user ID ${rejectedBy}`);

    // Send Email notification to the rejected staff member
    if (user.email) {
      try {
        await this.emailService.sendStaffRejectionEmail(
          user.email,
          user.fullName,
          user.role,
        );
        this.logger.log(`Rejection email sent to ${user.fullName} (${user.email})`);
      } catch (error) {
        this.logger.error(`Failed to send rejection email to ${user.fullName}: ${error.message}`);
        // Don't fail the rejection if email fails
      }
    }

    return {
      message: 'User rejected',
      user: this.formatUser(savedUser),
    };
  }

  async suspendUser(id: number, suspendedBy: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['phcCenter'],
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.role === 'admin') {
      throw new BadRequestException('Cannot suspend an admin user');
    }

    const previousStatus = user.status;
    user.status = 'suspended';

    const savedUser = await this.usersRepository.save(user);

    // Log the suspension action
    await this.auditService.log({
      userId: suspendedBy,
      action: 'SUSPEND',
      resource: 'USER',
      resourceId: user.id,
      details: {
        staffName: user.fullName,
        staffEmail: user.email,
        staffRole: user.role,
        suspendedAt: new Date(),
        previousStatus,
      },
      facilityId: user.phcCenterId,
    });
    this.logger.log(`Audit log created: User ${user.fullName} suspended by user ID ${suspendedBy}`);

    return {
      message: 'User suspended',
      user: this.formatUser(savedUser),
    };
  }

  async reactivateUser(id: number, reactivatedBy: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['phcCenter'],
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.status === 'approved') {
      throw new BadRequestException('User is already active');
    }

    const previousStatus = user.status;
    user.status = 'approved';
    user.approvedAt = new Date();
    user.approvedBy = reactivatedBy;

    const savedUser = await this.usersRepository.save(user);

    // Log the reactivation action
    await this.auditService.log({
      userId: reactivatedBy,
      action: 'REACTIVATE',
      resource: 'USER',
      resourceId: user.id,
      details: {
        staffName: user.fullName,
        staffEmail: user.email,
        staffRole: user.role,
        reactivatedAt: new Date(),
        previousStatus,
      },
      facilityId: user.phcCenterId,
    });
    this.logger.log(`Audit log created: User ${user.fullName} reactivated by user ID ${reactivatedBy}`);

    return {
      message: 'User reactivated successfully',
      user: this.formatUser(savedUser),
    };
  }
}
