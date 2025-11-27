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
exports.ScreeningsController = void 0;
const common_1 = require("@nestjs/common");
const screenings_service_1 = require("./screenings.service");
const create_screening_dto_1 = require("./dto/create-screening.dto");
const update_vitals_dto_1 = require("./dto/update-vitals.dto");
const complete_screening_dto_1 = require("./dto/complete-screening.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ScreeningsController = class ScreeningsController {
    constructor(screeningsService) {
        this.screeningsService = screeningsService;
    }
    async findAll(req, status) {
        return this.screeningsService.findAll(req.user.facility_id, status);
    }
    async findOne(id) {
        return this.screeningsService.findOne(+id);
    }
    async create(createDto, req) {
        return this.screeningsService.create(createDto, req.user.id, req.user.facility_id || 1);
    }
    async updateVitals(id, updateDto) {
        return this.screeningsService.updateVitals(+id, updateDto);
    }
    async complete(id, completeDto) {
        return this.screeningsService.complete(+id, completeDto);
    }
};
exports.ScreeningsController = ScreeningsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ScreeningsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScreeningsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_screening_dto_1.CreateScreeningDto, Object]),
    __metadata("design:returntype", Promise)
], ScreeningsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id/vitals'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_vitals_dto_1.UpdateVitalsDto]),
    __metadata("design:returntype", Promise)
], ScreeningsController.prototype, "updateVitals", null);
__decorate([
    (0, common_1.Put)(':id/complete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, complete_screening_dto_1.CompleteScreeningDto]),
    __metadata("design:returntype", Promise)
], ScreeningsController.prototype, "complete", null);
exports.ScreeningsController = ScreeningsController = __decorate([
    (0, common_1.Controller)('screenings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [screenings_service_1.ScreeningsService])
], ScreeningsController);
//# sourceMappingURL=screenings.controller.js.map