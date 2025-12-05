import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(status?: string): Promise<{
        id: number;
        email: string;
        fullName: string;
        firstName: string;
        lastName: string;
        phone: string;
        staffId: string;
        status: import("./entities/user.entity").UserStatus;
        isActive: boolean;
        role: import("./entities/user.entity").UserRole;
        facilityId: number;
        facility: string | null;
        createdAt: Date;
        approvedAt: Date;
    }[]>;
    findPending(): Promise<{
        id: number;
        email: string;
        fullName: string;
        firstName: string;
        lastName: string;
        phone: string;
        staffId: string;
        status: import("./entities/user.entity").UserStatus;
        isActive: boolean;
        role: import("./entities/user.entity").UserRole;
        facilityId: number;
        facility: string | null;
        createdAt: Date;
        approvedAt: Date;
    }[]>;
    findOne(id: string): Promise<import("./entities/user.entity").User | null>;
    approveUser(id: string, req: any): Promise<{
        message: string;
        user: {
            id: number;
            email: string;
            fullName: string;
            firstName: string;
            lastName: string;
            phone: string;
            staffId: string;
            status: import("./entities/user.entity").UserStatus;
            isActive: boolean;
            role: import("./entities/user.entity").UserRole;
            facilityId: number;
            facility: string | null;
            createdAt: Date;
            approvedAt: Date;
        };
    }>;
    rejectUser(id: string, req: any): Promise<{
        message: string;
        user: {
            id: number;
            email: string;
            fullName: string;
            firstName: string;
            lastName: string;
            phone: string;
            staffId: string;
            status: import("./entities/user.entity").UserStatus;
            isActive: boolean;
            role: import("./entities/user.entity").UserRole;
            facilityId: number;
            facility: string | null;
            createdAt: Date;
            approvedAt: Date;
        };
    }>;
    suspendUser(id: string, req: any): Promise<{
        message: string;
        user: {
            id: number;
            email: string;
            fullName: string;
            firstName: string;
            lastName: string;
            phone: string;
            staffId: string;
            status: import("./entities/user.entity").UserStatus;
            isActive: boolean;
            role: import("./entities/user.entity").UserRole;
            facilityId: number;
            facility: string | null;
            createdAt: Date;
            approvedAt: Date;
        };
    }>;
    reactivateUser(id: string, req: any): Promise<{
        message: string;
        user: {
            id: number;
            email: string;
            fullName: string;
            firstName: string;
            lastName: string;
            phone: string;
            staffId: string;
            status: import("./entities/user.entity").UserStatus;
            isActive: boolean;
            role: import("./entities/user.entity").UserRole;
            facilityId: number;
            facility: string | null;
            createdAt: Date;
            approvedAt: Date;
        };
    }>;
}
