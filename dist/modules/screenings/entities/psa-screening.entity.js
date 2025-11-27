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
exports.PsaScreening = void 0;
const typeorm_1 = require("typeorm");
const screening_entity_1 = require("./screening.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let PsaScreening = class PsaScreening {
};
exports.PsaScreening = PsaScreening;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PsaScreening.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'screening_id' }),
    __metadata("design:type", Number)
], PsaScreening.prototype, "screeningId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => screening_entity_1.Screening),
    (0, typeorm_1.JoinColumn)({ name: 'screening_id' }),
    __metadata("design:type", screening_entity_1.Screening)
], PsaScreening.prototype, "screening", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'psa_level', type: 'decimal', precision: 6, scale: 3 }),
    __metadata("design:type", Number)
], PsaScreening.prototype, "psaLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit', type: 'varchar', length: 10, default: 'ng/mL' }),
    __metadata("design:type", String)
], PsaScreening.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'test_method', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], PsaScreening.prototype, "testMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'test_kit', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], PsaScreening.prototype, "testKit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'collection_time', type: 'time' }),
    __metadata("design:type", String)
], PsaScreening.prototype, "collectionTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sample_quality', type: 'varchar', length: 50, default: 'adequate' }),
    __metadata("design:type", String)
], PsaScreening.prototype, "sampleQuality", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sample_quality_notes', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], PsaScreening.prototype, "sampleQualityNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'patient_age', type: 'int' }),
    __metadata("design:type", Number)
], PsaScreening.prototype, "patientAge", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'normal_range_min', type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PsaScreening.prototype, "normalRangeMin", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'normal_range_max', type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], PsaScreening.prototype, "normalRangeMax", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'screening_result', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], PsaScreening.prototype, "screeningResult", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'result_interpretation', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], PsaScreening.prototype, "resultInterpretation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'clinical_observations', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], PsaScreening.prototype, "clinicalObservations", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'refer_to_doctor', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], PsaScreening.prototype, "referToDoctor", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'referral_reason', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], PsaScreening.prototype, "referralReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'conducted_by' }),
    __metadata("design:type", Number)
], PsaScreening.prototype, "conductedBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'conducted_by' }),
    __metadata("design:type", user_entity_1.User)
], PsaScreening.prototype, "conductedByUser", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PsaScreening.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PsaScreening.prototype, "updatedAt", void 0);
exports.PsaScreening = PsaScreening = __decorate([
    (0, typeorm_1.Entity)('psa_screenings')
], PsaScreening);
//# sourceMappingURL=psa-screening.entity.js.map