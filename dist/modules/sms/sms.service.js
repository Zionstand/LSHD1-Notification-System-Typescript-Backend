"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SmsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
const sms_log_entity_1 = require("./entities/sms-log.entity");
const patient_entity_1 = require("../patients/entities/patient.entity");
const appointment_entity_1 = require("../appointments/entities/appointment.entity");
const screening_entity_1 = require("../screenings/entities/screening.entity");
let SmsService = SmsService_1 = class SmsService {
    constructor(smsLogRepository, patientRepository, appointmentRepository, screeningRepository, configService) {
        this.smsLogRepository = smsLogRepository;
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.screeningRepository = screeningRepository;
        this.configService = configService;
        this.logger = new common_1.Logger(SmsService_1.name);
        this.baseUrl = this.configService.get('SENDCHAMP_BASE_URL') || 'https://api.sendchamp.com/api/v1';
        this.apiKey = this.configService.get('SENDCHAMP_API_KEY') || '';
        this.senderName = this.configService.get('SENDCHAMP_SENDER_NAME') || 'LSHD1';
    }
    async sendSms(params) {
        const { phoneNumber, message, smsType, patientId, sentBy, facilityId, relatedEntity, relatedEntityId, } = params;
        const formattedPhone = this.formatPhoneNumber(phoneNumber);
        const smsLog = this.smsLogRepository.create({
            phoneNumber: formattedPhone,
            message,
            smsType,
            status: 'PENDING',
            patientId: patientId || null,
            sentBy: sentBy || null,
            facilityId: facilityId || null,
            relatedEntity: relatedEntity || null,
            relatedEntityId: relatedEntityId || null,
        });
        await this.smsLogRepository.save(smsLog);
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/sms/send`, {
                to: [formattedPhone],
                message,
                sender_name: this.senderName,
                route: 'dnd',
            }, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.data.status === 'success' && response.data.data) {
                smsLog.status = 'SENT';
                smsLog.sendchampReference = response.data.data.reference;
                smsLog.sentAt = new Date();
                this.logger.log(`SMS sent successfully to ${formattedPhone}`);
            }
            else {
                smsLog.status = 'FAILED';
                smsLog.errorMessage = response.data.message || 'Unknown error';
                this.logger.warn(`SMS failed: ${smsLog.errorMessage}`);
            }
        }
        catch (error) {
            smsLog.status = 'FAILED';
            smsLog.errorMessage = error.response?.data?.message || error.message || 'API request failed';
            this.logger.error(`SMS sending error: ${smsLog.errorMessage}`);
        }
        await this.smsLogRepository.save(smsLog);
        return smsLog;
    }
    async sendScreeningResultSms(patientId, screeningType, result, sentBy, facilityId) {
        const patient = await this.patientRepository.findOne({
            where: { id: patientId },
        });
        if (!patient || !patient.phone) {
            this.logger.warn(`Cannot send SMS: Patient ${patientId} not found or has no phone number`);
            return null;
        }
        const resultText = this.getResultText(result);
        const screeningName = this.getScreeningName(screeningType);
        const message = `Dear ${patient.firstName}, your ${screeningName} screening result is ${resultText}. Please visit your healthcare facility for more information. - LSHD1 Screening Program`;
        return this.sendSms({
            phoneNumber: patient.phone,
            message,
            smsType: 'SCREENING_RESULT',
            patientId,
            sentBy,
            facilityId,
            relatedEntity: screeningType,
            relatedEntityId: patientId,
        });
    }
    async sendAppointmentReminderSms(appointmentId) {
        const appointment = await this.appointmentRepository.findOne({
            where: { id: appointmentId },
            relations: ['patient'],
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
        const message = `Reminder: Dear ${appointment.patient.firstName}, you have a ${appointment.appointmentType} appointment on ${dateStr} at ${timeStr}. Please arrive 15 minutes early. - LSHD1 Screening Program`;
        const result = await this.sendSms({
            phoneNumber: appointment.patient.phone,
            message,
            smsType: 'APPOINTMENT_REMINDER',
            patientId: appointment.patientId,
            facilityId: appointment.phcCenterId,
            relatedEntity: 'APPOINTMENT',
            relatedEntityId: appointmentId,
        });
        if (result.status === 'SENT') {
            appointment.reminderSent = 1;
            await this.appointmentRepository.save(appointment);
        }
        return result;
    }
    async sendAppointmentConfirmationSms(appointmentId, sentBy) {
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
        const facilityName = appointment.phcCenter?.centerName || 'your healthcare facility';
        const message = `Your ${appointment.appointmentType} appointment has been scheduled for ${dateStr} at ${timeStr} at ${facilityName}. Please bring your ID. - LSHD1 Screening Program`;
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
    async sendFollowUpReminderSms(patientId, screeningType, dueDate, facilityId) {
        const patient = await this.patientRepository.findOne({
            where: { id: patientId },
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
        const message = `Dear ${patient.firstName}, your ${screeningName} follow-up is due on ${dueDateStr}. Please visit your healthcare facility or call to schedule an appointment. - LSHD1 Screening Program`;
        return this.sendSms({
            phoneNumber: patient.phone,
            message,
            smsType: 'FOLLOW_UP_REMINDER',
            patientId,
            facilityId,
            relatedEntity: screeningType,
        });
    }
    async processPendingAppointmentReminders() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const reminderDate = new Date(today);
        reminderDate.setDate(reminderDate.getDate() + 3);
        const appointments = await this.appointmentRepository.find({
            where: {
                appointmentDate: (0, typeorm_2.LessThanOrEqual)(reminderDate),
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
    async findAll(filters) {
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
    async getStats(facilityId) {
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
        const byType = {};
        byTypeResult.forEach((row) => {
            byType[row.type] = parseInt(row.count);
        });
        return { total, sent, failed, pending, byType };
    }
    formatPhoneNumber(phone) {
        let cleaned = phone.replace(/[\s\-\(\)]/g, '');
        if (cleaned.startsWith('0')) {
            cleaned = '234' + cleaned.substring(1);
        }
        if (!cleaned.startsWith('+')) {
            cleaned = '+' + cleaned;
        }
        return cleaned;
    }
    getResultText(result) {
        const resultMap = {
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
    getScreeningName(type) {
        const typeMap = {
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
    async sendManualSmsToPatient(patientId, message, sentBy, facilityId) {
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
            facilityId,
        });
    }
    async sendScreeningSmsById(screeningId, sentBy, facilityId) {
        const screening = await this.screeningRepository.findOne({
            where: { id: screeningId },
            relations: ['patient'],
        });
        if (!screening || !screening.patient?.phone) {
            this.logger.warn(`Cannot send SMS: Screening ${screeningId} not found or patient has no phone`);
            return null;
        }
        const screeningName = this.getScreeningName(screening.screeningType);
        const resultText = this.getResultText(screening.patientStatus || 'pending');
        const message = `Dear ${screening.patient.firstName}, your ${screeningName} screening result is ${resultText}. Please visit your healthcare facility for more information. - LSHD1 Screening Program`;
        const result = await this.sendSms({
            phoneNumber: screening.patient.phone,
            message,
            smsType: 'SCREENING_RESULT',
            patientId: screening.patientId,
            sentBy,
            facilityId,
            relatedEntity: 'SCREENING',
            relatedEntityId: screeningId,
        });
        if (result.status === 'SENT') {
            screening.smsSent = 1;
            await this.screeningRepository.save(screening);
        }
        return result;
    }
    async sendFollowupSmsById(appointmentId, sentBy, facilityId) {
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
        const facilityName = appointment.phcCenter?.centerName || 'your healthcare facility';
        const message = `Dear ${appointment.patient.firstName}, this is a reminder about your follow-up appointment on ${dateStr} at ${timeStr} at ${facilityName}. Please don't forget to attend. - LSHD1 Screening Program`;
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
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = SmsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sms_log_entity_1.SmsLog)),
    __param(1, (0, typeorm_1.InjectRepository)(patient_entity_1.Patient)),
    __param(2, (0, typeorm_1.InjectRepository)(appointment_entity_1.Appointment)),
    __param(3, (0, typeorm_1.InjectRepository)(screening_entity_1.Screening)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService])
], SmsService);
//# sourceMappingURL=sms.service.js.map