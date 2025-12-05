import { VolunteersService } from './volunteers.service';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
export declare class VolunteersController {
    private readonly volunteersService;
    constructor(volunteersService: VolunteersService);
    create(createVolunteerDto: CreateVolunteerDto, req: any): Promise<{
        message: string;
        volunteer: {
            id: any;
            volunteerCode: any;
            fullName: any;
            firstName: any;
            lastName: any;
            phone: any;
            altPhone: any;
            email: any;
            gender: any;
            age: any;
            dateOfBirth: any;
            address: any;
            lga: any;
            ward: any;
            community: any;
            occupation: any;
            educationLevel: any;
            nextOfKin: any;
            nextOfKinPhone: any;
            skills: any;
            notes: any;
            status: any;
            trainingCompleted: boolean;
            trainingDate: any;
            facility: {
                id: any;
                name: any;
            } | null;
            registeredBy: {
                id: any;
                name: any;
            } | null;
            createdAt: any;
            updatedAt: any;
        };
    }>;
    findAll(req: any, status?: string, gender?: string, trained?: string, search?: string, limit?: string, offset?: string): Promise<{
        total: number;
        volunteers: {
            id: any;
            volunteerCode: any;
            fullName: any;
            firstName: any;
            lastName: any;
            phone: any;
            altPhone: any;
            email: any;
            gender: any;
            age: any;
            dateOfBirth: any;
            address: any;
            lga: any;
            ward: any;
            community: any;
            occupation: any;
            educationLevel: any;
            nextOfKin: any;
            nextOfKinPhone: any;
            skills: any;
            notes: any;
            status: any;
            trainingCompleted: boolean;
            trainingDate: any;
            facility: {
                id: any;
                name: any;
            } | null;
            registeredBy: {
                id: any;
                name: any;
            } | null;
            createdAt: any;
            updatedAt: any;
        }[];
    }>;
    getStats(req: any): Promise<{
        total: number;
        active: number;
        inactive: number;
        pending: number;
        trained: number;
        untrained: number;
    }>;
    findOne(id: number): Promise<{
        id: any;
        volunteerCode: any;
        fullName: any;
        firstName: any;
        lastName: any;
        phone: any;
        altPhone: any;
        email: any;
        gender: any;
        age: any;
        dateOfBirth: any;
        address: any;
        lga: any;
        ward: any;
        community: any;
        occupation: any;
        educationLevel: any;
        nextOfKin: any;
        nextOfKinPhone: any;
        skills: any;
        notes: any;
        status: any;
        trainingCompleted: boolean;
        trainingDate: any;
        facility: {
            id: any;
            name: any;
        } | null;
        registeredBy: {
            id: any;
            name: any;
        } | null;
        createdAt: any;
        updatedAt: any;
    }>;
    update(id: number, updateVolunteerDto: UpdateVolunteerDto): Promise<{
        message: string;
        volunteer: {
            id: any;
            volunteerCode: any;
            fullName: any;
            firstName: any;
            lastName: any;
            phone: any;
            altPhone: any;
            email: any;
            gender: any;
            age: any;
            dateOfBirth: any;
            address: any;
            lga: any;
            ward: any;
            community: any;
            occupation: any;
            educationLevel: any;
            nextOfKin: any;
            nextOfKinPhone: any;
            skills: any;
            notes: any;
            status: any;
            trainingCompleted: boolean;
            trainingDate: any;
            facility: {
                id: any;
                name: any;
            } | null;
            registeredBy: {
                id: any;
                name: any;
            } | null;
            createdAt: any;
            updatedAt: any;
        };
    }>;
    activate(id: number): Promise<{
        message: string;
        volunteer: {
            id: any;
            volunteerCode: any;
            fullName: any;
            firstName: any;
            lastName: any;
            phone: any;
            altPhone: any;
            email: any;
            gender: any;
            age: any;
            dateOfBirth: any;
            address: any;
            lga: any;
            ward: any;
            community: any;
            occupation: any;
            educationLevel: any;
            nextOfKin: any;
            nextOfKinPhone: any;
            skills: any;
            notes: any;
            status: any;
            trainingCompleted: boolean;
            trainingDate: any;
            facility: {
                id: any;
                name: any;
            } | null;
            registeredBy: {
                id: any;
                name: any;
            } | null;
            createdAt: any;
            updatedAt: any;
        };
    }>;
    deactivate(id: number): Promise<{
        message: string;
        volunteer: {
            id: any;
            volunteerCode: any;
            fullName: any;
            firstName: any;
            lastName: any;
            phone: any;
            altPhone: any;
            email: any;
            gender: any;
            age: any;
            dateOfBirth: any;
            address: any;
            lga: any;
            ward: any;
            community: any;
            occupation: any;
            educationLevel: any;
            nextOfKin: any;
            nextOfKinPhone: any;
            skills: any;
            notes: any;
            status: any;
            trainingCompleted: boolean;
            trainingDate: any;
            facility: {
                id: any;
                name: any;
            } | null;
            registeredBy: {
                id: any;
                name: any;
            } | null;
            createdAt: any;
            updatedAt: any;
        };
    }>;
    markTrainingCompleted(id: number, trainingDate?: string): Promise<{
        message: string;
        volunteer: {
            id: any;
            volunteerCode: any;
            fullName: any;
            firstName: any;
            lastName: any;
            phone: any;
            altPhone: any;
            email: any;
            gender: any;
            age: any;
            dateOfBirth: any;
            address: any;
            lga: any;
            ward: any;
            community: any;
            occupation: any;
            educationLevel: any;
            nextOfKin: any;
            nextOfKinPhone: any;
            skills: any;
            notes: any;
            status: any;
            trainingCompleted: boolean;
            trainingDate: any;
            facility: {
                id: any;
                name: any;
            } | null;
            registeredBy: {
                id: any;
                name: any;
            } | null;
            createdAt: any;
            updatedAt: any;
        };
    }>;
    private formatVolunteer;
}
