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
const roles_constant_1 = require("./constants/roles.constant");
const audit_service_1 = require("../audit/audit.service");
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;
let AuthService = class AuthService {
    constructor(usersRepository, jwtService, auditService) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
        this.auditService = auditService;
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
                        level: roles_constant_1.ROLE_LEVELS[savedUser.role] || 0,
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
    async login(loginDto, ipAddress, userAgent) {
        const { email, password } = loginDto;
        const user = await this.usersRepository.findOne({
            where: { email },
            relations: ['phcCenter'],
        });
        if (!user) {
            await this.auditService.log({
                action: 'LOGIN_FAILED',
                resource: 'USER',
                details: { email, reason: 'User not found' },
                ipAddress,
                userAgent,
            });
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        if (user.lockedUntil && new Date() < new Date(user.lockedUntil)) {
            const remainingMinutes = Math.ceil((new Date(user.lockedUntil).getTime() - Date.now()) / 60000);
            throw new common_1.UnauthorizedException(`Account is locked. Please try again in ${remainingMinutes} minute(s).`);
        }
        if (user.status !== 'approved') {
            throw new common_1.UnauthorizedException(user.status === 'pending'
                ? 'Your account is pending approval'
                : 'Your account has been suspended or rejected');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
            await this.auditService.log({
                userId: user.id,
                action: 'LOGIN_FAILED',
                resource: 'USER',
                resourceId: user.id,
                details: { reason: 'Invalid password', attempt: user.failedLoginAttempts },
                ipAddress,
                userAgent,
                facilityId: user.phcCenterId,
            });
            if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
                user.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000);
                await this.usersRepository.save(user);
                throw new common_1.UnauthorizedException(`Account locked due to too many failed attempts. Please try again in ${LOCKOUT_DURATION_MINUTES} minutes.`);
            }
            await this.usersRepository.save(user);
            const remainingAttempts = MAX_FAILED_ATTEMPTS - user.failedLoginAttempts;
            throw new common_1.UnauthorizedException(`Invalid email or password. ${remainingAttempts} attempt(s) remaining.`);
        }
        user.failedLoginAttempts = 0;
        user.lockedUntil = null;
        user.lastLoginAt = new Date();
        await this.usersRepository.save(user);
        await this.auditService.log({
            userId: user.id,
            action: 'LOGIN',
            resource: 'USER',
            resourceId: user.id,
            details: { email: user.email },
            ipAddress,
            userAgent,
            facilityId: user.phcCenterId,
        });
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
                    level: roles_constant_1.ROLE_LEVELS[user.role] || 0,
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
        jwt_1.JwtService,
        audit_service_1.AuditService])
], AuthService);
//# sourceMappingURL=auth.service.js.map