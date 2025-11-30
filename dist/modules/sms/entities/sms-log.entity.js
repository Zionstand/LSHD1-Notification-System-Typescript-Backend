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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsLog = void 0;
const typeorm_1 = require("typeorm");
const patient_entity_1 = require("../../patients/entities/patient.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let SmsLog = class SmsLog {
};
exports.SmsLog = SmsLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SmsLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'patient_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], SmsLog.prototype, "patientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone_number', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], SmsLog.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], SmsLog.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sms_type', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], SmsLog.prototype, "smsType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'PENDING' }),
    __metadata("design:type", String)
], SmsLog.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sendchamp_reference', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], SmsLog.prototype, "sendchampReference", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'error_message', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], SmsLog.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sent_by', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], SmsLog.prototype, "sentBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'facility_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], SmsLog.prototype, "facilityId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'related_entity', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], SmsLog.prototype, "relatedEntity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'related_entity_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], SmsLog.prototype, "relatedEntityId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SmsLog.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sent_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], SmsLog.prototype, "sentAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => patient_entity_1.Patient, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'patient_id' }),
    __metadata("design:type", patient_entity_1.Patient)
], SmsLog.prototype, "patient", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'sent_by' }),
    __metadata("design:type", user_entity_1.User)
], SmsLog.prototype, "sentByUser", void 0);
exports.SmsLog = SmsLog = __decorate([
    (0, typeorm_1.Entity)('sms_logs')
], SmsLog);
//# sourceMappingURL=sms-log.entity.js.map