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
exports.VitalRecord = void 0;
const typeorm_1 = require("typeorm");
const patient_entity_1 = require("../../patients/entities/patient.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const screening_entity_1 = require("../../screenings/entities/screening.entity");
let VitalRecord = class VitalRecord {
};
exports.VitalRecord = VitalRecord;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], VitalRecord.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'patient_id' }),
    __metadata("design:type", Number)
], VitalRecord.prototype, "patientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'screening_id', nullable: true }),
    __metadata("design:type", Object)
], VitalRecord.prototype, "screeningId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'blood_pressure_systolic', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], VitalRecord.prototype, "bloodPressureSystolic", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'blood_pressure_diastolic', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], VitalRecord.prototype, "bloodPressureDiastolic", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 4, scale: 1, nullable: true }),
    __metadata("design:type", Object)
], VitalRecord.prototype, "temperature", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pulse_rate', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], VitalRecord.prototype, "pulseRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'respiratory_rate', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], VitalRecord.prototype, "respiratoryRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], VitalRecord.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], VitalRecord.prototype, "height", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 4, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], VitalRecord.prototype, "bmi", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'blood_sugar_random', type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], VitalRecord.prototype, "bloodSugarRandom", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'blood_sugar_fasting', type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], VitalRecord.prototype, "bloodSugarFasting", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], VitalRecord.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'recorded_by' }),
    __metadata("design:type", Number)
], VitalRecord.prototype, "recordedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'recorded_at', type: 'datetime' }),
    __metadata("design:type", Date)
], VitalRecord.prototype, "recordedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], VitalRecord.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => patient_entity_1.Patient),
    (0, typeorm_1.JoinColumn)({ name: 'patient_id' }),
    __metadata("design:type", patient_entity_1.Patient)
], VitalRecord.prototype, "patient", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => screening_entity_1.Screening, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'screening_id' }),
    __metadata("design:type", screening_entity_1.Screening)
], VitalRecord.prototype, "screening", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'recorded_by' }),
    __metadata("design:type", user_entity_1.User)
], VitalRecord.prototype, "recordedByUser", void 0);
exports.VitalRecord = VitalRecord = __decorate([
    (0, typeorm_1.Entity)('vital_records')
], VitalRecord);
//# sourceMappingURL=vital-record.entity.js.map