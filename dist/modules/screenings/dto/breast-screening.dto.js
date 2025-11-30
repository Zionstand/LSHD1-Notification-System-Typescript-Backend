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
exports.UpdateBreastScreeningDto = exports.CreateBreastScreeningDto = void 0;
const class_validator_1 = require("class-validator");
class CreateBreastScreeningDto {
}
exports.CreateBreastScreeningDto = CreateBreastScreeningDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateBreastScreeningDto.prototype, "screeningId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateBreastScreeningDto.prototype, "lumpPresent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBreastScreeningDto.prototype, "lumpLocation", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBreastScreeningDto.prototype, "lumpSize", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBreastScreeningDto.prototype, "lumpCharacteristics", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateBreastScreeningDto.prototype, "dischargePresent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBreastScreeningDto.prototype, "dischargeType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['left', 'right', 'bilateral', 'none']),
    __metadata("design:type", String)
], CreateBreastScreeningDto.prototype, "dischargeLocation", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateBreastScreeningDto.prototype, "nippleInversion", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['left', 'right', 'bilateral', 'none']),
    __metadata("design:type", String)
], CreateBreastScreeningDto.prototype, "nippleInversionLaterality", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['normal', 'enlarged']),
    __metadata("design:type", String)
], CreateBreastScreeningDto.prototype, "lymphNodeStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBreastScreeningDto.prototype, "lymphNodeLocation", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBreastScreeningDto.prototype, "skinChanges", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBreastScreeningDto.prototype, "breastSymmetry", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBreastScreeningDto.prototype, "summaryFindings", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['low', 'moderate', 'high']),
    __metadata("design:type", String)
], CreateBreastScreeningDto.prototype, "riskAssessment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBreastScreeningDto.prototype, "recommendations", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateBreastScreeningDto.prototype, "referralRequired", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBreastScreeningDto.prototype, "referralFacility", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBreastScreeningDto.prototype, "referralReason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateBreastScreeningDto.prototype, "doctorId", void 0);
class UpdateBreastScreeningDto {
}
exports.UpdateBreastScreeningDto = UpdateBreastScreeningDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateBreastScreeningDto.prototype, "lumpPresent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBreastScreeningDto.prototype, "lumpLocation", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBreastScreeningDto.prototype, "lumpSize", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBreastScreeningDto.prototype, "lumpCharacteristics", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateBreastScreeningDto.prototype, "dischargePresent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBreastScreeningDto.prototype, "dischargeType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['left', 'right', 'bilateral', 'none']),
    __metadata("design:type", String)
], UpdateBreastScreeningDto.prototype, "dischargeLocation", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateBreastScreeningDto.prototype, "nippleInversion", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['left', 'right', 'bilateral', 'none']),
    __metadata("design:type", String)
], UpdateBreastScreeningDto.prototype, "nippleInversionLaterality", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['normal', 'enlarged']),
    __metadata("design:type", String)
], UpdateBreastScreeningDto.prototype, "lymphNodeStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBreastScreeningDto.prototype, "lymphNodeLocation", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBreastScreeningDto.prototype, "skinChanges", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBreastScreeningDto.prototype, "breastSymmetry", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBreastScreeningDto.prototype, "summaryFindings", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['low', 'moderate', 'high']),
    __metadata("design:type", String)
], UpdateBreastScreeningDto.prototype, "riskAssessment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBreastScreeningDto.prototype, "recommendations", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateBreastScreeningDto.prototype, "referralRequired", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBreastScreeningDto.prototype, "referralFacility", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBreastScreeningDto.prototype, "referralReason", void 0);
//# sourceMappingURL=breast-screening.dto.js.map