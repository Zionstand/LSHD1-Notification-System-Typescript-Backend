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
    // Total clients/patients
    const totalClientsQuery = this.patientsRepository.createQueryBuilder('p');
    if (facilityId) {
      totalClientsQuery.where('p.phcCenterId = :facilityId', { facilityId });
    }
    const totalClients = await totalClientsQuery.getCount();

    // Today's screenings
    const todayScreeningsQuery = this.screeningsRepository
      .createQueryBuilder('s')
      .where('DATE(s.createdAt) = CURDATE()');
    if (facilityId) {
      todayScreeningsQuery.andWhere('s.phcCenterId = :facilityId', { facilityId });
    }
    const todayScreenings = await todayScreeningsQuery.getCount();

    // Pending screenings
    const pendingScreeningsQuery = this.screeningsRepository
      .createQueryBuilder('s')
      .where('s.status IN (:...statuses)', { statuses: ['pending', 'in_progress'] });
    if (facilityId) {
      pendingScreeningsQuery.andWhere('s.phcCenterId = :facilityId', { facilityId });
    }
    const pendingScreenings = await pendingScreeningsQuery.getCount();

    // Completed today
    const completedTodayQuery = this.screeningsRepository
      .createQueryBuilder('s')
      .where('s.status = :status', { status: 'completed' })
      .andWhere('DATE(s.createdAt) = CURDATE()');
    if (facilityId) {
      completedTodayQuery.andWhere('s.phcCenterId = :facilityId', { facilityId });
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
