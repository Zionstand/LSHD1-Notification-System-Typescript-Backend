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
exports.HypertensionScreening = void 0;
const typeorm_1 = require("typeorm");
const screening_entity_1 = require("./screening.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let HypertensionScreening = class HypertensionScreening {
};
exports.HypertensionScreening = HypertensionScreening;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HypertensionScreening.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'screening_id' }),
    __metadata("design:type", Number)
], HypertensionScreening.prototype, "screeningId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => screening_entity_1.Screening),
    (0, typeorm_1.JoinColumn)({ name: 'screening_id' }),
    __metadata("design:type", screening_entity_1.Screening)
], HypertensionScreening.prototype, "screening", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'systolic_bp_1', type: 'int' }),
    __metadata("design:type", Number)
], HypertensionScreening.prototype, "systolicBp1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'diastolic_bp_1', type: 'int' }),
    __metadata("design:type", Number)
], HypertensionScreening.prototype, "diastolicBp1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'position_1', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], HypertensionScreening.prototype, "position1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'arm_used_1', type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], HypertensionScreening.prototype, "armUsed1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'systolic_bp_2', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], HypertensionScreening.prototype, "systolicBp2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'diastolic_bp_2', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], HypertensionScreening.prototype, "diastolicBp2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'position_2', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], HypertensionScreening.prototype, "position2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'arm_used_2', type: 'varchar', length: 10, nullable: true }),
    __metadata("design:type", Object)
], HypertensionScreening.prototype, "armUsed2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'systolic_bp_3', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], HypertensionScreening.prototype, "systolicBp3", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'diastolic_bp_3', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], HypertensionScreening.prototype, "diastolicBp3", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'position_3', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], HypertensionScreening.prototype, "position3", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'arm_used_3', type: 'varchar', length: 10, nullable: true }),
    __metadata("design:type", Object)
], HypertensionScreening.prototype, "armUsed3", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'screening_result', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], HypertensionScreening.prototype, "screeningResult", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'clinical_observations', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], HypertensionScreening.prototype, "clinicalObservations", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], HypertensionScreening.prototype, "recommendations", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'refer_to_doctor', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], HypertensionScreening.prototype, "referToDoctor", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'referral_reason', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], HypertensionScreening.prototype, "referralReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'conducted_by' }),
    __metadata("design:type", Number)
], HypertensionScreening.prototype, "conductedBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'conducted_by' }),
    __metadata("design:type", user_entity_1.User)
], HypertensionScreening.prototype, "conductedByUser", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], HypertensionScreening.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], HypertensionScreening.prototype, "updatedAt", void 0);
exports.HypertensionScreening = HypertensionScreening = __decorate([
    (0, typeorm_1.Entity)('hypertension_screenings')
], HypertensionScreening);
//# sourceMappingURL=hypertension-screening.entity.js.map