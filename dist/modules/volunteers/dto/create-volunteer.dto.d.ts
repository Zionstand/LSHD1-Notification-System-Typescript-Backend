import { VolunteerGender } from '../entities/volunteer.entity';
export declare class CreateVolunteerDto {
    fullName: string;
    phone: string;
    altPhone?: string;
    email?: string;
    gender: VolunteerGender;
    age?: number;
    dateOfBirth?: string;
    address?: string;
    lga?: string;
    ward?: string;
    community?: string;
    occupation?: string;
    educationLevel?: string;
    nextOfKin?: string;
    nextOfKinPhone?: string;
    skills?: string;
    notes?: string;
}
