import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
  ) {}

  async findAll(facilityId?: number) {
    const queryBuilder = this.patientsRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.phcCenter', 'c')
      .leftJoinAndSelect('p.registeredByUser', 'u')
      .orderBy('p.createdAt', 'DESC');

    if (facilityId) {
      queryBuilder.where('p.phcCenterId = :facilityId', { facilityId });
    }

    const patients = await queryBuilder.getMany();

    return patients.map((p) => ({
      id: p.id,
      client_id: p.patientNumber,
      first_name: p.firstName,
      last_name: p.lastName,
      date_of_birth: p.dateOfBirth,
      gender: p.gender,
      phone: p.phone,
      address: p.address,
      facility_name: p.phcCenter?.centerName || null,
      created_at: p.createdAt,
    }));
  }

  async findOne(id: number) {
    const patient = await this.patientsRepository.findOne({
      where: { id },
      relations: ['phcCenter'],
    });

    if (!patient) {
      throw new NotFoundException('Client not found');
    }

    return {
      id: patient.id,
      client_id: patient.patientNumber,
      first_name: patient.firstName,
      last_name: patient.lastName,
      date_of_birth: patient.dateOfBirth,
      gender: patient.gender,
      phone: patient.phone,
      address: patient.address,
      facility_name: patient.phcCenter?.centerName || null,
    };
  }

  async create(createPatientDto: CreatePatientDto, userId: number, facilityId: number) {
    // Generate a unique patient number
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const patientNumber = `PAT-${timestamp}-${random}`;

    const patient = this.patientsRepository.create({
      patientNumber,
      firstName: createPatientDto.firstName,
      lastName: createPatientDto.lastName,
      dateOfBirth: new Date(createPatientDto.dateOfBirth),
      gender: createPatientDto.gender.toLowerCase(), // DB uses lowercase enum
      phone: createPatientDto.phone || 'N/A',
      address: createPatientDto.address || 'N/A',
      phcCenterId: facilityId || 1,
      registeredBy: userId,
    });

    const saved = await this.patientsRepository.save(patient);

    return {
      message: 'Client created',
      client: {
        id: saved.id,
        client_id: saved.patientNumber,
        first_name: saved.firstName,
        last_name: saved.lastName,
        date_of_birth: saved.dateOfBirth,
        gender: saved.gender,
        phone: saved.phone,
      },
    };
  }
}
