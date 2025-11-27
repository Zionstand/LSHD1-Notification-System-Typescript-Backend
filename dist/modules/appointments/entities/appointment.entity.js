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
exports.Appointment = void 0;
const typeorm_1 = require("typeorm");
const patient_entity_1 = require("../../patients/entities/patient.entity");
const phc_center_entity_1 = require("../../facilities/entities/phc-center.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let Appointment = class Appointment {
};
exports.Appointment = Appointment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Appointment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'patient_id' }),
    __metadata("design:type", Number)
], Appointment.prototype, "patientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phc_center_id' }),
    __metadata("design:type", Number)
], Appointment.prototype, "phcCenterId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'appointment_date', type: 'date' }),
    __metadata("design:type", Date)
], Appointment.prototype, "appointmentDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'appointment_time', type: 'time' }),
    __metadata("design:type", String)
], Appointment.prototype, "appointmentTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'appointment_type', length: 100 }),
    __metadata("design:type", String)
], Appointment.prototype, "appointmentType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Appointment.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['scheduled', 'completed', 'cancelled', 'no_show'],
        default: 'scheduled',
        nullable: true,
    }),
    __metadata("design:type", String)
], Appointment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reminder_sent', type: 'tinyint', default: 0, nullable: true }),
    __metadata("design:type", Number)
], Appointment.prototype, "reminderSent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by' }),
    __metadata("design:type", Number)
], Appointment.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Appointment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Appointment.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => patient_entity_1.Patient),
    (0, typeorm_1.JoinColumn)({ name: 'patient_id' }),
    __metadata("design:type", patient_entity_1.Patient)
], Appointment.prototype, "patient", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => phc_center_entity_1.PhcCenter),
    (0, typeorm_1.JoinColumn)({ name: 'phc_center_id' }),
    __metadata("design:type", phc_center_entity_1.PhcCenter)
], Appointment.prototype, "phcCenter", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], Appointment.prototype, "createdByUser", void 0);
exports.Appointment = Appointment = __decorate([
    (0, typeorm_1.Entity)('appointments')
], Appointment);
//# sourceMappingURL=appointment.entity.js.map