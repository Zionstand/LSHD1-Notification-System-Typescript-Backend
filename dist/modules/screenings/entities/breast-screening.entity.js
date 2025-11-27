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
exports.BreastScreening = void 0;
const typeorm_1 = require("typeorm");
const screening_entity_1 = require("./screening.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let BreastScreening = class BreastScreening {
};
exports.BreastScreening = BreastScreening;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BreastScreening.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'screening_id' }),
    __metadata("design:type", Number)
], BreastScreening.prototype, "screeningId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => screening_entity_1.Screening),
    (0, typeorm_1.JoinColumn)({ name: 'screening_id' }),
    __metadata("design:type", screening_entity_1.Screening)
], BreastScreening.prototype, "screening", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lump_present', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], BreastScreening.prototype, "lumpPresent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lump_location', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], BreastScreening.prototype, "lumpLocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lump_size', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], BreastScreening.prototype, "lumpSize", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lump_characteristics', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], BreastScreening.prototype, "lumpCharacteristics", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discharge_present', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], BreastScreening.prototype, "dischargePresent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discharge_type', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], BreastScreening.prototype, "dischargeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discharge_location', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], BreastScreening.prototype, "dischargeLocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nipple_inversion', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], BreastScreening.prototype, "nippleInversion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nipple_inversion_laterality', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], BreastScreening.prototype, "nippleInversionLaterality", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lymph_node_status', type: 'varchar', length: 20, default: 'normal' }),
    __metadata("design:type", String)
], BreastScreening.prototype, "lymphNodeStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lymph_node_location', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], BreastScreening.prototype, "lymphNodeLocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'skin_changes', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], BreastScreening.prototype, "skinChanges", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'breast_symmetry', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], BreastScreening.prototype, "breastSymmetry", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'summary_findings', type: 'text' }),
    __metadata("design:type", String)
], BreastScreening.prototype, "summaryFindings", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'risk_assessment', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], BreastScreening.prototype, "riskAssessment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], BreastScreening.prototype, "recommendations", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'referral_required', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], BreastScreening.prototype, "referralRequired", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'referral_facility', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", Object)
], BreastScreening.prototype, "referralFacility", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'referral_reason', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], BreastScreening.prototype, "referralReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'conducted_by' }),
    __metadata("design:type", Number)
], BreastScreening.prototype, "conductedBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'conducted_by' }),
    __metadata("design:type", user_entity_1.User)
], BreastScreening.prototype, "conductedByUser", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], BreastScreening.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], BreastScreening.prototype, "updatedAt", void 0);
exports.BreastScreening = BreastScreening = __decorate([
    (0, typeorm_1.Entity)('breast_screenings')
], BreastScreening);
//# sourceMappingURL=breast-screening.entity.js.map