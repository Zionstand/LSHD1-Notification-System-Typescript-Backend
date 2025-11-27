import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
export declare class PatientsService {
    private patientsRepository;
    constructor(patientsRepository: Repository<Patient>);
    findAll(facilityId?: number): Promise<{
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
    findOne(id: number): Promise<{
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
    create(createPatientDto: CreatePatientDto, userId: number, facilityId: number): Promise<{
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
