import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhcCenter, PhcCenterStatus } from './entities/phc-center.entity';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';

@Injectable()
export class FacilitiesService {
  constructor(
    @InjectRepository(PhcCenter)
    private facilitiesRepository: Repository<PhcCenter>,
  ) {}

  // Public endpoint - returns minimal data for registration dropdown
  async findAllPublic() {
    const facilities = await this.facilitiesRepository.find({
      where: { status: 'active' },
      order: { centerName: 'ASC' },
      select: ['id', 'centerName'],
    });

    return facilities.map((f) => ({
      id: f.id,
      name: f.centerName,
    }));
  }

  async findAll(includeInactive: boolean = false) {
    const queryBuilder = this.facilitiesRepository.createQueryBuilder('f');

    if (!includeInactive) {
      queryBuilder.where('f.status = :status', { status: 'active' });
    }

    queryBuilder.orderBy('f.centerName', 'ASC');

    const facilities = await queryBuilder.getMany();

    return facilities.map((f) => ({
      id: f.id,
      name: f.centerName,
      address: f.address,
      phone: f.phone,
      email: f.email,
      lga: f.lga,
      status: f.status,
      isActive: f.status === 'active',
      createdAt: f.createdAt,
    }));
  }

  async findOne(id: number) {
    const facility = await this.facilitiesRepository.findOne({ where: { id } });

    if (!facility) {
      throw new NotFoundException('Facility not found');
    }

    return {
      id: facility.id,
      name: facility.centerName,
      address: facility.address,
      phone: facility.phone,
      email: facility.email,
      lga: facility.lga,
      status: facility.status,
      isActive: facility.status === 'active',
      createdAt: facility.createdAt,
    };
  }

  async create(createDto: CreateFacilityDto) {
    const facility = this.facilitiesRepository.create({
      centerName: createDto.centerName,
      address: createDto.address,
      phone: createDto.phone || null,
      email: createDto.email || null,
      lga: createDto.lga || null,
      status: 'active',
    } as Partial<PhcCenter>);

    const saved = await this.facilitiesRepository.save(facility);

    return {
      message: 'Facility created successfully',
      facility: {
        id: saved.id,
        name: saved.centerName,
        address: saved.address,
        status: saved.status,
      },
    };
  }

  async update(id: number, updateDto: UpdateFacilityDto) {
    const facility = await this.facilitiesRepository.findOne({ where: { id } });

    if (!facility) {
      throw new NotFoundException('Facility not found');
    }

    if (updateDto.centerName) facility.centerName = updateDto.centerName;
    if (updateDto.address) facility.address = updateDto.address;
    if (updateDto.phone !== undefined) facility.phone = updateDto.phone;
    if (updateDto.email !== undefined) facility.email = updateDto.email;
    if (updateDto.lga !== undefined) facility.lga = updateDto.lga;
    if (updateDto.status) facility.status = updateDto.status as PhcCenterStatus;

    await this.facilitiesRepository.save(facility);

    return { message: 'Facility updated successfully' };
  }

  async activate(id: number) {
    const facility = await this.facilitiesRepository.findOne({ where: { id } });

    if (!facility) {
      throw new NotFoundException('Facility not found');
    }

    facility.status = 'active';
    await this.facilitiesRepository.save(facility);

    return { message: 'Facility activated' };
  }

  async deactivate(id: number) {
    const facility = await this.facilitiesRepository.findOne({ where: { id } });

    if (!facility) {
      throw new NotFoundException('Facility not found');
    }

    facility.status = 'inactive';
    await this.facilitiesRepository.save(facility);

    return { message: 'Facility deactivated' };
  }

  // Static notification types
  getNotificationTypes() {
    return [
      { id: 1, name: 'Hypertension Screening', pathway: 'hypertension' },
      { id: 2, name: 'Diabetes Screening', pathway: 'diabetes' },
      { id: 3, name: 'Cervical Cancer Screening', pathway: 'cervical' },
      { id: 4, name: 'Breast Cancer Screening', pathway: 'breast' },
      { id: 5, name: 'PSA Screening', pathway: 'psa' },
    ];
  }
}
