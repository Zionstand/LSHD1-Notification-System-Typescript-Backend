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

  private formatPatient(p: Patient) {
    // Handle backwards compatibility: construct fullName if not present
    const fullName = p.fullName || `${p.firstName || ''} ${p.lastName || ''}`.trim();

    // Extract first and last name from fullName for backwards compatibility
    const nameParts = fullName?.split(' ') || [];
    const firstName = p.firstName || nameParts[0] || '';
    const lastName = p.lastName || nameParts.slice(1).join(' ') || '';

    // Calculate age from dateOfBirth if age is not present
    let age = p.age;
    if (age === null || age === undefined) {
      if (p.dateOfBirth) {
        const birthDate = new Date(p.dateOfBirth);
        const today = new Date();
        age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
      } else {
        age = 0;
      }
    }

    return {
      id: p.id,
      client_id: p.patientNumber,
      full_name: fullName,
      first_name: firstName,
      last_name: lastName,
      age: age,
      date_of_birth: p.dateOfBirth,
      gender: p.gender,
      phone: p.phone,
      address: p.address,
      next_of_kin: p.nextOfKin || p.emergencyContact || '',
      next_of_kin_phone: p.nextOfKinPhone || p.emergencyPhone || '',
      facility_id: p.phcCenterId,
      facility_name: p.phcCenter?.centerName || null,
      lga: p.lga,
      created_at: p.createdAt,
    };
  }

  async findAll(facilityId?: number | null) {
    const queryBuilder = this.patientsRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.phcCenter', 'c')
      .leftJoinAndSelect('p.registeredByUser', 'u')
      .orderBy('p.createdAt', 'DESC');

    // Only filter by facility if facilityId is a valid positive number
    // Admin users (no facility) should see all clients
    if (facilityId && facilityId > 0) {
      queryBuilder.where('p.phcCenterId = :facilityId', { facilityId });
    }

    const patients = await queryBuilder.getMany();

    return patients.map((p) => this.formatPatient(p));
  }

  async findOne(id: number) {
    const patient = await this.patientsRepository.findOne({
      where: { id },
      relations: ['phcCenter'],
    });

    if (!patient) {
      throw new NotFoundException('Client not found');
    }

    return this.formatPatient(patient);
  }

  async create(createPatientDto: CreatePatientDto, userId: number) {
    // Generate a unique patient number
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const patientNumber = `PAT-${timestamp}-${random}`;

    // Extract first and last name from fullName for backwards compatibility
    const nameParts = createPatientDto.fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const patient = this.patientsRepository.create({
      patientNumber,
      fullName: createPatientDto.fullName.trim(),
      firstName,
      lastName,
      age: createPatientDto.age,
      gender: createPatientDto.gender.toLowerCase(),
      phone: createPatientDto.phone,
      address: createPatientDto.address,
      phcCenterId: createPatientDto.phcCenterId,
      nextOfKin: createPatientDto.nextOfKin,
      nextOfKinPhone: createPatientDto.nextOfKinPhone,
      lga: createPatientDto.lga || null,
      email: createPatientDto.email || null,
      altPhone: createPatientDto.altPhone || null,
      registeredBy: userId,
    } as Partial<Patient>);

    const saved = await this.patientsRepository.save(patient);

    // Handle both single entity and array return from save
    const savedPatient = Array.isArray(saved) ? saved[0] : saved;

    // Return the saved patient along with the screeningTypeId for creating screening
    return {
      message: 'Client registered successfully',
      client: this.formatPatient(savedPatient),
      screeningTypeId: createPatientDto.screeningTypeId,
    };
  }
}
