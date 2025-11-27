import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
export declare class PatientsController {
    private patientsService;
    constructor(patientsService: PatientsService);
    findAll(req: any): Promise<{
        id: number;
        client_id: string;
        first_name: string;
        last_name: string;
        date_of_birth: Date;
        gender: string;
        phone: string;
        address: string;
        facility_name: string | null;
        created_at: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: number;
        client_id: string;
        first_name: string;
        last_name: string;
        date_of_birth: Date;
        gender: string;
        phone: string;
        address: string;
        facility_name: string | null;
    }>;
    create(createPatientDto: CreatePatientDto, req: any): Promise<{
        message: string;
        client: {
            id: number;
            client_id: string;
            first_name: string;
            last_name: string;
            date_of_birth: Date;
            gender: string;
            phone: string;
        };
    }>;
}
