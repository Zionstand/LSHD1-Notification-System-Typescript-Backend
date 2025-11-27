import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

interface JwtPayload {
  id: number;
  email: string;
  role: UserRole;
  facility_id: number | null;
}

const ROLE_LEVELS: Record<UserRole, number> = {
  admin: 100,
  him_officer: 80,
  doctor: 70,
  nurse: 60,
  lab_scientist: 50,
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
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
            level: ROLE_LEVELS[savedUser.role] || 0,
          },
          facility: null,
        },
      };
    }

    // For non-admin users, just return success message
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

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersRepository.findOne({
      where: { email, status: 'approved' },
      relations: ['phcCenter'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

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
          level: ROLE_LEVELS[user.role] || 0,
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
