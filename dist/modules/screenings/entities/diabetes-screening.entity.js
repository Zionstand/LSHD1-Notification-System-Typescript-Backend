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
exports.DiabetesScreening = void 0;
const typeorm_1 = require("typeorm");
const screening_entity_1 = require("./screening.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let DiabetesScreening = class DiabetesScreening {
};
exports.DiabetesScreening = DiabetesScreening;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DiabetesScreening.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'screening_id' }),
    __metadata("design:type", Number)
], DiabetesScreening.prototype, "screeningId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => screening_entity_1.Screening),
    (0, typeorm_1.JoinColumn)({ name: 'screening_id' }),
    __metadata("design:type", screening_entity_1.Screening)
], DiabetesScreening.prototype, "screening", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'test_type', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], DiabetesScreening.prototype, "testType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'blood_sugar_level', type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], DiabetesScreening.prototype, "bloodSugarLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit', type: 'varchar', length: 10, default: 'mg/dL' }),
    __metadata("design:type", String)
], DiabetesScreening.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fasting_duration_hours', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], DiabetesScreening.prototype, "fastingDurationHours", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'test_time', type: 'time' }),
    __metadata("design:type", String)
], DiabetesScreening.prototype, "testTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'screening_result', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], DiabetesScreening.prototype, "screeningResult", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'clinical_observations', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], DiabetesScreening.prototype, "clinicalObservations", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'refer_to_doctor', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], DiabetesScreening.prototype, "referToDoctor", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'referral_reason', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], DiabetesScreening.prototype, "referralReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'conducted_by' }),
    __metadata("design:type", Number)
], DiabetesScreening.prototype, "conductedBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'conducted_by' }),
    __metadata("design:type", user_entity_1.User)
], DiabetesScreening.prototype, "conductedByUser", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], DiabetesScreening.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], DiabetesScreening.prototype, "updatedAt", void 0);
exports.DiabetesScreening = DiabetesScreening = __decorate([
    (0, typeorm_1.Entity)('diabetes_screenings')
], DiabetesScreening);
//# sourceMappingURL=diabetes-screening.entity.js.map