"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DividersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const divider_entity_1 = require("./entities/divider.entity");
const dividers_service_1 = require("./dividers.service");
const dividers_controller_1 = require("./dividers.controller");
let DividersModule = class DividersModule {
};
exports.DividersModule = DividersModule;
exports.DividersModule = DividersModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([divider_entity_1.Divider])],
        providers: [dividers_service_1.DividersService],
        controllers: [dividers_controller_1.DividersController],
        exports: [dividers_service_1.DividersService],
    })
], DividersModule);
//# sourceMappingURL=dividers.module.js.map