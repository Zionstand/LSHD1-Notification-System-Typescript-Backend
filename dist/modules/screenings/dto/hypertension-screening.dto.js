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
exports.UpdateHypertensionScreeningDto = exports.CreateHypertensionScreeningDto = void 0;
const class_validator_1 = require("class-validator");
class CreateHypertensionScreeningDto {
}
exports.CreateHypertensionScreeningDto = CreateHypertensionScreeningDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateHypertensionScreeningDto.prototype, "screeningId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateHypertensionScreeningDto.prototype, "systolicBp1", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateHypertensionScreeningDto.prototype, "diastolicBp1", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['sitting', 'standing', 'lying']),
    __metadata("design:type", String)
], CreateHypertensionScreeningDto.prototype, "position1", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['left', 'right']),
    __metadata("design:type", String)
], CreateHypertensionScreeningDto.prototype, "armUsed1", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateHypertensionScreeningDto.prototype, "systolicBp2", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateHypertensionScreeningDto.prototype, "diastolicBp2", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['sitting', 'standing', 'lying']),
    __metadata("design:type", String)
], CreateHypertensionScreeningDto.prototype, "position2", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['left', 'right']),
    __metadata("design:type", String)
], CreateHypertensionScreeningDto.prototype, "armUsed2", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateHypertensionScreeningDto.prototype, "systolicBp3", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateHypertensionScreeningDto.prototype, "diastolicBp3", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['sitting', 'standing', 'lying']),
    __metadata("design:type", String)
], CreateHypertensionScreeningDto.prototype, "position3", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['left', 'right']),
    __metadata("design:type", String)
], CreateHypertensionScreeningDto.prototype, "armUsed3", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHypertensionScreeningDto.prototype, "clinicalObservations", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHypertensionScreeningDto.prototype, "recommendations", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateHypertensionScreeningDto.prototype, "referToDoctor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHypertensionScreeningDto.prototype, "referralReason", void 0);
class UpdateHypertensionScreeningDto {
}
exports.UpdateHypertensionScreeningDto = UpdateHypertensionScreeningDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateHypertensionScreeningDto.prototype, "systolicBp1", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateHypertensionScreeningDto.prototype, "diastolicBp1", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['sitting', 'standing', 'lying']),
    __metadata("design:type", String)
], UpdateHypertensionScreeningDto.prototype, "position1", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['left', 'right']),
    __metadata("design:type", String)
], UpdateHypertensionScreeningDto.prototype, "armUsed1", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateHypertensionScreeningDto.prototype, "systolicBp2", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateHypertensionScreeningDto.prototype, "diastolicBp2", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['sitting', 'standing', 'lying']),
    __metadata("design:type", String)
], UpdateHypertensionScreeningDto.prototype, "position2", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['left', 'right']),
    __metadata("design:type", String)
], UpdateHypertensionScreeningDto.prototype, "armUsed2", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateHypertensionScreeningDto.prototype, "systolicBp3", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateHypertensionScreeningDto.prototype, "diastolicBp3", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['sitting', 'standing', 'lying']),
    __metadata("design:type", String)
], UpdateHypertensionScreeningDto.prototype, "position3", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['left', 'right']),
    __metadata("design:type", String)
], UpdateHypertensionScreeningDto.prototype, "armUsed3", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateHypertensionScreeningDto.prototype, "clinicalObservations", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateHypertensionScreeningDto.prototype, "recommendations", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateHypertensionScreeningDto.prototype, "referToDoctor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateHypertensionScreeningDto.prototype, "referralReason", void 0);
//# sourceMappingURL=hypertension-screening.dto.js.map