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
exports.Patient = void 0;
const typeorm_1 = require("typeorm");
const phc_center_entity_1 = require("../../facilities/entities/phc-center.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let Patient = class Patient {
};
exports.Patient = Patient;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Patient.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phc_center_id' }),
    __metadata("design:type", Number)
], Patient.prototype, "phcCenterId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'patient_number', length: 50 }),
    __metadata("design:type", String)
], Patient.prototype, "patientNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'first_name', length: 100 }),
    __metadata("design:type", String)
], Patient.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_name', length: 100 }),
    __metadata("design:type", String)
], Patient.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date_of_birth', type: 'date' }),
    __metadata("design:type", Date)
], Patient.prototype, "dateOfBirth", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['male', 'female'] }),
    __metadata("design:type", String)
], Patient.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], Patient.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'alt_phone', length: 20, nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "altPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Patient.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "lga", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'blood_group', length: 5, nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "bloodGroup", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 5, nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "genotype", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'emergency_contact', length: 150, nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "emergencyContact", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'emergency_phone', length: 20, nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "emergencyPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'registered_by' }),
    __metadata("design:type", Number)
], Patient.prototype, "registeredBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Patient.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Patient.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => phc_center_entity_1.PhcCenter),
    (0, typeorm_1.JoinColumn)({ name: 'phc_center_id' }),
    __metadata("design:type", phc_center_entity_1.PhcCenter)
], Patient.prototype, "phcCenter", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'registered_by' }),
    __metadata("design:type", user_entity_1.User)
], Patient.prototype, "registeredByUser", void 0);
exports.Patient = Patient = __decorate([
    (0, typeorm_1.Entity)('patients')
], Patient);
//# sourceMappingURL=patient.entity.js.map