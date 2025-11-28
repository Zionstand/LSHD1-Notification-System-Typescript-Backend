import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { CreateFollowupDto } from './dto/create-followup.dto';
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
    createFollowup(createDto: CreateFollowupDto, userId: number, facilityId: number): Promise<{
        message: string;
        followup: {
            id: number;
            appointmentId: string;
            followupDate: Date;
            followupTime: string;
            followupType: string;
            status: AppointmentStatus;
            sendSmsReminder: boolean;
            reminderDaysBefore: number;
            reminderScheduledDate: Date | null;
        };
    }>;
    getFollowupsByPatient(patientId: number): Promise<{
        id: number;
        appointmentId: string;
        appointmentDate: Date;
        appointmentTime: string;
        appointmentType: string;
        reason: string;
        isFollowup: boolean;
        followupInstructions: string | null;
        status: AppointmentStatus;
        sendSmsReminder: boolean;
        reminderDaysBefore: number;
        reminderSent: boolean;
        reminderScheduledDate: Date | null;
        screeningId: number | null;
        facility: {
            id: number;
            name: string;
        };
        createdAt: Date;
    }[]>;
}
