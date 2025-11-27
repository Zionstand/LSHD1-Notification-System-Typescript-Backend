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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const user_entity_1 = require("../users/entities/user.entity");
const ROLE_LEVELS = {
    admin: 100,
    him_officer: 80,
    doctor: 70,
    nurse: 60,
    lab_scientist: 50,
};
let AuthService = class AuthService {
    constructor(usersRepository, jwtService) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { email, password, fullName, phone, role, phcCenterId, staffId } = registerDto;
        const existingUser = await this.usersRepository.findOne({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already registered');
        }
        if (staffId) {
            const existingStaffId = await this.usersRepository.findOne({
                where: { staffId },
            });
            if (existingStaffId) {
                throw new common_1.ConflictException('Staff ID already registered');
            }
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = this.usersRepository.create({
            fullName: fullName,
            email: email,
            phone: phone,
            password: hashedPassword,
            role: role,
            phcCenterId: phcCenterId || null,
            staffId: staffId || null,
            status: role === 'admin' ? 'approved' : 'pending',
        });
        const savedUser = await this.usersRepository.save(user);
        if (role === 'admin') {
            const payload = {
                id: savedUser.id,
                email: savedUser.email,
                role: savedUser.role,
                facility_id: savedUser.phcCenterId,
            };
            const token = this.jwtService.sign(payload);
            const nameParts = savedUser.fullName?.split(' ') || ['', ''];
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            return {
                message: 'Registration successful',
                token,
                user: {
                    id: savedUser.id,
                    email: savedUser.email,
                    firstName,
                    lastName,
                    role: {
                        id: savedUser.role,
                        name: savedUser.role,
                        level: ROLE_LEVELS[savedUser.role] || 0,
                    },
                    facility: null,
                },
            };
        }
        return {
            message: 'Registration successful. Your account is pending approval by an administrator.',
            user: {
                id: savedUser.id,
                email: savedUser.email,
                fullName: savedUser.fullName,
                role: savedUser.role,
                status: savedUser.status,
            },
        };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.usersRepository.findOne({
            where: { email, status: 'approved' },
            relations: ['phcCenter'],
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
            facility_id: user.phcCenterId,
        };
        const token = this.jwtService.sign(payload);
        const nameParts = user.fullName?.split(' ') || ['', ''];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        return {
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName,
                lastName,
                role: {
                    id: user.role,
                    name: user.role,
                    level: ROLE_LEVELS[user.role] || 0,
                },
                facility: user.phcCenterId
                    ? { id: user.phcCenterId, name: user.phcCenter?.centerName }
                    : null,
            },
        };
    }
    async getProfile(userId) {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            relations: ['phcCenter'],
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const nameParts = user.fullName?.split(' ') || ['', ''];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        return {
            id: user.id,
            email: user.email,
            firstName,
            lastName,
            role: { id: user.role, name: user.role },
            facility: user.phcCenterId
                ? { id: user.phcCenterId, name: user.phcCenter?.centerName }
                : null,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map