import { Repository } from 'typeorm';
import { Patient } from '../patients/entities/patient.entity';
import { Screening } from '../screenings/entities/screening.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
export declare class DashboardService {
    private patientsRepository;
    private screeningsRepository;
    private appointmentsRepository;
    constructor(patientsRepository: Repository<Patient>, screeningsRepository: Repository<Screening>, appointmentsRepository: Repository<Appointment>);
    getStats(facilityId?: number): Promise<{
        totalClients: number;
        todayScreenings: number;
        pendingScreenings: number;
        completedToday: number;
    }>;
    getExtendedStats(facilityId?: number): Promise<{
        totalScreenings: number;
        completedScreenings: number;
        completionRate: number;
        referrals: number;
        referralRate: number;
        thisWeekScreenings: number;
        thisMonthScreenings: number;
        upcomingAppointments: number;
        newClientsThisMonth: number;
        screeningsByType: any;
        last7DaysTrend: {
            date: string;
            count: number;
        }[];
        totalClients: number;
        todayScreenings: number;
        pendingScreenings: number;
        completedToday: number;
    }>;
}
