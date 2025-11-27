import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
export declare class AppointmentsService {
    private appointmentsRepository;
    constructor(appointmentsRepository: Repository<Appointment>);
    findAll(facilityId?: number, status?: string, date?: string): Promise<{
        id: number;
        appointmentId: string;
        appointmentDate: Date;
        appointmentTime: string;
        appointmentType: string;
        reason: string;
        status: AppointmentStatus;
        reminderSent: boolean;
        createdAt: Date;
        client: {
            id: number;
            clientId: string;
            firstName: string;
            lastName: string;
            phone: string;
        };
        facility: {
            id: number;
            name: string;
        };
        createdBy: string | null;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        appointmentId: string;
        appointmentDate: Date;
        appointmentTime: string;
        appointmentType: string;
        reason: string;
        status: AppointmentStatus;
        reminderSent: boolean;
        createdAt: Date;
        client: {
            id: number;
            clientId: string;
            firstName: string;
            lastName: string;
            phone: string;
        };
        facility: {
            id: number;
            name: string;
        };
        createdBy: string | null;
    }>;
    findByPatient(patientId: number): Promise<{
        id: number;
        appointmentId: string;
        appointmentDate: Date;
        appointmentTime: string;
        appointmentType: string;
        reason: string;
        status: AppointmentStatus;
        facility: string;
    }[]>;
    findUpcoming(facilityId?: number, days?: number): Promise<{
        id: number;
        appointmentId: string;
        appointmentDate: Date;
        appointmentTime: string;
        appointmentType: string;
        client: {
            id: number;
            firstName: string;
            lastName: string;
            phone: string;
        };
        facility: string;
    }[]>;
    create(createDto: CreateAppointmentDto, userId: number, facilityId: number): Promise<{
        message: string;
        appointment: {
            id: number;
            appointmentId: string;
            appointmentDate: Date;
            appointmentTime: string;
            status: AppointmentStatus;
        };
    }>;
    update(id: number, updateDto: UpdateAppointmentDto): Promise<{
        message: string;
    }>;
    cancel(id: number): Promise<{
        message: string;
    }>;
    complete(id: number): Promise<{
        message: string;
    }>;
    markNoShow(id: number): Promise<{
        message: string;
    }>;
}
