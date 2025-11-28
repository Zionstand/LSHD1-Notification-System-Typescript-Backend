import { Repository } from 'typeorm';
import { Screening } from './entities/screening.entity';
import { CreateScreeningDto } from './dto/create-screening.dto';
import { UpdateVitalsDto } from './dto/update-vitals.dto';
import { CompleteScreeningDto } from './dto/complete-screening.dto';
import { DoctorAssessmentDto } from './dto/doctor-assessment.dto';
export declare class ScreeningsService {
    private screeningsRepository;
    constructor(screeningsRepository: Repository<Screening>);
    findAll(facilityId?: number, status?: string): Promise<{
        id: number;
        sessionId: string;
        status: import("./entities/screening.entity").ScreeningStatus;
        createdAt: Date;
        screeningDate: Date;
        screeningTime: string;
        client: {
            id: number;
            clientId: string;
            firstName: string;
            lastName: string;
        };
        notificationType: {
            id: number;
            name: string;
            pathway: string;
        };
        conductedBy: string | null;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        sessionId: string;
        status: import("./entities/screening.entity").ScreeningStatus;
        createdAt: Date;
        screeningDate: Date;
        screeningTime: string;
        client: {
            id: number;
            clientId: string;
            firstName: string;
            lastName: string;
        };
        notificationType: {
            id: number;
            name: string;
            pathway: string;
        };
        conductedBy: string | null;
        vitals: {
            bloodPressureSystolic: number;
            bloodPressureDiastolic: number;
            temperature: number;
            pulseRate: number;
            respiratoryRate: number;
            weight: number;
            height: number;
            bmi: number;
        };
        results: {
            diagnosis: string;
            prescription: string;
            recommendations: string;
            nextAppointment: Date;
        };
    }>;
    create(createDto: CreateScreeningDto, userId: number, facilityId: number): Promise<{
        message: string;
        session: {
            id: number;
            sessionId: string;
            status: import("./entities/screening.entity").ScreeningStatus;
        };
    }>;
    updateVitals(id: number, updateDto: UpdateVitalsDto): Promise<{
        message: string;
    }>;
    complete(id: number, completeDto: CompleteScreeningDto): Promise<{
        message: string;
    }>;
    addDoctorAssessment(id: number, dto: DoctorAssessmentDto, doctorId: number): Promise<{
        message: string;
        screening: {
            id: number;
            patientStatus: string;
            status: "completed" | "follow_up";
            doctorAssessedAt: Date;
        };
    }>;
    findPendingDoctorReview(facilityId?: number): Promise<{
        id: number;
        sessionId: string;
        status: import("./entities/screening.entity").ScreeningStatus;
        createdAt: Date;
        screeningDate: Date;
        screeningTime: string;
        client: {
            id: number;
            clientId: string;
            firstName: string;
            lastName: string;
        };
        notificationType: {
            id: number;
            name: string;
            pathway: string;
        };
        conductedBy: string | null;
        vitals: {
            bloodPressureSystolic: number;
            bloodPressureDiastolic: number;
            temperature: number;
            pulseRate: number;
            weight: number;
        };
    }[]>;
    findByPatient(patientId: number): Promise<{
        id: number;
        sessionId: string;
        status: import("./entities/screening.entity").ScreeningStatus;
        createdAt: Date;
        screeningDate: Date;
        screeningTime: string;
        notificationType: {
            id: number;
            name: string;
            pathway: string;
        };
        conductedBy: string | null;
        vitals: {
            bloodPressureSystolic: number;
            bloodPressureDiastolic: number;
            temperature: number;
            pulseRate: number;
            respiratoryRate: number;
            weight: number;
            height: number;
            bmi: number;
        };
        results: {
            diagnosis: string;
            prescription: string;
            recommendations: string;
            nextAppointment: Date;
        };
    }[]>;
}
