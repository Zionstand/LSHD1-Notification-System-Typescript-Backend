import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Divider } from './entities/divider.entity';
import { CreateDividerDto } from './dto/create-divider.dto';
import { UpdateDividerDto } from './dto/update-divider.dto';

@Injectable()
export class DividersService {
  private readonly logger = new Logger(DividersService.name);

  constructor(
    @InjectRepository(Divider)
    private dividersRepository: Repository<Divider>,
  ) {}

  /**
   * Generate unique divider code
   */
  private generateDividerCode(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `DIV-${timestamp}-${random}`;
  }

  /**
   * Create a new divider record
   */
  async create(createDividerDto: CreateDividerDto, capturedBy: number, phcCenterId?: number): Promise<Divider> {
    const dividerCode = this.generateDividerCode();

    const divider = this.dividersRepository.create({
      dividerCode,
      fullName: createDividerDto.fullName,
      phone: createDividerDto.phone || null,
      address: createDividerDto.address || null,
      lga: createDividerDto.lga || null,
      ward: createDividerDto.ward || null,
      community: createDividerDto.community || null,
      notes: createDividerDto.notes || null,
      status: 'active',
      capturedBy,
      phcCenterId: phcCenterId || null,
    });

    const savedDivider = await this.dividersRepository.save(divider);
    this.logger.log(`Divider created: ${savedDivider.dividerCode} by user ${capturedBy}`);

    return this.findOne(savedDivider.id);
  }

  /**
   * Get all dividers with optional filtering
   */
  async findAll(filters?: {
    phcCenterId?: number;
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ dividers: Divider[]; total: number }> {
    const query = this.dividersRepository.createQueryBuilder('divider')
      .leftJoinAndSelect('divider.phcCenter', 'phcCenter')
      .leftJoinAndSelect('divider.capturedByUser', 'capturedByUser');

    if (filters?.phcCenterId) {
      query.andWhere('divider.phcCenterId = :phcCenterId', { phcCenterId: filters.phcCenterId });
    }

    if (filters?.status) {
      query.andWhere('divider.status = :status', { status: filters.status });
    }

    if (filters?.search) {
      query.andWhere(
        '(divider.fullName LIKE :search OR divider.dividerCode LIKE :search OR divider.phone LIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    const total = await query.getCount();

    query.orderBy('divider.createdAt', 'DESC');

    if (filters?.limit) {
      query.take(filters.limit);
    }
    if (filters?.offset) {
      query.skip(filters.offset);
    }

    const dividers = await query.getMany();
    return { dividers, total };
  }

  /**
   * Get a single divider by ID
   */
  async findOne(id: number): Promise<Divider> {
    const divider = await this.dividersRepository.findOne({
      where: { id },
      relations: ['phcCenter', 'capturedByUser'],
    });

    if (!divider) {
      throw new NotFoundException(`Divider with ID ${id} not found`);
    }

    return divider;
  }

  /**
   * Update a divider
   */
  async update(id: number, updateDividerDto: UpdateDividerDto): Promise<Divider> {
    const divider = await this.findOne(id);

    if (updateDividerDto.fullName) divider.fullName = updateDividerDto.fullName;
    if (updateDividerDto.phone !== undefined) divider.phone = updateDividerDto.phone || null;
    if (updateDividerDto.address !== undefined) divider.address = updateDividerDto.address || null;
    if (updateDividerDto.lga !== undefined) divider.lga = updateDividerDto.lga || null;
    if (updateDividerDto.ward !== undefined) divider.ward = updateDividerDto.ward || null;
    if (updateDividerDto.community !== undefined) divider.community = updateDividerDto.community || null;
    if (updateDividerDto.notes !== undefined) divider.notes = updateDividerDto.notes || null;
    if (updateDividerDto.status) divider.status = updateDividerDto.status;

    await this.dividersRepository.save(divider);
    return this.findOne(id);
  }

  /**
   * Deactivate a divider
   */
  async deactivate(id: number): Promise<Divider> {
    const divider = await this.findOne(id);
    divider.status = 'inactive';
    await this.dividersRepository.save(divider);
    return this.findOne(id);
  }

  /**
   * Activate a divider
   */
  async activate(id: number): Promise<Divider> {
    const divider = await this.findOne(id);
    divider.status = 'active';
    await this.dividersRepository.save(divider);
    return this.findOne(id);
  }

  /**
   * Get divider statistics
   */
  async getStats(phcCenterId?: number): Promise<{
    total: number;
    active: number;
    inactive: number;
  }> {
    const query = this.dividersRepository.createQueryBuilder('divider');

    if (phcCenterId) {
      query.andWhere('divider.phcCenterId = :phcCenterId', { phcCenterId });
    }

    const [total, active, inactive] = await Promise.all([
      query.clone().getCount(),
      query.clone().andWhere('divider.status = :status', { status: 'active' }).getCount(),
      query.clone().andWhere('divider.status = :status', { status: 'inactive' }).getCount(),
    ]);

    return { total, active, inactive };
  }
}
