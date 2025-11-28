import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
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
    findPendingUsers(): Promise<{
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
    private formatUser;
    findOne(id: number): Promise<User | null>;
    approveUser(id: number, approvedBy: number): Promise<{
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
    rejectUser(id: number): Promise<{
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
    suspendUser(id: number): Promise<{
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
    reactivateUser(id: number, approvedBy: number): Promise<{
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
