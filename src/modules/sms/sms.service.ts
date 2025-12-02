import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { SmsLog, SmsType, SmsStatus } from './entities/sms-log.entity';
import { Patient } from '../patients/entities/patient.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Screening } from '../screenings/entities/screening.entity';

interface SendSmsParams {
  phoneNumber: string;
  message: string;
  smsType: SmsType;
  patientId?: number;
  sentBy?: number;
  facilityId?: number;
  relatedEntity?: string;
  relatedEntityId?: number;
}

interface SendchampResponse {
  status: string;
  message: string;
  data?: {
    id: string;
    reference: string;
    status: string;
  };
}

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly senderName: string;

  constructor(
    @InjectRepository(SmsLog)
    private smsLogRepository: Repository<SmsLog>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Screening)
    private screeningRepository: Repository<Screening>,
    private configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('SENDCHAMP_BASE_URL') || 'https://api.sendchamp.com/api/v1';
    this.apiKey = this.configService.get<string>('SENDCHAMP_API_KEY') || '';
    this.senderName = this.configService.get<string>('SENDCHAMP_SENDER_NAME') || 'LSHD1';
  }

  /**
   * Send SMS via Sendchamp API
   */
  async sendSms(params: SendSmsParams): Promise<SmsLog> {
    const {
      phoneNumber,
      message,
      smsType,
      patientId,
      sentBy,
      facilityId,
      relatedEntity,
      relatedEntityId,
    } = params;

    // Format phone number (ensure it starts with country code)
    const formattedPhone = this.formatPhoneNumber(phoneNumber);

    // Create SMS log entry
    const smsLog = this.smsLogRepository.create({
      phoneNumber: formattedPhone,
      message,
      smsType,
      status: 'PENDING' as SmsStatus,
      patientId: patientId || null,
      sentBy: sentBy || null,
      facilityId: facilityId || null,
      relatedEntity: relatedEntity || null,
      relatedEntityId: relatedEntityId || null,
    });

    await this.smsLogRepository.save(smsLog);

    try {
      const response = await axios.post<SendchampResponse>(
        `${this.baseUrl}/sms/send`,
        {
          to: [formattedPhone],
          message,
          sender_name: this.senderName,
          route: 'dnd', // Use DND route for transactional messages
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.status === 'success' && response.data.data) {
        smsLog.status = 'SENT';
        smsLog.sendchampReference = response.data.data.reference;
        smsLog.sentAt = new Date();
        this.logger.log(`SMS sent successfully to ${formattedPhone}`);
      } else {
        smsLog.status = 'FAILED';
        smsLog.errorMessage = response.data.message || 'Unknown error';
        this.logger.warn(`SMS failed: ${smsLog.errorMessage}`);
      }
    } catch (error: any) {
      smsLog.status = 'FAILED';
      smsLog.errorMessage = error.response?.data?.message || error.message || 'API request failed';
      this.logger.error(`SMS sending error: ${smsLog.errorMessage}`);
    }

    await this.smsLogRepository.save(smsLog);
    return smsLog;
  }

  /**
   * Send screening result SMS to patient
   */
  async sendScreeningResultSms(
    patientId: number,
    screeningType: string,
    result: string,
    sentBy: number,
    facilityId?: number,
  ): Promise<SmsLog | null> {
    const patient = await this.patientRepository.findOne({
      where: { id: patientId },
      relations: ['phcCenter'],
    });

    if (!patient || !patient.phone) {
      this.logger.warn(`Cannot send SMS: Patient ${patientId} not found or has no phone number`);
      return null;
    }

    const resultText = this.getResultText(result);
    const screeningName = this.getScreeningName(screeningType);
    const facilityInfo = this.getFacilityInfo(patient.phcCenter);

    const message = `Dear ${patient.firstName}, your ${screeningName} screening result is ${resultText}. Please visit ${facilityInfo} for more information. - LSHD1 Screening Program`;

    return this.sendSms({
      phoneNumber: patient.phone,
      message,
      smsType: 'SCREENING_RESULT',
      patientId,
      sentBy,
      facilityId: facilityId || patient.phcCenterId,
      relatedEntity: screeningType,
      relatedEntityId: patientId,
    });
  }

  /**
   * Send appointment reminder SMS
   */
  async sendAppointmentReminderSms(appointmentId: number): Promise<SmsLog | null> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
      relations: ['patient', 'phcCenter'],
    });

    if (!appointment || !appointment.patient?.phone) {
      this.logger.warn(`Cannot send reminder: Appointment ${appointmentId} not found or patient has no phone`);
      return null;
    }

    const appointmentDate = new Date(appointment.appointmentDate);
    const dateStr = appointmentDate.toLocaleDateString('en-NG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timeStr = appointment.appointmentTime || 'scheduled time';
    const facilityInfo = this.getFacilityInfo(appointment.phcCenter);

    const message = `Reminder: Dear ${appointment.patient.firstName}, you have a ${appointment.appointmentType} appointment on ${dateStr} at ${timeStr} at ${facilityInfo}. Please arrive 15 minutes early. - LSHD1 Screening Program`;

    const result = await this.sendSms({
      phoneNumber: appointment.patient.phone,
      message,
      smsType: 'APPOINTMENT_REMINDER',
      patientId: appointment.patientId,
      facilityId: appointment.phcCenterId,
      relatedEntity: 'APPOINTMENT',
      relatedEntityId: appointmentId,
    });

    // Mark reminder as sent
    if (result.status === 'SENT') {
      appointment.reminderSent = 1;
      await this.appointmentRepository.save(appointment);
    }

    return result;
  }

  /**
   * Send appointment confirmation SMS
   */
  async sendAppointmentConfirmationSms(
    appointmentId: number,
    sentBy?: number,
  ): Promise<SmsLog | null> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
      relations: ['patient', 'phcCenter'],
    });

    if (!appointment || !appointment.patient?.phone) {
      this.logger.warn(`Cannot send confirmation: Appointment ${appointmentId} not found or patient has no phone`);
      return null;
    }

    const appointmentDate = new Date(appointment.appointmentDate);
    const dateStr = appointmentDate.toLocaleDateString('en-NG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timeStr = appointment.appointmentTime || 'to be confirmed';
    const facilityInfo = this.getFacilityInfo(appointment.phcCenter);

    const message = `Your ${appointment.appointmentType} appointment has been scheduled for ${dateStr} at ${timeStr} at ${facilityInfo}. Please bring your ID. - LSHD1 Screening Program`;

    return this.sendSms({
      phoneNumber: appointment.patient.phone,
      message,
      smsType: 'APPOINTMENT_CONFIRMATION',
      patientId: appointment.patientId,
      sentBy,
      facilityId: appointment.phcCenterId,
      relatedEntity: 'APPOINTMENT',
      relatedEntityId: appointmentId,
    });
  }

  /**
   * Send follow-up reminder SMS
   */
  async sendFollowUpReminderSms(
    patientId: number,
    screeningType: string,
    dueDate: Date,
    facilityId?: number,
  ): Promise<SmsLog | null> {
    const patient = await this.patientRepository.findOne({
      where: { id: patientId },
      relations: ['phcCenter'],
    });

    if (!patient || !patient.phone) {
      this.logger.warn(`Cannot send follow-up: Patient ${patientId} not found or has no phone`);
      return null;
    }

    const dueDateStr = dueDate.toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const screeningName = this.getScreeningName(screeningType);
    const facilityInfo = this.getFacilityInfo(patient.phcCenter);

    const message = `Dear ${patient.firstName}, your ${screeningName} follow-up is due on ${dueDateStr}. Please visit ${facilityInfo} or call to schedule an appointment. - LSHD1 Screening Program`;

    return this.sendSms({
      phoneNumber: patient.phone,
      message,
      smsType: 'FOLLOW_UP_REMINDER',
      patientId,
      facilityId: facilityId || patient.phcCenterId,
      relatedEntity: screeningType,
    });
  }

  /**
   * Process pending appointment reminders
   * This should be called by a scheduled task/cron job
   */
  async processPendingAppointmentReminders(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find appointments needing reminders (within next 3 days by default)
    const reminderDate = new Date(today);
    reminderDate.setDate(reminderDate.getDate() + 3);

    const appointments = await this.appointmentRepository.find({
      where: {
        appointmentDate: LessThanOrEqual(reminderDate),
        reminderSent: 0,
        sendSmsReminder: 1,
        status: 'scheduled',
      },
      relations: ['patient'],
    });

    let sentCount = 0;
    for (const appointment of appointments) {
      const result = await this.sendAppointmentReminderSms(appointment.id);
      if (result?.status === 'SENT') {
        sentCount++;
      }
    }

    this.logger.log(`Processed ${appointments.length} reminders, sent ${sentCount} successfully`);
    return sentCount;
  }

  /**
   * Get SMS logs with filters
   */
  async findAll(filters: {
    patientId?: number;
    smsType?: SmsType;
    status?: SmsStatus;
    facilityId?: number;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<{ logs: SmsLog[]; total: number }> {
    const query = this.smsLogRepository.createQueryBuilder('sms')
      .leftJoinAndSelect('sms.patient', 'patient')
      .leftJoinAndSelect('sms.sentByUser', 'user');

    if (filters.patientId) {
      query.andWhere('sms.patientId = :patientId', { patientId: filters.patientId });
    }
    if (filters.smsType) {
      query.andWhere('sms.smsType = :smsType', { smsType: filters.smsType });
    }
    if (filters.status) {
      query.andWhere('sms.status = :status', { status: filters.status });
    }
    if (filters.facilityId) {
      query.andWhere('sms.facilityId = :facilityId', { facilityId: filters.facilityId });
    }
    if (filters.startDate) {
      query.andWhere('sms.createdAt >= :startDate', { startDate: filters.startDate });
    }
    if (filters.endDate) {
      query.andWhere('sms.createdAt <= :endDate', { endDate: filters.endDate });
    }

    const total = await query.getCount();

    query.orderBy('sms.createdAt', 'DESC');

    if (filters.limit) {
      query.take(filters.limit);
    }
    if (filters.offset) {
      query.skip(filters.offset);
    }

    const logs = await query.getMany();
    return { logs, total };
  }

  /**
   * Get SMS statistics
   */
  async getStats(facilityId?: number): Promise<{
    total: number;
    sent: number;
    failed: number;
    pending: number;
    byType: Record<string, number>;
  }> {
    const query = this.smsLogRepository.createQueryBuilder('sms');

    if (facilityId) {
      query.andWhere('sms.facilityId = :facilityId', { facilityId });
    }

    const [total, sent, failed, pending] = await Promise.all([
      query.clone().getCount(),
      query.clone().andWhere('sms.status = :status', { status: 'SENT' }).getCount(),
      query.clone().andWhere('sms.status = :status', { status: 'FAILED' }).getCount(),
      query.clone().andWhere('sms.status = :status', { status: 'PENDING' }).getCount(),
    ]);

    const byTypeResult = await this.smsLogRepository
      .createQueryBuilder('sms')
      .select('sms.smsType', 'type')
      .addSelect('COUNT(*)', 'count')
      .where(facilityId ? 'sms.facilityId = :facilityId' : '1=1', { facilityId })
      .groupBy('sms.smsType')
      .getRawMany();

    const byType: Record<string, number> = {};
    byTypeResult.forEach((row) => {
      byType[row.type] = parseInt(row.count);
    });

    return { total, sent, failed, pending, byType };
  }

  /**
   * Format phone number to include country code
   */
  private formatPhoneNumber(phone: string): string {
    // Remove any spaces, dashes, or special characters
    let cleaned = phone.replace(/[\s\-\(\)]/g, '');

    // If starts with 0, replace with Nigeria country code
    if (cleaned.startsWith('0')) {
      cleaned = '234' + cleaned.substring(1);
    }

    // If doesn't start with +, add it
    if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }

    return cleaned;
  }

  /**
   * Get human-readable result text
   */
  private getResultText(result: string): string {
    const resultMap: Record<string, string> = {
      normal: 'NORMAL',
      abnormal: 'requires attention',
      positive: 'POSITIVE - Please seek immediate medical consultation',
      negative: 'NEGATIVE',
      elevated: 'ELEVATED - Please consult your doctor',
      controlled: 'well controlled',
      uncontrolled: 'needs attention',
    };
    return resultMap[result.toLowerCase()] || result;
  }

  /**
   * Get human-readable screening type name
   */
  private getScreeningName(type: string): string {
    const typeMap: Record<string, string> = {
      hypertension: 'Blood Pressure',
      diabetes: 'Diabetes',
      cervical: 'Cervical Cancer',
      breast: 'Breast Cancer',
      psa: 'Prostate (PSA)',
      HYPERTENSION_SCREENING: 'Blood Pressure',
      DIABETES_SCREENING: 'Diabetes',
      CERVICAL_SCREENING: 'Cervical Cancer',
      BREAST_SCREENING: 'Breast Cancer',
      PSA_SCREENING: 'Prostate (PSA)',
    };
    return typeMap[type] || type;
  }

  /**
   * Get facility info string with name and address
   */
  private getFacilityInfo(phcCenter?: { centerName?: string; address?: string }): string {
    if (!phcCenter) {
      return 'your healthcare facility';
    }

    const name = phcCenter.centerName || 'your healthcare facility';
    const address = phcCenter.address;

    if (address) {
      return `${name}, ${address}`;
    }

    return name;
  }

  // ==================== FRONTEND-COMPATIBLE METHODS ====================

  /**
   * Send manual SMS to a patient by patient ID
   */
  async sendManualSmsToPatient(
    patientId: number,
    message: string,
    sentBy: number,
    facilityId?: number,
  ): Promise<SmsLog | null> {
    const patient = await this.patientRepository.findOne({
      where: { id: patientId },
    });

    if (!patient || !patient.phone) {
      this.logger.warn(`Cannot send SMS: Patient ${patientId} not found or has no phone number`);
      return null;
    }

    return this.sendSms({
      phoneNumber: patient.phone,
      message,
      smsType: 'GENERAL',
      patientId,
      sentBy,
      facilityId: facilityId || patient.phcCenterId,
    });
  }

  /**
   * Send screening result SMS by screening ID
   */
  async sendScreeningSmsById(
    screeningId: number,
    sentBy: number,
    facilityId?: number,
  ): Promise<SmsLog | null> {
    const screening = await this.screeningRepository.findOne({
      where: { id: screeningId },
      relations: ['patient', 'patient.phcCenter'],
    });

    if (!screening || !screening.patient?.phone) {
      this.logger.warn(`Cannot send SMS: Screening ${screeningId} not found or patient has no phone`);
      return null;
    }

    const screeningName = this.getScreeningName(screening.screeningType);
    const resultText = this.getResultText(screening.patientStatus || 'pending');
    const facilityInfo = this.getFacilityInfo(screening.patient.phcCenter);

    const message = `Dear ${screening.patient.firstName}, your ${screeningName} screening result is ${resultText}. Please visit ${facilityInfo} for more information. - LSHD1 Screening Program`;

    const result = await this.sendSms({
      phoneNumber: screening.patient.phone,
      message,
      smsType: 'SCREENING_RESULT',
      patientId: screening.patientId,
      sentBy,
      facilityId: facilityId || screening.patient.phcCenterId,
      relatedEntity: 'SCREENING',
      relatedEntityId: screeningId,
    });

    // Mark SMS as sent on screening record
    if (result.status === 'SENT') {
      screening.smsSent = 1;
      await this.screeningRepository.save(screening);
    }

    return result;
  }

  /**
   * Send follow-up SMS by appointment ID
   */
  async sendFollowupSmsById(
    appointmentId: number,
    sentBy: number,
    facilityId?: number,
  ): Promise<SmsLog | null> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
      relations: ['patient', 'phcCenter'],
    });

    if (!appointment || !appointment.patient?.phone) {
      this.logger.warn(`Cannot send follow-up SMS: Appointment ${appointmentId} not found or patient has no phone`);
      return null;
    }

    const appointmentDate = new Date(appointment.appointmentDate);
    const dateStr = appointmentDate.toLocaleDateString('en-NG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timeStr = appointment.appointmentTime || 'scheduled time';
    const facilityInfo = this.getFacilityInfo(appointment.phcCenter);

    const message = `Dear ${appointment.patient.firstName}, this is a reminder about your follow-up appointment on ${dateStr} at ${timeStr} at ${facilityInfo}. Please don't forget to attend. - LSHD1 Screening Program`;

    return this.sendSms({
      phoneNumber: appointment.patient.phone,
      message,
      smsType: 'FOLLOW_UP_REMINDER',
      patientId: appointment.patientId,
      sentBy,
      facilityId: facilityId || appointment.phcCenterId,
      relatedEntity: 'APPOINTMENT',
      relatedEntityId: appointmentId,
    });
  }
}
