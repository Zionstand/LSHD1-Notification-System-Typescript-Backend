import { FacilitiesService } from './facilities.service';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';
export declare class FacilitiesController {
    private facilitiesService;
    constructor(facilitiesService: FacilitiesService);
    findAll(includeInactive?: string): Promise<{
        id: number;
        name: string;
        address: string;
        phone: string;
        email: string;
        lga: string;
        status: import("./entities/phc-center.entity").PhcCenterStatus;
        isActive: boolean;
        createdAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: number;
        name: string;
        address: string;
        phone: string;
        email: string;
        lga: string;
        status: import("./entities/phc-center.entity").PhcCenterStatus;
        isActive: boolean;
        createdAt: Date;
    }>;
    create(createDto: CreateFacilityDto): Promise<{
        message: string;
        facility: {
            id: number;
            name: string;
            address: string;
            status: import("./entities/phc-center.entity").PhcCenterStatus;
        };
    }>;
    update(id: string, updateDto: UpdateFacilityDto): Promise<{
        message: string;
    }>;
    activate(id: string): Promise<{
        message: string;
    }>;
    deactivate(id: string): Promise<{
        message: string;
    }>;
}
export declare class NotificationTypesController {
    private facilitiesService;
    constructor(facilitiesService: FacilitiesService);
    getNotificationTypes(): Promise<{
        id: number;
        name: string;
        pathway: string;
    }[]>;
}
