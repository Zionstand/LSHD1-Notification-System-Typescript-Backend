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

  async findAll() {
    const users = await this.usersRepository.find({
      relations: ['phcCenter'],
      order: { createdAt: 'DESC' },
    });

    return users.map((u) => {
      const nameParts = u.fullName?.split(' ') || ['', ''];
      return {
        id: u.id,
        email: u.email,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        isActive: u.status === 'approved',
        role: u.role,
        facility: u.phcCenter?.centerName || null,
        createdAt: u.createdAt,
      };
    });
  }

  async findOne(id: number) {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['phcCenter'],
    });
  }

  async approveUser(id: number, approvedBy: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.status = 'approved';
    user.approvedAt = new Date();
    user.approvedBy = approvedBy;

    return this.usersRepository.save(user);
  }

  async rejectUser(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.status = 'rejected';

    return this.usersRepository.save(user);
  }
}
