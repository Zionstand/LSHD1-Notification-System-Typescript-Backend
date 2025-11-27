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
exports.CervicalScreening = void 0;
const typeorm_1 = require("typeorm");
const screening_entity_1 = require("./screening.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let CervicalScreening = class CervicalScreening {
};
exports.CervicalScreening = CervicalScreening;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CervicalScreening.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'screening_id' }),
    __metadata("design:type", Number)
], CervicalScreening.prototype, "screeningId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => screening_entity_1.Screening),
    (0, typeorm_1.JoinColumn)({ name: 'screening_id' }),
    __metadata("design:type", screening_entity_1.Screening)
], CervicalScreening.prototype, "screening", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'screening_performed', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], CervicalScreening.prototype, "screeningPerformed", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'screening_method', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], CervicalScreening.prototype, "screeningMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'other_method_details', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], CervicalScreening.prototype, "otherMethodDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'visual_inspection_findings', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], CervicalScreening.prototype, "visualInspectionFindings", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'specimen_collected', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], CervicalScreening.prototype, "specimenCollected", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'specimen_type', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], CervicalScreening.prototype, "specimenType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'screening_result', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], CervicalScreening.prototype, "screeningResult", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'clinical_observations', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], CervicalScreening.prototype, "clinicalObservations", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], CervicalScreening.prototype, "remarks", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'follow_up_required', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], CervicalScreening.prototype, "followUpRequired", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'follow_up_date', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], CervicalScreening.prototype, "followUpDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'follow_up_notes', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], CervicalScreening.prototype, "followUpNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'conducted_by' }),
    __metadata("design:type", Number)
], CervicalScreening.prototype, "conductedBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'conducted_by' }),
    __metadata("design:type", user_entity_1.User)
], CervicalScreening.prototype, "conductedByUser", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], CervicalScreening.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], CervicalScreening.prototype, "updatedAt", void 0);
exports.CervicalScreening = CervicalScreening = __decorate([
    (0, typeorm_1.Entity)('cervical_screenings')
], CervicalScreening);
//# sourceMappingURL=cervical-screening.entity.js.map