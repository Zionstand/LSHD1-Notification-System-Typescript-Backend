import { Repository } from 'typeorm';
import { VitalRecord } from './entities/vital-record.entity';
import { CreateVitalRecordDto } from './dto/create-vital-record.dto';
import { Screening } from '../screenings/entities/screening.entity';
export declare class VitalsService {
    private vitalRecordsRepository;
    private screeningsRepository;
    constructor(vitalRecordsRepository: Repository<VitalRecord>, screeningsRepository: Repository<Screening>);
    create(createDto: CreateVitalRecordDto, recordedBy: number): Promise<VitalRecord>;
    findByPatient(patientId: number): Promise<VitalRecord[]>;
    findByScreening(screeningId: number): Promise<VitalRecord[]>;
    findOne(id: number): Promise<VitalRecord>;
    getLatestByPatient(patientId: number): Promise<VitalRecord | null>;
    getLatestByScreening(screeningId: number): Promise<VitalRecord | null>;
    formatVitalRecord(record: VitalRecord): {
        id: number;
        patientId: number;
        screeningId: number | null;
        bloodPressure: {
            systolic: number | null;
            diastolic: number | null;
            formatted: string | null;
        };
        temperature: number | null;
        pulseRate: number | null;
        respiratoryRate: number | null;
        weight: number | null;
        height: number | null;
        bmi: number | null;
        bloodSugar: {
            random: number | null;
            fasting: number | null;
        };
        notes: string | null;
        recordedBy: {
            id: number;
            name: string;
        } | null;
        recordedAt: Date;
        createdAt: Date;
    };
}
