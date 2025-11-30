import { Repository } from 'typeorm';
import { Screening } from '../screenings/entities/screening.entity';
import { Patient } from '../patients/entities/patient.entity';
import { HypertensionScreening } from '../screenings/entities/hypertension-screening.entity';
import { DiabetesScreening } from '../screenings/entities/diabetes-screening.entity';
import { CervicalScreening } from '../screenings/entities/cervical-screening.entity';
import { BreastScreening } from '../screenings/entities/breast-screening.entity';
import { PsaScreening } from '../screenings/entities/psa-screening.entity';
export interface ReportFilters {
    facilityId?: number;
    screeningType?: string;
    startDate?: Date;
    endDate?: Date;
    status?: string;
}
export interface ScreeningSummary {
    totalScreenings: number;
    completedScreenings: number;
    pendingScreenings: number;
    inProgressScreenings: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
    referralRate: number;
    completionRate: number;
}
export interface FacilityComparison {
    facilityId: number;
    facilityName: string;
    totalScreenings: number;
    completedScreenings: number;
    completionRate: number;
}
export declare class ReportsService {
    private screeningsRepository;
    private patientsRepository;
    private hypertensionRepository;
    private diabetesRepository;
    private cervicalRepository;
    private breastRepository;
    private psaRepository;
    constructor(screeningsRepository: Repository<Screening>, patientsRepository: Repository<Patient>, hypertensionRepository: Repository<HypertensionScreening>, diabetesRepository: Repository<DiabetesScreening>, cervicalRepository: Repository<CervicalScreening>, breastRepository: Repository<BreastScreening>, psaRepository: Repository<PsaScreening>);
    getScreeningSummary(filters?: ReportFilters): Promise<ScreeningSummary>;
    getScreeningDetails(filters?: ReportFilters): Promise<any[]>;
    getFacilityComparison(startDate?: Date, endDate?: Date): Promise<FacilityComparison[]>;
    getAbnormalResults(filters?: ReportFilters): Promise<any[]>;
    getTrendData(facilityId?: number, period?: 'daily' | 'weekly' | 'monthly', days?: number): Promise<{
        date: string;
        count: number;
        completed: number;
    }[]>;
    exportToCSV(filters?: ReportFilters): Promise<string>;
}
