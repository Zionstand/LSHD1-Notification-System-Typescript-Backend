import { UserRole } from '../../users/entities/user.entity';
export declare class RegisterDto {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    phcCenterId?: number;
    staffId?: string;
}
