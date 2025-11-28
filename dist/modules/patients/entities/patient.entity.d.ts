import { PhcCenter } from '../../facilities/entities/phc-center.entity';
import { User } from '../../users/entities/user.entity';
export declare class Patient {
    id: number;
    phcCenterId: number;
    patientNumber: string;
    fullName: string;
    firstName: string;
    lastName: string;
    age: number;
    dateOfBirth: Date;
    gender: string;
    phone: string;
    altPhone: string;
    email: string;
    address: string;
    lga: string;
    bloodGroup: string;
    genotype: string;
    nextOfKin: string;
    nextOfKinPhone: string;
    emergencyContact: string;
    emergencyPhone: string;
    registeredBy: number;
    createdAt: Date;
    updatedAt: Date;
    phcCenter: PhcCenter;
    registeredByUser: User;
}
