import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Patient } from '../patients/entities/patient.entity';
import { Screening } from '../screenings/entities/screening.entity';
import { Appointment } from '../appointments/entities/appointment.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
    @InjectRepository(Screening)
    private screeningsRepository: Repository<Screening>,
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
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

  async getExtendedStats(facilityId?: number) {
    const basicStats = await this.getStats(facilityId);
    const shouldFilterByFacility = facilityId && facilityId > 0;

    // Screenings by type
    const screeningsByTypeQuery = this.screeningsRepository
      .createQueryBuilder('s')
      .leftJoin('s.patient', 'p')
      .select('s.screeningType', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('s.screeningType');
    if (shouldFilterByFacility) {
      screeningsByTypeQuery.where('p.phcCenterId = :facilityId', { facilityId });
    }
    const screeningsByType = await screeningsByTypeQuery.getRawMany();

    // Total screenings (all time)
    const totalScreeningsQuery = this.screeningsRepository
      .createQueryBuilder('s')
      .leftJoin('s.patient', 'p');
    if (shouldFilterByFacility) {
      totalScreeningsQuery.where('p.phcCenterId = :facilityId', { facilityId });
    }
    const totalScreenings = await totalScreeningsQuery.getCount();

    // Completed screenings (all time)
    const completedScreeningsQuery = this.screeningsRepository
      .createQueryBuilder('s')
      .leftJoin('s.patient', 'p')
      .where('s.status = :status', { status: 'completed' });
    if (shouldFilterByFacility) {
      completedScreeningsQuery.andWhere('p.phcCenterId = :facilityId', { facilityId });
    }
    const completedScreenings = await completedScreeningsQuery.getCount();

    // Calculate completion rate
    const completionRate = totalScreenings > 0
      ? Math.round((completedScreenings / totalScreenings) * 100 * 100) / 100
      : 0;

    // Referrals count
    const referralsQuery = this.screeningsRepository
      .createQueryBuilder('s')
      .leftJoin('s.patient', 'p')
      .where('s.referralFacility IS NOT NULL')
      .andWhere('s.referralFacility != ""');
    if (shouldFilterByFacility) {
      referralsQuery.andWhere('p.phcCenterId = :facilityId', { facilityId });
    }
    const referrals = await referralsQuery.getCount();

    // Referral rate
    const referralRate = totalScreenings > 0
      ? Math.round((referrals / totalScreenings) * 100 * 100) / 100
      : 0;

    // This week's screenings
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const thisWeekQuery = this.screeningsRepository
      .createQueryBuilder('s')
      .leftJoin('s.patient', 'p')
      .where('s.createdAt >= :weekStart', { weekStart });
    if (shouldFilterByFacility) {
      thisWeekQuery.andWhere('p.phcCenterId = :facilityId', { facilityId });
    }
    const thisWeekScreenings = await thisWeekQuery.getCount();

    // This month's screenings
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const thisMonthQuery = this.screeningsRepository
      .createQueryBuilder('s')
      .leftJoin('s.patient', 'p')
      .where('s.createdAt >= :monthStart', { monthStart });
    if (shouldFilterByFacility) {
      thisMonthQuery.andWhere('p.phcCenterId = :facilityId', { facilityId });
    }
    const thisMonthScreenings = await thisMonthQuery.getCount();

    // Upcoming appointments (next 7 days)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const upcomingAppointmentsQuery = this.appointmentsRepository
      .createQueryBuilder('a')
      .leftJoin('a.patient', 'p')
      .where('a.appointmentDate >= :today', { today })
      .andWhere('a.appointmentDate < :nextWeek', { nextWeek })
      .andWhere('a.status = :status', { status: 'scheduled' });
    if (shouldFilterByFacility) {
      upcomingAppointmentsQuery.andWhere('p.phcCenterId = :facilityId', { facilityId });
    }
    const upcomingAppointments = await upcomingAppointmentsQuery.getCount();

    // New clients this month
    const newClientsQuery = this.patientsRepository
      .createQueryBuilder('p')
      .where('p.createdAt >= :monthStart', { monthStart });
    if (shouldFilterByFacility) {
      newClientsQuery.andWhere('p.phcCenterId = :facilityId', { facilityId });
    }
    const newClientsThisMonth = await newClientsQuery.getCount();

    // Screenings trend (last 7 days)
    const last7Days: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayQuery = this.screeningsRepository
        .createQueryBuilder('s')
        .leftJoin('s.patient', 'p')
        .where('DATE(s.createdAt) = :date', { date: dateStr });
      if (shouldFilterByFacility) {
        dayQuery.andWhere('p.phcCenterId = :facilityId', { facilityId });
      }
      const count = await dayQuery.getCount();

      last7Days.push({ date: dateStr, count });
    }

    return {
      ...basicStats,
      totalScreenings,
      completedScreenings,
      completionRate,
      referrals,
      referralRate,
      thisWeekScreenings,
      thisMonthScreenings,
      upcomingAppointments,
      newClientsThisMonth,
      screeningsByType: screeningsByType.reduce((acc, item) => {
        acc[item.type] = parseInt(item.count);
        return acc;
      }, {} as Record<string, number>),
      last7DaysTrend: last7Days,
    };
  }
}
