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
exports.Screening = void 0;
const typeorm_1 = require("typeorm");
const patient_entity_1 = require("../../patients/entities/patient.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let Screening = class Screening {
};
exports.Screening = Screening;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Screening.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'patient_id' }),
    __metadata("design:type", Number)
], Screening.prototype, "patientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'screening_date', type: 'date' }),
    __metadata("design:type", Date)
], Screening.prototype, "screeningDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'screening_time', type: 'time' }),
    __metadata("design:type", String)
], Screening.prototype, "screeningTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'conducted_by' }),
    __metadata("design:type", Number)
], Screening.prototype, "conductedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'screening_type', length: 100 }),
    __metadata("design:type", String)
], Screening.prototype, "screeningType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'blood_pressure_systolic', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Screening.prototype, "bloodPressureSystolic", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'blood_pressure_diastolic', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Screening.prototype, "bloodPressureDiastolic", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 4, scale: 1, nullable: true }),
    __metadata("design:type", Number)
], Screening.prototype, "temperature", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pulse_rate', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Screening.prototype, "pulseRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'respiratory_rate', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Screening.prototype, "respiratoryRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Screening.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Screening.prototype, "height", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 4, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Screening.prototype, "bmi", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'blood_sugar_random', type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Screening.prototype, "bloodSugarRandom", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'blood_sugar_fasting', type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Screening.prototype, "bloodSugarFasting", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cholesterol_level', type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Screening.prototype, "cholesterolLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Screening.prototype, "diagnosis", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Screening.prototype, "prescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Screening.prototype, "recommendations", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'next_appointment', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Screening.prototype, "nextAppointment", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'patient_status', length: 50, nullable: true }),
    __metadata("design:type", String)
], Screening.prototype, "patientStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'referral_facility', length: 255, nullable: true }),
    __metadata("design:type", String)
], Screening.prototype, "referralFacility", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'doctor_id', nullable: true }),
    __metadata("design:type", Number)
], Screening.prototype, "doctorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'doctor_assessed_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Screening.prototype, "doctorAssessedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['completed', 'pending', 'follow_up'],
        default: 'completed',
        nullable: true,
    }),
    __metadata("design:type", String)
], Screening.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sms_sent', type: 'tinyint', default: 0, nullable: true }),
    __metadata("design:type", Number)
], Screening.prototype, "smsSent", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Screening.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Screening.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => patient_entity_1.Patient),
    (0, typeorm_1.JoinColumn)({ name: 'patient_id' }),
    __metadata("design:type", patient_entity_1.Patient)
], Screening.prototype, "patient", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'conducted_by' }),
    __metadata("design:type", user_entity_1.User)
], Screening.prototype, "conductedByUser", void 0);
exports.Screening = Screening = __decorate([
    (0, typeorm_1.Entity)('screenings')
], Screening);
//# sourceMappingURL=screening.entity.js.map