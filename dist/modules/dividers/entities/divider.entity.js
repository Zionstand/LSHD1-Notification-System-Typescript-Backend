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
exports.Divider = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const phc_center_entity_1 = require("../../facilities/entities/phc-center.entity");
let Divider = class Divider {
};
exports.Divider = Divider;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Divider.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'divider_code', type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], Divider.prototype, "dividerCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'full_name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Divider.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], Divider.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], Divider.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Divider.prototype, "lga", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Divider.prototype, "ward", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Divider.prototype, "community", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Divider.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'active' }),
    __metadata("design:type", String)
], Divider.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phc_center_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Divider.prototype, "phcCenterId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'captured_by', type: 'int' }),
    __metadata("design:type", Number)
], Divider.prototype, "capturedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Divider.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Divider.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => phc_center_entity_1.PhcCenter, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'phc_center_id' }),
    __metadata("design:type", phc_center_entity_1.PhcCenter)
], Divider.prototype, "phcCenter", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'captured_by' }),
    __metadata("design:type", user_entity_1.User)
], Divider.prototype, "capturedByUser", void 0);
exports.Divider = Divider = __decorate([
    (0, typeorm_1.Entity)('dividers')
], Divider);
//# sourceMappingURL=divider.entity.js.map