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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathwayScreeningsController = void 0;
const common_1 = require("@nestjs/common");
const pathway_screenings_service_1 = require("./pathway-screenings.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const hypertension_screening_dto_1 = require("./dto/hypertension-screening.dto");
const diabetes_screening_dto_1 = require("./dto/diabetes-screening.dto");
const cervical_screening_dto_1 = require("./dto/cervical-screening.dto");
const breast_screening_dto_1 = require("./dto/breast-screening.dto");
const psa_screening_dto_1 = require("./dto/psa-screening.dto");
let PathwayScreeningsController = class PathwayScreeningsController {
    constructor(pathwayService) {
        this.pathwayService = pathwayService;
    }
    async createHypertensionScreening(id, dto, req) {
        return this.pathwayService.createHypertensionScreening({ ...dto, screeningId: +id }, req.user.id);
    }
    async getHypertensionScreening(id) {
        return this.pathwayService.getHypertensionScreening(+id);
    }
    async updateHypertensionScreening(id, dto) {
        return this.pathwayService.updateHypertensionScreening(+id, dto);
    }
    async createDiabetesScreening(id, dto, req) {
        return this.pathwayService.createDiabetesScreening({ ...dto, screeningId: +id }, req.user.id);
    }
    async getDiabetesScreening(id) {
        return this.pathwayService.getDiabetesScreening(+id);
    }
    async updateDiabetesScreening(id, dto) {
        return this.pathwayService.updateDiabetesScreening(+id, dto);
    }
    async createCervicalScreening(id, dto, req) {
        return this.pathwayService.createCervicalScreening({ ...dto, screeningId: +id }, req.user.id);
    }
    async getCervicalScreening(id) {
        return this.pathwayService.getCervicalScreening(+id);
    }
    async updateCervicalScreening(id, dto) {
        return this.pathwayService.updateCervicalScreening(+id, dto);
    }
    async createBreastScreening(id, dto, req) {
        return this.pathwayService.createBreastScreening({ ...dto, screeningId: +id }, req.user.id);
    }
    async getBreastScreening(id) {
        return this.pathwayService.getBreastScreening(+id);
    }
    async updateBreastScreening(id, dto) {
        return this.pathwayService.updateBreastScreening(+id, dto);
    }
    async createPsaScreening(id, dto, req) {
        return this.pathwayService.createPsaScreening({ ...dto, screeningId: +id }, req.user.id);
    }
    async getPsaScreening(id) {
        return this.pathwayService.getPsaScreening(+id);
    }
    async updatePsaScreening(id, dto) {
        return this.pathwayService.updatePsaScreening(+id, dto);
    }
    async getPathwayData(id) {
        const screening = await this.pathwayService.getPathwayData(+id, 'hypertension');
        if (screening)
            return { pathway: 'hypertension', data: screening };
        const diabetes = await this.pathwayService.getPathwayData(+id, 'diabetes');
        if (diabetes)
            return { pathway: 'diabetes', data: diabetes };
        const cervical = await this.pathwayService.getPathwayData(+id, 'cervical');
        if (cervical)
            return { pathway: 'cervical', data: cervical };
        const breast = await this.pathwayService.getPathwayData(+id, 'breast');
        if (breast)
            return { pathway: 'breast', data: breast };
        const psa = await this.pathwayService.getPathwayData(+id, 'psa');
        if (psa)
            return { pathway: 'psa', data: psa };
        return { pathway: null, data: null };
    }
};
exports.PathwayScreeningsController = PathwayScreeningsController;
__decorate([
    (0, common_1.Post)(':id/hypertension'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PathwayScreeningsController.prototype, "createHypertensionScreening", null);
__decorate([
    (0, common_1.Get)(':id/hypertension'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PathwayScreeningsController.prototype, "getHypertensionScreening", null);
__decorate([
    (0, common_1.Put)(':id/hypertension'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, hypertension_screening_dto_1.UpdateHypertensionScreeningDto]),
    __metadata("design:returntype", Promise)
], PathwayScreeningsController.prototype, "updateHypertensionScreening", null);
__decorate([
    (0, common_1.Post)(':id/diabetes'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PathwayScreeningsController.prototype, "createDiabetesScreening", null);
__decorate([
    (0, common_1.Get)(':id/diabetes'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PathwayScreeningsController.prototype, "getDiabetesScreening", null);
__decorate([
    (0, common_1.Put)(':id/diabetes'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, diabetes_screening_dto_1.UpdateDiabetesScreeningDto]),
    __metadata("design:returntype", Promise)
], PathwayScreeningsController.prototype, "updateDiabetesScreening", null);
__decorate([
    (0, common_1.Post)(':id/cervical'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PathwayScreeningsController.prototype, "createCervicalScreening", null);
__decorate([
    (0, common_1.Get)(':id/cervical'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PathwayScreeningsController.prototype, "getCervicalScreening", null);
__decorate([
    (0, common_1.Put)(':id/cervical'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, cervical_screening_dto_1.UpdateCervicalScreeningDto]),
    __metadata("design:returntype", Promise)
], PathwayScreeningsController.prototype, "updateCervicalScreening", null);
__decorate([
    (0, common_1.Post)(':id/breast'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PathwayScreeningsController.prototype, "createBreastScreening", null);
__decorate([
    (0, common_1.Get)(':id/breast'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PathwayScreeningsController.prototype, "getBreastScreening", null);
__decorate([
    (0, common_1.Put)(':id/breast'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, breast_screening_dto_1.UpdateBreastScreeningDto]),
    __metadata("design:returntype", Promise)
], PathwayScreeningsController.prototype, "updateBreastScreening", null);
__decorate([
    (0, common_1.Post)(':id/psa'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PathwayScreeningsController.prototype, "createPsaScreening", null);
__decorate([
    (0, common_1.Get)(':id/psa'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PathwayScreeningsController.prototype, "getPsaScreening", null);
__decorate([
    (0, common_1.Put)(':id/psa'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, psa_screening_dto_1.UpdatePsaScreeningDto]),
    __metadata("design:returntype", Promise)
], PathwayScreeningsController.prototype, "updatePsaScreening", null);
__decorate([
    (0, common_1.Get)(':id/pathway-data'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PathwayScreeningsController.prototype, "getPathwayData", null);
exports.PathwayScreeningsController = PathwayScreeningsController = __decorate([
    (0, common_1.Controller)('screenings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [pathway_screenings_service_1.PathwayScreeningsService])
], PathwayScreeningsController);
//# sourceMappingURL=pathway-screenings.controller.js.map