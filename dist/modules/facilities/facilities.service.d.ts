import { Repository } from 'typeorm';
import { PhcCenter, PhcCenterStatus } from './entities/phc-center.entity';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';
export declare class FacilitiesService {
    private facilitiesRepository;
    constructor(facilitiesRepository: Repository<PhcCenter>);
    findAllPublic(): Promise<{
        id: number;
        name: string;
    }[]>;
    findAll(includeInactive?: boolean): Promise<{
        id: number;
        name: string;
        address: string;
        phone: string;
        email: string;
        lga: string;
        status: PhcCenterStatus;
        isActive: boolean;
        createdAt: Date;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        address: string;
        phone: string;
        email: string;
        lga: string;
        status: PhcCenterStatus;
        isActive: boolean;
        createdAt: Date;
    }>;
    create(createDto: CreateFacilityDto): Promise<{
        message: string;
        facility: {
            id: number;
            name: string;
            address: string;
            status: PhcCenterStatus;
        };
    }>;
    update(id: number, updateDto: UpdateFacilityDto): Promise<{
        message: string;
    }>;
    activate(id: number): Promise<{
        message: string;
    }>;
    deactivate(id: number): Promise<{
        message: string;
    }>;
    getNotificationTypes(): {
        id: number;
        name: string;
        pathway: string;
        gender: string;
    }[];
}
