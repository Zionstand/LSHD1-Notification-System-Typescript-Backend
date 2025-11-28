import { PatientsService } from './patients.service';
import { ScreeningsService } from '../screenings/screenings.service';
import { CreatePatientDto } from './dto/create-patient.dto';
export declare class PatientsController {
    private patientsService;
    private screeningsService;
    constructor(patientsService: PatientsService, screeningsService: ScreeningsService);
    findAll(req: any): Promise<{
        id: number;
        client_id: string;
        full_name: string;
        first_name: string;
        last_name: string;
        age: number;
        date_of_birth: Date;
        gender: string;
        phone: string;
        address: string;
        next_of_kin: string;
        next_of_kin_phone: string;
        facility_id: number;
        facility_name: string | null;
        lga: string;
        created_at: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: number;
        client_id: string;
        full_name: string;
        first_name: string;
        last_name: string;
        age: number;
        date_of_birth: Date;
        gender: string;
        phone: string;
        address: string;
        next_of_kin: string;
        next_of_kin_phone: string;
        facility_id: number;
        facility_name: string | null;
        lga: string;
        created_at: Date;
    }>;
    create(createPatientDto: CreatePatientDto, req: any): Promise<{
        message: string;
        client: {
            id: number;
            client_id: string;
            full_name: string;
            first_name: string;
            last_name: string;
            age: number;
            date_of_birth: Date;
            gender: string;
            phone: string;
            address: string;
            next_of_kin: string;
            next_of_kin_phone: string;
            facility_id: number;
            facility_name: string | null;
            lga: string;
            created_at: Date;
        };
        screening: {
            id: number;
            sessionId: string;
            status: import("../screenings/entities").ScreeningStatus;
        };
    }>;
}
