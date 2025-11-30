import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Appointment, AppointmentStatus } from "./entities/appointment.entity";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";
import { CreateFollowupDto } from "./dto/create-followup.dto";
// import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>
    // @Inject(forwardRef(() => NotificationsService))
    // private notificationsService: NotificationsService,
  ) {}

  async findAll(facilityId?: number, status?: string, date?: string) {
    const queryBuilder = this.appointmentsRepository
      .createQueryBuilder("a")
      .leftJoinAndSelect("a.patient", "p")
      .leftJoinAndSelect("a.phcCenter", "c")
      .leftJoinAndSelect("a.createdByUser", "u")
      .orderBy("a.appointmentDate", "ASC")
      .addOrderBy("a.appointmentTime", "ASC")
      .take(100);

    if (facilityId) {
      queryBuilder.andWhere("a.phcCenterId = :facilityId", { facilityId });
    }

    if (status && status !== "all") {
      queryBuilder.andWhere("a.status = :status", { status });
    }

    if (date) {
      queryBuilder.andWhere("a.appointmentDate = :date", { date });
    }

    const appointments = await queryBuilder.getMany();

    return appointments.map((a) => ({
      id: a.id,
      appointmentId: `APT-${String(a.id).padStart(5, "0")}`,
      appointmentDate: a.appointmentDate,
      appointmentTime: a.appointmentTime,
      appointmentType: a.appointmentType,
      reason: a.reason,
      status: a.status,
      reminderSent: a.reminderSent === 1,
      createdAt: a.createdAt,
      client: {
        id: a.patientId,
        clientId: `PAT-${String(a.patientId).padStart(5, "0")}`,
        firstName: a.patient?.firstName,
        lastName: a.patient?.lastName,
        phone: a.patient?.phone,
      },
      facility: {
        id: a.phcCenterId,
        name: a.phcCenter?.centerName,
      },
      createdBy: a.createdByUser?.fullName || null,
    }));
  }

  async findOne(id: number) {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      relations: ["patient", "phcCenter", "createdByUser"],
    });

    if (!appointment) {
      throw new NotFoundException("Appointment not found");
    }

    return {
      id: appointment.id,
      appointmentId: `APT-${String(appointment.id).padStart(5, "0")}`,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      appointmentType: appointment.appointmentType,
      reason: appointment.reason,
      status: appointment.status,
      reminderSent: appointment.reminderSent === 1,
      createdAt: appointment.createdAt,
      client: {
        id: appointment.patientId,
        clientId: `PAT-${String(appointment.patientId).padStart(5, "0")}`,
        firstName: appointment.patient?.firstName,
        lastName: appointment.patient?.lastName,
        phone: appointment.patient?.phone,
      },
      facility: {
        id: appointment.phcCenterId,
        name: appointment.phcCenter?.centerName,
      },
      createdBy: appointment.createdByUser?.fullName || null,
    };
  }

  async findByPatient(patientId: number) {
    const appointments = await this.appointmentsRepository.find({
      where: { patientId },
      relations: ["phcCenter"],
      order: { appointmentDate: "DESC", appointmentTime: "DESC" },
    });

    return appointments.map((a) => ({
      id: a.id,
      appointmentId: `APT-${String(a.id).padStart(5, "0")}`,
      appointmentDate: a.appointmentDate,
      appointmentTime: a.appointmentTime,
      appointmentType: a.appointmentType,
      reason: a.reason,
      status: a.status,
      facility: a.phcCenter?.centerName,
    }));
  }

  async findUpcoming(facilityId?: number, days: number = 7) {
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + days);

    const queryBuilder = this.appointmentsRepository
      .createQueryBuilder("a")
      .leftJoinAndSelect("a.patient", "p")
      .leftJoinAndSelect("a.phcCenter", "c")
      .where("a.appointmentDate >= :today", {
        today: today.toISOString().split("T")[0],
      })
      .andWhere("a.appointmentDate <= :endDate", {
        endDate: endDate.toISOString().split("T")[0],
      })
      .andWhere("a.status = :status", { status: "scheduled" })
      .orderBy("a.appointmentDate", "ASC")
      .addOrderBy("a.appointmentTime", "ASC");

    if (facilityId) {
      queryBuilder.andWhere("a.phcCenterId = :facilityId", { facilityId });
    }

    const appointments = await queryBuilder.getMany();

    return appointments.map((a) => ({
      id: a.id,
      appointmentId: `APT-${String(a.id).padStart(5, "0")}`,
      appointmentDate: a.appointmentDate,
      appointmentTime: a.appointmentTime,
      appointmentType: a.appointmentType,
      client: {
        id: a.patientId,
        firstName: a.patient?.firstName,
        lastName: a.patient?.lastName,
        phone: a.patient?.phone,
      },
      facility: a.phcCenter?.centerName,
    }));
  }

  async create(
    createDto: CreateAppointmentDto,
    userId: number,
    facilityId: number
  ) {
    const appointment = this.appointmentsRepository.create({
      patientId: createDto.clientId,
      phcCenterId: facilityId || 1,
      appointmentDate: new Date(createDto.appointmentDate),
      appointmentTime: createDto.appointmentTime,
      appointmentType: createDto.appointmentType,
      reason: createDto.reason || null,
      status: "scheduled",
      createdBy: userId,
    } as Partial<Appointment>);

    const saved = await this.appointmentsRepository.save(appointment);

    return {
      message: "Appointment scheduled",
      appointment: {
        id: saved.id,
        appointmentId: `APT-${String(saved.id).padStart(5, "0")}`,
        appointmentDate: saved.appointmentDate,
        appointmentTime: saved.appointmentTime,
        status: saved.status,
      },
    };
  }

  async update(id: number, updateDto: UpdateAppointmentDto) {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundException("Appointment not found");
    }

    if (updateDto.appointmentDate) {
      appointment.appointmentDate = new Date(updateDto.appointmentDate);
    }
    if (updateDto.appointmentTime) {
      appointment.appointmentTime = updateDto.appointmentTime;
    }
    if (updateDto.appointmentType) {
      appointment.appointmentType = updateDto.appointmentType;
    }
    if (updateDto.reason !== undefined) {
      appointment.reason = updateDto.reason;
    }
    if (updateDto.status) {
      appointment.status = updateDto.status as AppointmentStatus;
    }

    await this.appointmentsRepository.save(appointment);

    return { message: "Appointment updated" };
  }

  async cancel(id: number) {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundException("Appointment not found");
    }

    appointment.status = "cancelled";
    await this.appointmentsRepository.save(appointment);

    return { message: "Appointment cancelled" };
  }

  async complete(id: number) {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundException("Appointment not found");
    }

    appointment.status = "completed";
    await this.appointmentsRepository.save(appointment);

    return { message: "Appointment marked as completed" };
  }

  async markNoShow(id: number) {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundException("Appointment not found");
    }

    appointment.status = "no_show";
    await this.appointmentsRepository.save(appointment);

    return { message: "Appointment marked as no-show" };
  }

  async createFollowup(
    createDto: CreateFollowupDto,
    userId: number,
    facilityId: number
  ) {
    // Calculate reminder scheduled date
    let reminderScheduledDate: Date | null = null;
    if (createDto.sendSmsReminder !== false) {
      const followupDate = new Date(createDto.followupDate);
      const daysBefore = createDto.reminderDaysBefore || 1;
      reminderScheduledDate = new Date(followupDate);
      reminderScheduledDate.setDate(
        reminderScheduledDate.getDate() - daysBefore
      );
    }

    const appointment = this.appointmentsRepository.create({
      patientId: createDto.clientId,
      phcCenterId: facilityId || 1,
      screeningId: createDto.screeningId || null,
      appointmentDate: new Date(createDto.followupDate),
      appointmentTime: createDto.followupTime || "09:00",
      appointmentType: createDto.followupType,
      reason: createDto.followupInstructions || null,
      isFollowup: 1,
      followupInstructions: createDto.followupInstructions || null,
      status: "scheduled",
      sendSmsReminder: createDto.sendSmsReminder !== false ? 1 : 0,
      reminderDaysBefore: createDto.reminderDaysBefore || 1,
      reminderScheduledDate: reminderScheduledDate,
      createdBy: userId,
    } as Partial<Appointment>);

    const saved = await this.appointmentsRepository.save(appointment);

    // // Send SMS notification about the scheduled follow-up
    // try {
    //   const smsResult = await this.notificationsService.sendFollowupScheduledSms(
    //     saved.id,
    //     userId,
    //   );
    //   this.logger.log(`SMS notification for follow-up ${saved.id}: ${smsResult.message}`);
    // } catch (error) {
    //   // Log error but don't fail the follow-up creation
    //   this.logger.error(`Failed to send SMS for follow-up ${saved.id}: ${error.message}`);
    // }

    return {
      message: "Follow-up scheduled successfully",
      followup: {
        id: saved.id,
        appointmentId: `FUP-${String(saved.id).padStart(5, "0")}`,
        followupDate: saved.appointmentDate,
        followupTime: saved.appointmentTime,
        followupType: saved.appointmentType,
        status: saved.status,
        sendSmsReminder: saved.sendSmsReminder === 1,
        reminderDaysBefore: saved.reminderDaysBefore,
        reminderScheduledDate: saved.reminderScheduledDate,
      },
    };
  }

  async getFollowupsByPatient(patientId: number) {
    const appointments = await this.appointmentsRepository.find({
      where: { patientId, isFollowup: 1 },
      relations: ["phcCenter", "screening"],
      order: { appointmentDate: "DESC", appointmentTime: "DESC" },
    });

    return appointments.map((a) => ({
      id: a.id,
      appointmentId: `FUP-${String(a.id).padStart(5, "0")}`,
      appointmentDate: a.appointmentDate,
      appointmentTime: a.appointmentTime,
      appointmentType: a.appointmentType,
      reason: a.reason,
      isFollowup: a.isFollowup === 1,
      followupInstructions: a.followupInstructions,
      status: a.status,
      sendSmsReminder: a.sendSmsReminder === 1,
      reminderDaysBefore: a.reminderDaysBefore,
      reminderSent: a.reminderSent === 1,
      reminderScheduledDate: a.reminderScheduledDate,
      screeningId: a.screeningId,
      facility: {
        id: a.phcCenter?.id,
        name: a.phcCenter?.centerName,
      },
      createdAt: a.createdAt,
    }));
  }
}
