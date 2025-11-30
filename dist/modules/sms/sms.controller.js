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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsController = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const sms_service_1 = require("./sms.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_constant_1 = require("../auth/constants/roles.constant");
const audit_service_1 = require("../audit/audit.service");
class SendScreeningResultDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SendScreeningResultDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendScreeningResultDto.prototype, "screeningType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendScreeningResultDto.prototype, "result", void 0);
class SendFollowUpReminderDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SendFollowUpReminderDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendFollowUpReminderDto.prototype, "screeningType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendFollowUpReminderDto.prototype, "dueDate", void 0);
class SendGeneralSmsDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendGeneralSmsDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendGeneralSmsDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SendGeneralSmsDto.prototype, "patientId", void 0);
class SendManualSmsDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SendManualSmsDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendManualSmsDto.prototype, "message", void 0);
let SmsController = class SmsController {
    constructor(smsService, auditService) {
        this.smsService = smsService;
        this.auditService = auditService;
    }
    async findAll(req, patientId, smsType, status, startDate, endDate, limit, offset) {
        const filters = {};
        if (req.user.role !== 'admin' && req.user.facility_id) {
            filters.facilityId = req.user.facility_id;
        }
        if (patientId)
            filters.patientId = parseInt(patientId);
        if (smsType)
            filters.smsType = smsType;
        if (status)
            filters.status = status;
        if (startDate)
            filters.startDate = new Date(startDate);
        if (endDate)
            filters.endDate = new Date(endDate);
        if (limit)
            filters.limit = parseInt(limit);
        if (offset)
            filters.offset = parseInt(offset);
        return this.smsService.findAll(filters);
    }
    async getStats(req) {
        const facilityId = req.user.role !== 'admin' ? req.user.facility_id : undefined;
        return this.smsService.getStats(facilityId);
    }
    async sendScreeningResult(req, dto) {
        const result = await this.smsService.sendScreeningResultSms(dto.patientId, dto.screeningType, dto.result, req.user.id, req.user.facility_id);
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
    async sendAppointmentReminder(req, appointmentId) {
        const result = await this.smsService.sendAppointmentReminderSms(parseInt(appointmentId));
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
    async sendAppointmentConfirmation(req, appointmentId) {
        const result = await this.smsService.sendAppointmentConfirmationSms(parseInt(appointmentId), req.user.id);
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
    async sendFollowUpReminder(req, dto) {
        const result = await this.smsService.sendFollowUpReminderSms(dto.patientId, dto.screeningType, new Date(dto.dueDate), req.user.facility_id);
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
    async sendGeneralSms(req, dto) {
        const result = await this.smsService.sendSms({
            phoneNumber: dto.phoneNumber,
            message: dto.message,
            smsType: 'GENERAL',
            patientId: dto.patientId,
            sentBy: req.user.id,
            facilityId: req.user.facility_id,
        });
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
    async processReminders(req) {
        const count = await this.smsService.processPendingAppointmentReminders();
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
    async sendManualSms(req, dto) {
        const result = await this.smsService.sendManualSmsToPatient(dto.patientId, dto.message, req.user.id, req.user.facility_id);
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
    async sendScreeningSms(req, screeningId) {
        const result = await this.smsService.sendScreeningSmsById(parseInt(screeningId), req.user.id, req.user.facility_id);
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
    async sendFollowupSms(req, appointmentId) {
        const result = await this.smsService.sendFollowupSmsById(parseInt(appointmentId), req.user.id, req.user.facility_id);
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
    async sendReminderSms(req, appointmentId) {
        const result = await this.smsService.sendAppointmentReminderSms(parseInt(appointmentId));
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
    async getPatientSmsHistory(req, patientId) {
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
    async getSmsLogs(req, status, type, limit) {
        const filters = {};
        if (req.user.role !== 'admin' && req.user.facility_id) {
            filters.facilityId = req.user.facility_id;
        }
        if (status)
            filters.status = status;
        if (type)
            filters.smsType = type;
        if (limit)
            filters.limit = parseInt(limit);
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
};
exports.SmsController = SmsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.HIM_OFFICER),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('patientId')),
    __param(2, (0, common_1.Query)('smsType')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('startDate')),
    __param(5, (0, common_1.Query)('endDate')),
    __param(6, (0, common_1.Query)('limit')),
    __param(7, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], SmsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.HIM_OFFICER),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SmsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Post)('screening-result'),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.DOCTOR, roles_constant_1.Role.NURSE, roles_constant_1.Role.CHO),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, SendScreeningResultDto]),
    __metadata("design:returntype", Promise)
], SmsController.prototype, "sendScreeningResult", null);
__decorate([
    (0, common_1.Post)('appointment-reminder/:appointmentId'),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.HIM_OFFICER, roles_constant_1.Role.NURSE),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('appointmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SmsController.prototype, "sendAppointmentReminder", null);
__decorate([
    (0, common_1.Post)('appointment-confirmation/:appointmentId'),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.HIM_OFFICER, roles_constant_1.Role.NURSE),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('appointmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SmsController.prototype, "sendAppointmentConfirmation", null);
__decorate([
    (0, common_1.Post)('follow-up-reminder'),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.DOCTOR, roles_constant_1.Role.NURSE, roles_constant_1.Role.CHO),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, SendFollowUpReminderDto]),
    __metadata("design:returntype", Promise)
], SmsController.prototype, "sendFollowUpReminder", null);
__decorate([
    (0, common_1.Post)('general'),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.HIM_OFFICER),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, SendGeneralSmsDto]),
    __metadata("design:returntype", Promise)
], SmsController.prototype, "sendGeneralSms", null);
__decorate([
    (0, common_1.Post)('process-reminders'),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.ADMIN),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SmsController.prototype, "processReminders", null);
__decorate([
    (0, common_1.Post)('send'),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.HIM_OFFICER, roles_constant_1.Role.DOCTOR, roles_constant_1.Role.NURSE, roles_constant_1.Role.CHO),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, SendManualSmsDto]),
    __metadata("design:returntype", Promise)
], SmsController.prototype, "sendManualSms", null);
__decorate([
    (0, common_1.Post)('screening/:screeningId'),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.DOCTOR, roles_constant_1.Role.NURSE, roles_constant_1.Role.CHO),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('screeningId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SmsController.prototype, "sendScreeningSms", null);
__decorate([
    (0, common_1.Post)('followup/:appointmentId'),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.HIM_OFFICER, roles_constant_1.Role.NURSE, roles_constant_1.Role.CHO),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('appointmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SmsController.prototype, "sendFollowupSms", null);
__decorate([
    (0, common_1.Post)('reminder/:appointmentId'),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.HIM_OFFICER, roles_constant_1.Role.NURSE),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('appointmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SmsController.prototype, "sendReminderSms", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.HIM_OFFICER, roles_constant_1.Role.DOCTOR, roles_constant_1.Role.NURSE, roles_constant_1.Role.CHO),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SmsController.prototype, "getPatientSmsHistory", null);
__decorate([
    (0, common_1.Get)('logs'),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.HIM_OFFICER),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('type')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], SmsController.prototype, "getSmsLogs", null);
exports.SmsController = SmsController = __decorate([
    (0, common_1.Controller)('sms'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [sms_service_1.SmsService,
        audit_service_1.AuditService])
], SmsController);
//# sourceMappingURL=sms.controller.js.map