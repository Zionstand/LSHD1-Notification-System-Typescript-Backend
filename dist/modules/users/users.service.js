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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const user_entity_1 = require("./entities/user.entity");
const sms_service_1 = require("../sms/sms.service");
const email_service_1 = require("../email/email.service");
const audit_service_1 = require("../audit/audit.service");
let UsersService = UsersService_1 = class UsersService {
    constructor(usersRepository, smsService, emailService, auditService) {
        this.usersRepository = usersRepository;
        this.smsService = smsService;
        this.emailService = emailService;
        this.auditService = auditService;
        this.logger = new common_1.Logger(UsersService_1.name);
    }
    async create(createUserDto) {
        const existingUser = await this.usersRepository.findOne({
            where: { email: createUserDto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already registered');
        }
        if (createUserDto.staffId) {
            const existingStaffId = await this.usersRepository.findOne({
                where: { staffId: createUserDto.staffId },
            });
            if (existingStaffId) {
                throw new common_1.ConflictException('Staff ID already registered');
            }
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
        const user = this.usersRepository.create({
            fullName: createUserDto.fullName,
            email: createUserDto.email,
            phone: createUserDto.phone,
            password: hashedPassword,
            role: createUserDto.role,
            phcCenterId: createUserDto.phcCenterId || null,
            staffId: createUserDto.staffId || null,
            status: createUserDto.role === 'admin' ? 'approved' : 'pending',
        });
        const savedUser = await this.usersRepository.save(user);
        return savedUser;
    }
    async findByEmail(email) {
        return this.usersRepository.findOne({
            where: { email },
            relations: ['phcCenter'],
        });
    }
    async findAll(status) {
        const whereClause = {};
        if (status) {
            whereClause.status = status;
        }
        const users = await this.usersRepository.find({
            where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
            relations: ['phcCenter'],
            order: { createdAt: 'DESC' },
        });
        return users.map((u) => this.formatUser(u));
    }
    async findPendingUsers() {
        const users = await this.usersRepository.find({
            where: { status: 'pending' },
            relations: ['phcCenter'],
            order: { createdAt: 'ASC' },
        });
        return users.map((u) => this.formatUser(u));
    }
    formatUser(u) {
        const nameParts = u.fullName?.split(' ') || ['', ''];
        return {
            id: u.id,
            email: u.email,
            fullName: u.fullName,
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            phone: u.phone,
            staffId: u.staffId,
            status: u.status,
            isActive: u.status === 'approved',
            role: u.role,
            facilityId: u.phcCenterId,
            facility: u.phcCenter?.centerName || null,
            createdAt: u.createdAt,
            approvedAt: u.approvedAt,
        };
    }
    async findOne(id) {
        return this.usersRepository.findOne({
            where: { id },
            relations: ['phcCenter'],
        });
    }
    async approveUser(id, approvedBy) {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['phcCenter'],
        });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (user.status === 'approved') {
            throw new common_1.BadRequestException('User is already approved');
        }
        user.status = 'approved';
        user.approvedAt = new Date();
        user.approvedBy = approvedBy;
        const savedUser = await this.usersRepository.save(user);
        await this.auditService.log({
            userId: approvedBy,
            action: 'APPROVE',
            resource: 'USER',
            resourceId: user.id,
            details: {
                staffName: user.fullName,
                staffEmail: user.email,
                staffRole: user.role,
                approvedAt: user.approvedAt,
                previousStatus: 'pending',
            },
            facilityId: user.phcCenterId,
        });
        this.logger.log(`Audit log created: User ${user.fullName} approved by user ID ${approvedBy}`);
        if (user.phone) {
            try {
                await this.smsService.sendStaffApprovalSms(user.phone, user.fullName, user.role);
                this.logger.log(`Approval SMS sent to ${user.fullName} (${user.phone})`);
            }
            catch (error) {
                this.logger.error(`Failed to send approval SMS to ${user.fullName}: ${error.message}`);
            }
        }
        if (user.email) {
            try {
                await this.emailService.sendStaffApprovalEmail(user.email, user.fullName, user.role);
                this.logger.log(`Approval email sent to ${user.fullName} (${user.email})`);
            }
            catch (error) {
                this.logger.error(`Failed to send approval email to ${user.fullName}: ${error.message}`);
            }
        }
        return {
            message: 'User approved successfully',
            user: this.formatUser(savedUser),
        };
    }
    async rejectUser(id, rejectedBy) {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['phcCenter'],
        });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (user.status === 'rejected') {
            throw new common_1.BadRequestException('User is already rejected');
        }
        const previousStatus = user.status;
        user.status = 'rejected';
        const savedUser = await this.usersRepository.save(user);
        await this.auditService.log({
            userId: rejectedBy,
            action: 'REJECT',
            resource: 'USER',
            resourceId: user.id,
            details: {
                staffName: user.fullName,
                staffEmail: user.email,
                staffRole: user.role,
                rejectedAt: new Date(),
                previousStatus,
            },
            facilityId: user.phcCenterId,
        });
        this.logger.log(`Audit log created: User ${user.fullName} rejected by user ID ${rejectedBy}`);
        if (user.email) {
            try {
                await this.emailService.sendStaffRejectionEmail(user.email, user.fullName, user.role);
                this.logger.log(`Rejection email sent to ${user.fullName} (${user.email})`);
            }
            catch (error) {
                this.logger.error(`Failed to send rejection email to ${user.fullName}: ${error.message}`);
            }
        }
        return {
            message: 'User rejected',
            user: this.formatUser(savedUser),
        };
    }
    async suspendUser(id, suspendedBy) {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['phcCenter'],
        });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (user.role === 'admin') {
            throw new common_1.BadRequestException('Cannot suspend an admin user');
        }
        const previousStatus = user.status;
        user.status = 'suspended';
        const savedUser = await this.usersRepository.save(user);
        await this.auditService.log({
            userId: suspendedBy,
            action: 'SUSPEND',
            resource: 'USER',
            resourceId: user.id,
            details: {
                staffName: user.fullName,
                staffEmail: user.email,
                staffRole: user.role,
                suspendedAt: new Date(),
                previousStatus,
            },
            facilityId: user.phcCenterId,
        });
        this.logger.log(`Audit log created: User ${user.fullName} suspended by user ID ${suspendedBy}`);
        return {
            message: 'User suspended',
            user: this.formatUser(savedUser),
        };
    }
    async reactivateUser(id, reactivatedBy) {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['phcCenter'],
        });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (user.status === 'approved') {
            throw new common_1.BadRequestException('User is already active');
        }
        const previousStatus = user.status;
        user.status = 'approved';
        user.approvedAt = new Date();
        user.approvedBy = reactivatedBy;
        const savedUser = await this.usersRepository.save(user);
        await this.auditService.log({
            userId: reactivatedBy,
            action: 'REACTIVATE',
            resource: 'USER',
            resourceId: user.id,
            details: {
                staffName: user.fullName,
                staffEmail: user.email,
                staffRole: user.role,
                reactivatedAt: new Date(),
                previousStatus,
            },
            facilityId: user.phcCenterId,
        });
        this.logger.log(`Audit log created: User ${user.fullName} reactivated by user ID ${reactivatedBy}`);
        return {
            message: 'User reactivated successfully',
            user: this.formatUser(savedUser),
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => sms_service_1.SmsService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => email_service_1.EmailService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        sms_service_1.SmsService,
        email_service_1.EmailService,
        audit_service_1.AuditService])
], UsersService);
//# sourceMappingURL=users.service.js.map