import { ScreeningsService } from './screenings.service';
import { CreateScreeningDto } from './dto/create-screening.dto';
import { UpdateVitalsDto } from './dto/update-vitals.dto';
import { CompleteScreeningDto } from './dto/complete-screening.dto';
export declare class ScreeningsController {
    private screeningsService;
    constructor(screeningsService: ScreeningsService);
    findAll(req: any, status?: string): Promise<{
        id: number;
        sessionId: string;
        status: import("./entities").ScreeningStatus;
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
    findOne(id: string): Promise<{
        id: number;
        sessionId: string;
        status: import("./entities").ScreeningStatus;
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
    create(createDto: CreateScreeningDto, req: any): Promise<{
        message: string;
        session: {
            id: number;
            sessionId: string;
            status: import("./entities").ScreeningStatus;
        };
    }>;
    updateVitals(id: string, updateDto: UpdateVitalsDto): Promise<{
        message: string;
    }>;
    complete(id: string, completeDto: CompleteScreeningDto): Promise<{
        message: string;
    }>;
}
