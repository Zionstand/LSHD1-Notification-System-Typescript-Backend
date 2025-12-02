import { VitalsService } from './vitals.service';
import { CreateVitalRecordDto } from './dto/create-vital-record.dto';
export declare class VitalsController {
    private readonly vitalsService;
    constructor(vitalsService: VitalsService);
    create(createDto: CreateVitalRecordDto, req: any): Promise<{
        message: string;
        vitalRecord: {
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
    }>;
    findByPatient(patientId: string): Promise<{
        count: number;
        records: {
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
        }[];
    }>;
    getLatestByPatient(patientId: string): Promise<{
        record: null;
    } | {
        record: {
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
    }>;
    findByScreening(screeningId: string): Promise<{
        count: number;
        records: {
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
        }[];
    }>;
    getLatestByScreening(screeningId: string): Promise<{
        record: null;
    } | {
        record: {
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
    }>;
    findOne(id: string): Promise<{
        record: {
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
    }>;
}
