import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
export declare class PatientsService {
    private patientsRepository;
    constructor(patientsRepository: Repository<Patient>);
    private formatPatient;
    findAll(facilityId?: number | null): Promise<{
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
        facility_address: string | null;
        lga: string;
        created_at: Date;
    }[]>;
    findOne(id: number): Promise<{
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
        facility_address: string | null;
        lga: string;
        created_at: Date;
    }>;
    create(createPatientDto: CreatePatientDto, userId: number): Promise<{
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
            facility_address: string | null;
            lga: string;
            created_at: Date;
        };
        screeningTypeId: number;
    }>;
}
