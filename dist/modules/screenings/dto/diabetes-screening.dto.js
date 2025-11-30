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
exports.UpdateDiabetesScreeningDto = exports.CreateDiabetesScreeningDto = void 0;
const class_validator_1 = require("class-validator");
class CreateDiabetesScreeningDto {
}
exports.CreateDiabetesScreeningDto = CreateDiabetesScreeningDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateDiabetesScreeningDto.prototype, "screeningId", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['random', 'fasting']),
    __metadata("design:type", String)
], CreateDiabetesScreeningDto.prototype, "testType", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateDiabetesScreeningDto.prototype, "bloodSugarLevel", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['mg/dL', 'mmol/L']),
    __metadata("design:type", String)
], CreateDiabetesScreeningDto.prototype, "unit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateDiabetesScreeningDto.prototype, "fastingDurationHours", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDiabetesScreeningDto.prototype, "testTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDiabetesScreeningDto.prototype, "clinicalObservations", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDiabetesScreeningDto.prototype, "referToDoctor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDiabetesScreeningDto.prototype, "referralReason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateDiabetesScreeningDto.prototype, "labPersonnelId", void 0);
class UpdateDiabetesScreeningDto {
}
exports.UpdateDiabetesScreeningDto = UpdateDiabetesScreeningDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['random', 'fasting']),
    __metadata("design:type", String)
], UpdateDiabetesScreeningDto.prototype, "testType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateDiabetesScreeningDto.prototype, "bloodSugarLevel", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['mg/dL', 'mmol/L']),
    __metadata("design:type", String)
], UpdateDiabetesScreeningDto.prototype, "unit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateDiabetesScreeningDto.prototype, "fastingDurationHours", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDiabetesScreeningDto.prototype, "testTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDiabetesScreeningDto.prototype, "clinicalObservations", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDiabetesScreeningDto.prototype, "referToDoctor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDiabetesScreeningDto.prototype, "referralReason", void 0);
//# sourceMappingURL=diabetes-screening.dto.js.map