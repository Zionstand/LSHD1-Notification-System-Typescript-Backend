import { PhcCenter } from '../../facilities/entities/phc-center.entity';
export type UserRole = 'admin' | 'him_officer' | 'nurse' | 'doctor' | 'lab_scientist';
export type UserStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export declare class User {
    id: number;
    phcCenterId: number;
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    staffId: string;
    status: UserStatus;
    createdAt: Date;
    approvedAt: Date;
    approvedBy: number;
    phcCenter: PhcCenter;
    get firstName(): string;
    get lastName(): string;
}
