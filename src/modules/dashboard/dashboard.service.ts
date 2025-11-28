import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../patients/entities/patient.entity';
import { Screening } from '../screenings/entities/screening.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
    @InjectRepository(Screening)
    private screeningsRepository: Repository<Screening>,
  ) {}

  async getStats(facilityId?: number) {
    // Only filter by facility if facilityId is a valid positive number
    const shouldFilterByFacility = facilityId && facilityId > 0;

    // Total clients/patients
    const totalClientsQuery = this.patientsRepository.createQueryBuilder('p');
    if (shouldFilterByFacility) {
      totalClientsQuery.where('p.phcCenterId = :facilityId', { facilityId });
    }
    const totalClients = await totalClientsQuery.getCount();

    // Today's screenings - join with patient to filter by facility
    const todayScreeningsQuery = this.screeningsRepository
      .createQueryBuilder('s')
      .leftJoin('s.patient', 'p')
      .where('DATE(s.createdAt) = CURDATE()');
    if (shouldFilterByFacility) {
      todayScreeningsQuery.andWhere('p.phcCenterId = :facilityId', { facilityId });
    }
    const todayScreenings = await todayScreeningsQuery.getCount();

    // Pending screenings - join with patient to filter by facility
    const pendingScreeningsQuery = this.screeningsRepository
      .createQueryBuilder('s')
      .leftJoin('s.patient', 'p')
      .where('s.status IN (:...statuses)', { statuses: ['pending', 'in_progress'] });
    if (shouldFilterByFacility) {
      pendingScreeningsQuery.andWhere('p.phcCenterId = :facilityId', { facilityId });
    }
    const pendingScreenings = await pendingScreeningsQuery.getCount();

    // Completed today - join with patient to filter by facility
    const completedTodayQuery = this.screeningsRepository
      .createQueryBuilder('s')
      .leftJoin('s.patient', 'p')
      .where('s.status = :status', { status: 'completed' })
      .andWhere('DATE(s.createdAt) = CURDATE()');
    if (shouldFilterByFacility) {
      completedTodayQuery.andWhere('p.phcCenterId = :facilityId', { facilityId });
    }
    const completedToday = await completedTodayQuery.getCount();

    return {
      totalClients,
      todayScreenings,
      pendingScreenings,
      completedToday,
    };
  }
}
