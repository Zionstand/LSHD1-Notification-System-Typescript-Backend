import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { IsNumber, IsString, IsOptional } from 'class-validator';
import { SmsService } from './sms.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/roles.constant';
import { SmsType, SmsStatus } from './entities/sms-log.entity';
import { AuditService } from '../audit/audit.service';

class SendScreeningResultDto {
  @IsNumber()
  patientId: number;

  @IsString()
  screeningType: string;

  @IsString()
  result: string;
}

class SendFollowUpReminderDto {
  @IsNumber()
  patientId: number;

  @IsString()
  screeningType: string;

  @IsString()
  dueDate: string;
}

class SendGeneralSmsDto {
  @IsString()
  phoneNumber: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsNumber()
  patientId?: number;
}

class SendManualSmsDto {
  @IsNumber()
  patientId: number;

  @IsString()
  message: string;
}

@Controller('sms')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SmsController {
  constructor(
    private smsService: SmsService,
    private auditService: AuditService,
  ) {}

  @Get()
  @Roles(Role.ADMIN, Role.HIM_OFFICER)
  async findAll(
    @Request() req: any,
    @Query('patientId') patientId?: string,
    @Query('smsType') smsType?: SmsType,
    @Query('status') status?: SmsStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const filters: any = {};

    // Non-admin users can only see their facility's SMS logs
    if (req.user.role !== 'admin' && req.user.facility_id) {
      filters.facilityId = req.user.facility_id;
    }

    if (patientId) filters.patientId = parseInt(patientId);
    if (smsType) filters.smsType = smsType;
    if (status) filters.status = status;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);
    if (limit) filters.limit = parseInt(limit);
    if (offset) filters.offset = parseInt(offset);

    return this.smsService.findAll(filters);
  }

  @Get('stats')
  @Roles(Role.ADMIN, Role.HIM_OFFICER)
  async getStats(@Request() req: any) {
    const facilityId = req.user.role !== 'admin' ? req.user.facility_id : undefined;
    return this.smsService.getStats(facilityId);
  }

  @Post('screening-result')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.NURSE, Role.CHO)
  async sendScreeningResult(
    @Request() req: any,
    @Body() dto: SendScreeningResultDto,
  ) {
    const result = await this.smsService.sendScreeningResultSms(
      dto.patientId,
      dto.screeningType,
      dto.result,
      req.user.id,
      req.user.facility_id,
    );

    // Audit log
    await this.auditService.log({
      userId: req.user.id,
      action: 'CREATE',
      resource: 'PATIENT',
      resourceId: dto.patientId,
      details: {
        action: 'SMS_SCREENING_RESULT',
        screeningType: dto.screeningType,
        result: dto.result,
        smsStatus: result?.status,
      },
      facilityId: req.user.facility_id,
    });

    return result;
  }

  @Post('appointment-reminder/:appointmentId')
  @Roles(Role.ADMIN, Role.HIM_OFFICER, Role.NURSE)
  async sendAppointmentReminder(
    @Request() req: any,
    @Param('appointmentId') appointmentId: string,
  ) {
    const result = await this.smsService.sendAppointmentReminderSms(
      parseInt(appointmentId),
    );

    // Audit log
    await this.auditService.log({
      userId: req.user.id,
      action: 'CREATE',
      resource: 'APPOINTMENT',
      resourceId: parseInt(appointmentId),
      details: {
        action: 'SMS_APPOINTMENT_REMINDER',
        smsStatus: result?.status,
      },
      facilityId: req.user.facility_id,
    });

    return result;
  }

  @Post('appointment-confirmation/:appointmentId')
  @Roles(Role.ADMIN, Role.HIM_OFFICER, Role.NURSE)
  async sendAppointmentConfirmation(
    @Request() req: any,
    @Param('appointmentId') appointmentId: string,
  ) {
    const result = await this.smsService.sendAppointmentConfirmationSms(
      parseInt(appointmentId),
      req.user.id,
    );

    // Audit log
    await this.auditService.log({
      userId: req.user.id,
      action: 'CREATE',
      resource: 'APPOINTMENT',
      resourceId: parseInt(appointmentId),
      details: {
        action: 'SMS_APPOINTMENT_CONFIRMATION',
        smsStatus: result?.status,
      },
      facilityId: req.user.facility_id,
    });

    return result;
  }

  @Post('follow-up-reminder')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.NURSE, Role.CHO)
  async sendFollowUpReminder(
    @Request() req: any,
    @Body() dto: SendFollowUpReminderDto,
  ) {
    const result = await this.smsService.sendFollowUpReminderSms(
      dto.patientId,
      dto.screeningType,
      new Date(dto.dueDate),
      req.user.facility_id,
    );

    // Audit log
    await this.auditService.log({
      userId: req.user.id,
      action: 'CREATE',
      resource: 'PATIENT',
      resourceId: dto.patientId,
      details: {
        action: 'SMS_FOLLOW_UP_REMINDER',
        screeningType: dto.screeningType,
        dueDate: dto.dueDate,
        smsStatus: result?.status,
      },
      facilityId: req.user.facility_id,
    });

    return result;
  }

  @Post('general')
  @Roles(Role.ADMIN, Role.HIM_OFFICER)
  async sendGeneralSms(
    @Request() req: any,
    @Body() dto: SendGeneralSmsDto,
  ) {
    const result = await this.smsService.sendSms({
      phoneNumber: dto.phoneNumber,
      message: dto.message,
      smsType: 'GENERAL',
      patientId: dto.patientId,
      sentBy: req.user.id,
      facilityId: req.user.facility_id,
    });

    // Audit log
    await this.auditService.log({
      userId: req.user.id,
      action: 'CREATE',
      resource: 'PATIENT',
      resourceId: dto.patientId,
      details: {
        action: 'SMS_GENERAL',
        phoneNumber: dto.phoneNumber,
        smsStatus: result?.status,
      },
      facilityId: req.user.facility_id,
    });

    return result;
  }

  @Post('process-reminders')
  @Roles(Role.ADMIN)
  async processReminders(@Request() req: any) {
    const count = await this.smsService.processPendingAppointmentReminders();

    // Audit log
    await this.auditService.log({
      userId: req.user.id,
      action: 'CREATE',
      resource: 'APPOINTMENT',
      details: {
        action: 'SMS_BATCH_REMINDERS',
        remindersSent: count,
      },
      facilityId: req.user.facility_id,
    });

    return { message: `Processed reminders`, processed: count, sent: count, failed: 0 };
  }

  // ==================== FRONTEND-COMPATIBLE ENDPOINTS ====================

  @Post('send')
  @Roles(Role.ADMIN, Role.HIM_OFFICER, Role.DOCTOR, Role.NURSE, Role.CHO)
  async sendManualSms(
    @Request() req: any,
    @Body() dto: SendManualSmsDto,
  ) {
    const result = await this.smsService.sendManualSmsToPatient(
      dto.patientId,
      dto.message,
      req.user.id,
      req.user.facility_id,
    );

    // Audit log
    await this.auditService.log({
      userId: req.user.id,
      action: 'CREATE',
      resource: 'PATIENT',
      resourceId: dto.patientId,
      details: {
        action: 'SMS_MANUAL',
        smsStatus: result?.status,
      },
      facilityId: req.user.facility_id,
    });

    return {
      success: result?.status === 'SENT',
      message: result?.status === 'SENT' ? 'SMS sent successfully' : (result?.errorMessage || 'Failed to send SMS'),
    };
  }

  @Post('screening/:screeningId')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.NURSE, Role.CHO)
  async sendScreeningSms(
    @Request() req: any,
    @Param('screeningId') screeningId: string,
  ) {
    const result = await this.smsService.sendScreeningSmsById(
      parseInt(screeningId),
      req.user.id,
      req.user.facility_id,
    );

    // Audit log
    await this.auditService.log({
      userId: req.user.id,
      action: 'CREATE',
      resource: 'SCREENING',
      resourceId: parseInt(screeningId),
      details: {
        action: 'SMS_SCREENING_RESULT',
        smsStatus: result?.status,
      },
      facilityId: req.user.facility_id,
    });

    return {
      success: result?.status === 'SENT',
      message: result?.status === 'SENT' ? 'SMS sent successfully' : (result?.errorMessage || 'Failed to send SMS'),
    };
  }

  @Post('followup/:appointmentId')
  @Roles(Role.ADMIN, Role.HIM_OFFICER, Role.NURSE, Role.CHO)
  async sendFollowupSms(
    @Request() req: any,
    @Param('appointmentId') appointmentId: string,
  ) {
    const result = await this.smsService.sendFollowupSmsById(
      parseInt(appointmentId),
      req.user.id,
      req.user.facility_id,
    );

    // Audit log
    await this.auditService.log({
      userId: req.user.id,
      action: 'CREATE',
      resource: 'APPOINTMENT',
      resourceId: parseInt(appointmentId),
      details: {
        action: 'SMS_FOLLOWUP',
        smsStatus: result?.status,
      },
      facilityId: req.user.facility_id,
    });

    return {
      success: result?.status === 'SENT',
      message: result?.status === 'SENT' ? 'SMS sent successfully' : (result?.errorMessage || 'Failed to send SMS'),
    };
  }

  @Post('reminder/:appointmentId')
  @Roles(Role.ADMIN, Role.HIM_OFFICER, Role.NURSE)
  async sendReminderSms(
    @Request() req: any,
    @Param('appointmentId') appointmentId: string,
  ) {
    const result = await this.smsService.sendAppointmentReminderSms(
      parseInt(appointmentId),
    );

    // Audit log
    await this.auditService.log({
      userId: req.user.id,
      action: 'CREATE',
      resource: 'APPOINTMENT',
      resourceId: parseInt(appointmentId),
      details: {
        action: 'SMS_REMINDER',
        smsStatus: result?.status,
      },
      facilityId: req.user.facility_id,
    });

    return {
      success: result?.status === 'SENT',
      message: result?.status === 'SENT' ? 'SMS sent successfully' : (result?.errorMessage || 'Failed to send SMS'),
    };
  }

  @Get('patient/:patientId')
  @Roles(Role.ADMIN, Role.HIM_OFFICER, Role.DOCTOR, Role.NURSE, Role.CHO)
  async getPatientSmsHistory(
    @Request() req: any,
    @Param('patientId') patientId: string,
  ) {
    const { logs, total } = await this.smsService.findAll({
      patientId: parseInt(patientId),
      limit: 50,
    });

    return {
      count: total,
      data: logs.map(log => ({
        id: log.id,
        phoneNumber: log.phoneNumber,
        message: log.message,
        type: log.smsType,
        status: log.status,
        sentAt: log.sentAt,
        createdAt: log.createdAt,
        sentBy: log.sentByUser ? { id: log.sentByUser.id, name: log.sentByUser.firstName + ' ' + log.sentByUser.lastName } : null,
      })),
    };
  }

  @Get('logs')
  @Roles(Role.ADMIN, Role.HIM_OFFICER)
  async getSmsLogs(
    @Request() req: any,
    @Query('status') status?: SmsStatus,
    @Query('type') type?: SmsType,
    @Query('limit') limit?: string,
  ) {
    const filters: any = {};

    // Non-admin users can only see their facility's SMS logs
    if (req.user.role !== 'admin' && req.user.facility_id) {
      filters.facilityId = req.user.facility_id;
    }

    if (status) filters.status = status;
    if (type) filters.smsType = type;
    if (limit) filters.limit = parseInt(limit);

    const { logs, total } = await this.smsService.findAll(filters);

    return {
      count: total,
      data: logs.map(log => ({
        id: log.id,
        patientId: log.patientId,
        patientName: log.patient ? `${log.patient.firstName} ${log.patient.lastName}` : null,
        phoneNumber: log.phoneNumber,
        message: log.message,
        type: log.smsType,
        status: log.status,
        sentAt: log.sentAt,
        createdAt: log.createdAt,
        sentBy: log.sentByUser ? { id: log.sentByUser.id, name: log.sentByUser.firstName + ' ' + log.sentByUser.lastName } : null,
        errorMessage: log.errorMessage,
      })),
    };
  }
}
