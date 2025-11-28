import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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
    return {
      message: 'User approved successfully',
      user: this.formatUser(savedUser),
    };
  }

  async rejectUser(id: number) {
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

    user.status = 'rejected';

    const savedUser = await this.usersRepository.save(user);
    return {
      message: 'User rejected',
      user: this.formatUser(savedUser),
    };
  }

  async suspendUser(id: number) {
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

    user.status = 'suspended';

    const savedUser = await this.usersRepository.save(user);
    return {
      message: 'User suspended',
      user: this.formatUser(savedUser),
    };
  }

  async reactivateUser(id: number, approvedBy: number) {
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

    user.status = 'approved';
    user.approvedAt = new Date();
    user.approvedBy = approvedBy;

    const savedUser = await this.usersRepository.save(user);
    return {
      message: 'User reactivated successfully',
      user: this.formatUser(savedUser),
    };
  }
}
