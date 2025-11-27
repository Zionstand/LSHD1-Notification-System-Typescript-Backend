import { Repository } from 'typeorm';
import { Patient } from '../patients/entities/patient.entity';
import { Screening } from '../screenings/entities/screening.entity';
export declare class DashboardService {
    private patientsRepository;
    private screeningsRepository;
    constructor(patientsRepository: Repository<Patient>, screeningsRepository: Repository<Screening>);
    getStats(facilityId?: number): Promise<{
        totalClients: number;
        todayScreenings: number;
        pendingScreenings: number;
        completedToday: number;
    }>;
}
