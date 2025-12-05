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
exports.Volunteer = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const phc_center_entity_1 = require("../../facilities/entities/phc-center.entity");
let Volunteer = class Volunteer {
};
exports.Volunteer = Volunteer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Volunteer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'volunteer_code', type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], Volunteer.prototype, "volunteerCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'full_name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Volunteer.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'first_name', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Volunteer.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_name', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Volunteer.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Volunteer.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'alt_phone', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], Volunteer.prototype, "altPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], Volunteer.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], Volunteer.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Volunteer.prototype, "age", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date_of_birth', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Volunteer.prototype, "dateOfBirth", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], Volunteer.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Volunteer.prototype, "lga", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Volunteer.prototype, "ward", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Volunteer.prototype, "community", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], Volunteer.prototype, "occupation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'education_level', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Volunteer.prototype, "educationLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'next_of_kin', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], Volunteer.prototype, "nextOfKin", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'next_of_kin_phone', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], Volunteer.prototype, "nextOfKinPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Volunteer.prototype, "skills", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'training_completed', type: 'tinyint', default: 0 }),
    __metadata("design:type", Number)
], Volunteer.prototype, "trainingCompleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'training_date', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Volunteer.prototype, "trainingDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Volunteer.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'pending' }),
    __metadata("design:type", String)
], Volunteer.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phc_center_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Volunteer.prototype, "phcCenterId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'registered_by', type: 'int' }),
    __metadata("design:type", Number)
], Volunteer.prototype, "registeredBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Volunteer.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Volunteer.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => phc_center_entity_1.PhcCenter, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'phc_center_id' }),
    __metadata("design:type", phc_center_entity_1.PhcCenter)
], Volunteer.prototype, "phcCenter", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'registered_by' }),
    __metadata("design:type", user_entity_1.User)
], Volunteer.prototype, "registeredByUser", void 0);
exports.Volunteer = Volunteer = __decorate([
    (0, typeorm_1.Entity)('volunteers')
], Volunteer);
//# sourceMappingURL=volunteer.entity.js.map