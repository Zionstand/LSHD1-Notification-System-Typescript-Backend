import { UserRole } from '../entities/user.entity';
export declare class CreateUserDto {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    phcCenterId?: number;
    staffId?: string;
}
