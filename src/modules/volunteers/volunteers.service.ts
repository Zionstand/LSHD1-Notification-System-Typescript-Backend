import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Volunteer } from './entities/volunteer.entity';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';

@Injectable()
export class VolunteersService {
  private readonly logger = new Logger(VolunteersService.name);

  constructor(
    @InjectRepository(Volunteer)
    private volunteersRepository: Repository<Volunteer>,
  ) {}

  /**
   * Generate unique volunteer code
   */
  private generateVolunteerCode(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `VOL-${timestamp}-${random}`;
  }

  /**
   * Split full name into first and last name
   */
  private splitName(fullName: string): { firstName: string; lastName: string } {
    const parts = fullName.trim().split(/\s+/);
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || '';
    return { firstName, lastName };
  }

  /**
   * Create a new volunteer
   */
  async create(createVolunteerDto: CreateVolunteerDto, registeredBy: number, phcCenterId?: number): Promise<Volunteer> {
    const volunteerCode = this.generateVolunteerCode();
    const { firstName, lastName } = this.splitName(createVolunteerDto.fullName);

    const volunteer = this.volunteersRepository.create({
      volunteerCode,
      fullName: createVolunteerDto.fullName,
      firstName,
      lastName,
      phone: createVolunteerDto.phone,
      altPhone: createVolunteerDto.altPhone || null,
      email: createVolunteerDto.email || null,
      gender: createVolunteerDto.gender,
      age: createVolunteerDto.age || null,
      dateOfBirth: createVolunteerDto.dateOfBirth ? new Date(createVolunteerDto.dateOfBirth) : null,
      address: createVolunteerDto.address || null,
      lga: createVolunteerDto.lga || null,
      ward: createVolunteerDto.ward || null,
      community: createVolunteerDto.community || null,
      occupation: createVolunteerDto.occupation || null,
      educationLevel: createVolunteerDto.educationLevel || null,
      nextOfKin: createVolunteerDto.nextOfKin || null,
      nextOfKinPhone: createVolunteerDto.nextOfKinPhone || null,
      skills: createVolunteerDto.skills || null,
      notes: createVolunteerDto.notes || null,
      status: 'pending',
      trainingCompleted: 0,
      registeredBy,
      phcCenterId: phcCenterId || null,
    });

    const savedVolunteer = await this.volunteersRepository.save(volunteer);
    this.logger.log(`Volunteer registered: ${savedVolunteer.volunteerCode} by user ${registeredBy}`);

    return this.findOne(savedVolunteer.id);
  }

  /**
   * Get all volunteers with optional filtering
   */
  async findAll(filters?: {
    phcCenterId?: number;
    status?: string;
    gender?: string;
    trainingCompleted?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ volunteers: Volunteer[]; total: number }> {
    const query = this.volunteersRepository.createQueryBuilder('volunteer')
      .leftJoinAndSelect('volunteer.phcCenter', 'phcCenter')
      .leftJoinAndSelect('volunteer.registeredByUser', 'registeredByUser');

    if (filters?.phcCenterId) {
      query.andWhere('volunteer.phcCenterId = :phcCenterId', { phcCenterId: filters.phcCenterId });
    }

    if (filters?.status) {
      query.andWhere('volunteer.status = :status', { status: filters.status });
    }

    if (filters?.gender) {
      query.andWhere('volunteer.gender = :gender', { gender: filters.gender });
    }

    if (filters?.trainingCompleted !== undefined) {
      query.andWhere('volunteer.trainingCompleted = :trainingCompleted', {
        trainingCompleted: filters.trainingCompleted ? 1 : 0,
      });
    }

    if (filters?.search) {
      query.andWhere(
        '(volunteer.fullName LIKE :search OR volunteer.volunteerCode LIKE :search OR volunteer.phone LIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    const total = await query.getCount();

    query.orderBy('volunteer.createdAt', 'DESC');

    if (filters?.limit) {
      query.take(filters.limit);
    }
    if (filters?.offset) {
      query.skip(filters.offset);
    }

    const volunteers = await query.getMany();
    return { volunteers, total };
  }

  /**
   * Get a single volunteer by ID
   */
  async findOne(id: number): Promise<Volunteer> {
    const volunteer = await this.volunteersRepository.findOne({
      where: { id },
      relations: ['phcCenter', 'registeredByUser'],
    });

    if (!volunteer) {
      throw new NotFoundException(`Volunteer with ID ${id} not found`);
    }

    return volunteer;
  }

  /**
   * Update a volunteer
   */
  async update(id: number, updateVolunteerDto: UpdateVolunteerDto): Promise<Volunteer> {
    const volunteer = await this.findOne(id);

    if (updateVolunteerDto.fullName) {
      volunteer.fullName = updateVolunteerDto.fullName;
      const { firstName, lastName } = this.splitName(updateVolunteerDto.fullName);
      volunteer.firstName = firstName;
      volunteer.lastName = lastName;
    }
    if (updateVolunteerDto.phone) volunteer.phone = updateVolunteerDto.phone;
    if (updateVolunteerDto.altPhone !== undefined) volunteer.altPhone = updateVolunteerDto.altPhone || null;
    if (updateVolunteerDto.email !== undefined) volunteer.email = updateVolunteerDto.email || null;
    if (updateVolunteerDto.gender) volunteer.gender = updateVolunteerDto.gender;
    if (updateVolunteerDto.age !== undefined) volunteer.age = updateVolunteerDto.age || null;
    if (updateVolunteerDto.dateOfBirth !== undefined) {
      volunteer.dateOfBirth = updateVolunteerDto.dateOfBirth ? new Date(updateVolunteerDto.dateOfBirth) : null;
    }
    if (updateVolunteerDto.address !== undefined) volunteer.address = updateVolunteerDto.address || null;
    if (updateVolunteerDto.lga !== undefined) volunteer.lga = updateVolunteerDto.lga || null;
    if (updateVolunteerDto.ward !== undefined) volunteer.ward = updateVolunteerDto.ward || null;
    if (updateVolunteerDto.community !== undefined) volunteer.community = updateVolunteerDto.community || null;
    if (updateVolunteerDto.occupation !== undefined) volunteer.occupation = updateVolunteerDto.occupation || null;
    if (updateVolunteerDto.educationLevel !== undefined) volunteer.educationLevel = updateVolunteerDto.educationLevel || null;
    if (updateVolunteerDto.nextOfKin !== undefined) volunteer.nextOfKin = updateVolunteerDto.nextOfKin || null;
    if (updateVolunteerDto.nextOfKinPhone !== undefined) volunteer.nextOfKinPhone = updateVolunteerDto.nextOfKinPhone || null;
    if (updateVolunteerDto.skills !== undefined) volunteer.skills = updateVolunteerDto.skills || null;
    if (updateVolunteerDto.notes !== undefined) volunteer.notes = updateVolunteerDto.notes || null;
    if (updateVolunteerDto.status) volunteer.status = updateVolunteerDto.status;
    if (updateVolunteerDto.trainingCompleted !== undefined) {
      volunteer.trainingCompleted = updateVolunteerDto.trainingCompleted ? 1 : 0;
    }
    if (updateVolunteerDto.trainingDate !== undefined) {
      volunteer.trainingDate = updateVolunteerDto.trainingDate ? new Date(updateVolunteerDto.trainingDate) : null;
    }

    await this.volunteersRepository.save(volunteer);
    return this.findOne(id);
  }

  /**
   * Activate a volunteer
   */
  async activate(id: number): Promise<Volunteer> {
    const volunteer = await this.findOne(id);
    volunteer.status = 'active';
    await this.volunteersRepository.save(volunteer);
    return this.findOne(id);
  }

  /**
   * Deactivate a volunteer
   */
  async deactivate(id: number): Promise<Volunteer> {
    const volunteer = await this.findOne(id);
    volunteer.status = 'inactive';
    await this.volunteersRepository.save(volunteer);
    return this.findOne(id);
  }

  /**
   * Mark training as completed
   */
  async markTrainingCompleted(id: number, trainingDate?: string): Promise<Volunteer> {
    const volunteer = await this.findOne(id);
    volunteer.trainingCompleted = 1;
    volunteer.trainingDate = trainingDate ? new Date(trainingDate) : new Date();
    await this.volunteersRepository.save(volunteer);
    return this.findOne(id);
  }

  /**
   * Get volunteer statistics
   */
  async getStats(phcCenterId?: number): Promise<{
    total: number;
    active: number;
    inactive: number;
    pending: number;
    trained: number;
    untrained: number;
  }> {
    const query = this.volunteersRepository.createQueryBuilder('volunteer');

    if (phcCenterId) {
      query.andWhere('volunteer.phcCenterId = :phcCenterId', { phcCenterId });
    }

    const [total, active, inactive, pending, trained, untrained] = await Promise.all([
      query.clone().getCount(),
      query.clone().andWhere('volunteer.status = :status', { status: 'active' }).getCount(),
      query.clone().andWhere('volunteer.status = :status', { status: 'inactive' }).getCount(),
      query.clone().andWhere('volunteer.status = :status', { status: 'pending' }).getCount(),
      query.clone().andWhere('volunteer.trainingCompleted = :trained', { trained: 1 }).getCount(),
      query.clone().andWhere('volunteer.trainingCompleted = :trained', { trained: 0 }).getCount(),
    ]);

    return { total, active, inactive, pending, trained, untrained };
  }
}
