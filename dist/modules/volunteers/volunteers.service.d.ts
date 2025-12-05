import { Repository } from 'typeorm';
import { Volunteer } from './entities/volunteer.entity';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
export declare class VolunteersService {
    private volunteersRepository;
    private readonly logger;
    constructor(volunteersRepository: Repository<Volunteer>);
    private generateVolunteerCode;
    private splitName;
    create(createVolunteerDto: CreateVolunteerDto, registeredBy: number, phcCenterId?: number): Promise<Volunteer>;
    findAll(filters?: {
        phcCenterId?: number;
        status?: string;
        gender?: string;
        trainingCompleted?: boolean;
        search?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        volunteers: Volunteer[];
        total: number;
    }>;
    findOne(id: number): Promise<Volunteer>;
    update(id: number, updateVolunteerDto: UpdateVolunteerDto): Promise<Volunteer>;
    activate(id: number): Promise<Volunteer>;
    deactivate(id: number): Promise<Volunteer>;
    markTrainingCompleted(id: number, trainingDate?: string): Promise<Volunteer>;
    getStats(phcCenterId?: number): Promise<{
        total: number;
        active: number;
        inactive: number;
        pending: number;
        trained: number;
        untrained: number;
    }>;
}
