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
exports.UpdateCervicalScreeningDto = exports.CreateCervicalScreeningDto = void 0;
const class_validator_1 = require("class-validator");
class CreateCervicalScreeningDto {
}
exports.CreateCervicalScreeningDto = CreateCervicalScreeningDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCervicalScreeningDto.prototype, "screeningId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCervicalScreeningDto.prototype, "screeningPerformed", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['via', 'vili', 'pap_smear', 'hpv_test', 'other']),
    __metadata("design:type", String)
], CreateCervicalScreeningDto.prototype, "screeningMethod", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCervicalScreeningDto.prototype, "otherMethodDetails", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCervicalScreeningDto.prototype, "visualInspectionFindings", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCervicalScreeningDto.prototype, "specimenCollected", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCervicalScreeningDto.prototype, "specimenType", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['negative', 'positive', 'suspicious', 'inconclusive']),
    __metadata("design:type", String)
], CreateCervicalScreeningDto.prototype, "screeningResult", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCervicalScreeningDto.prototype, "clinicalObservations", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCervicalScreeningDto.prototype, "remarks", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCervicalScreeningDto.prototype, "followUpRequired", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateCervicalScreeningDto.prototype, "followUpDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCervicalScreeningDto.prototype, "followUpNotes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCervicalScreeningDto.prototype, "nurseId", void 0);
class UpdateCervicalScreeningDto {
}
exports.UpdateCervicalScreeningDto = UpdateCervicalScreeningDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateCervicalScreeningDto.prototype, "screeningPerformed", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['via', 'vili', 'pap_smear', 'hpv_test', 'other']),
    __metadata("design:type", String)
], UpdateCervicalScreeningDto.prototype, "screeningMethod", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCervicalScreeningDto.prototype, "otherMethodDetails", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCervicalScreeningDto.prototype, "visualInspectionFindings", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateCervicalScreeningDto.prototype, "specimenCollected", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCervicalScreeningDto.prototype, "specimenType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['negative', 'positive', 'suspicious', 'inconclusive']),
    __metadata("design:type", String)
], UpdateCervicalScreeningDto.prototype, "screeningResult", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCervicalScreeningDto.prototype, "clinicalObservations", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCervicalScreeningDto.prototype, "remarks", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateCervicalScreeningDto.prototype, "followUpRequired", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateCervicalScreeningDto.prototype, "followUpDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCervicalScreeningDto.prototype, "followUpNotes", void 0);
//# sourceMappingURL=cervical-screening.dto.js.map