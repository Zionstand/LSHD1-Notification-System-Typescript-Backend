import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { CreateFollowupDto } from './dto/create-followup.dto';
export declare class AppointmentsController {
    private appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    findAll(req: any, status?: string, date?: string): Promise<{
        id: number;
        appointmentId: string;
        appointmentDate: Date;
        appointmentTime: string;
        appointmentType: string;
        reason: string;
        status: import("./entities/appointment.entity").AppointmentStatus;
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
    findUpcoming(req: any, days?: string): Promise<{
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
    findByPatient(patientId: string): Promise<{
        id: number;
        appointmentId: string;
        appointmentDate: Date;
        appointmentTime: string;
        appointmentType: string;
        reason: string;
        status: import("./entities/appointment.entity").AppointmentStatus;
        facility: string;
    }[]>;
    findOne(id: string): Promise<{
        id: number;
        appointmentId: string;
        appointmentDate: Date;
        appointmentTime: string;
        appointmentType: string;
        reason: string;
        status: import("./entities/appointment.entity").AppointmentStatus;
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
    create(createDto: CreateAppointmentDto, req: any): Promise<{
        message: string;
        appointment: {
            id: number;
            appointmentId: string;
            appointmentDate: Date;
            appointmentTime: string;
            status: import("./entities/appointment.entity").AppointmentStatus;
        };
    }>;
    update(id: string, updateDto: UpdateAppointmentDto): Promise<{
        message: string;
    }>;
    cancel(id: string): Promise<{
        message: string;
    }>;
    complete(id: string): Promise<{
        message: string;
    }>;
    markNoShow(id: string): Promise<{
        message: string;
    }>;
    createFollowup(createDto: CreateFollowupDto, req: any): Promise<{
        message: string;
        followup: {
            id: number;
            appointmentId: string;
            followupDate: Date;
            followupTime: string;
            followupType: string;
            status: import("./entities/appointment.entity").AppointmentStatus;
            sendSmsReminder: boolean;
            reminderDaysBefore: number;
            reminderScheduledDate: Date | null;
        };
    }>;
    getFollowupsByPatient(patientId: string): Promise<{
        id: number;
        appointmentId: string;
        appointmentDate: Date;
        appointmentTime: string;
        appointmentType: string;
        reason: string;
        isFollowup: boolean;
        followupInstructions: string | null;
        status: import("./entities/appointment.entity").AppointmentStatus;
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
