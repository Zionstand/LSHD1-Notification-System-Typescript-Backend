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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const phc_center_entity_1 = require("../../facilities/entities/phc-center.entity");
let User = class User {
    get firstName() {
        const parts = this.fullName?.split(' ') || [''];
        return parts[0] || '';
    }
    get lastName() {
        const parts = this.fullName?.split(' ') || ['', ''];
        return parts.slice(1).join(' ') || '';
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phc_center_id', nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "phcCenterId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'full_name', length: 150 }),
    __metadata("design:type", String)
], User.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['admin', 'him_officer', 'nurse', 'doctor', 'mls', 'cho'],
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'staff_id', length: 50, nullable: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "staffId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['pending', 'approved', 'rejected', 'suspended'],
        default: 'pending',
    }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_at', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_by', nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'failed_login_attempts', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "failedLoginAttempts", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'locked_until', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "lockedUntil", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_login_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "lastLoginAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => phc_center_entity_1.PhcCenter, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'phc_center_id' }),
    __metadata("design:type", phc_center_entity_1.PhcCenter)
], User.prototype, "phcCenter", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=user.entity.js.map