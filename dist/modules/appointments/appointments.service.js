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
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const appointment_entity_1 = require("./entities/appointment.entity");
let AppointmentsService = class AppointmentsService {
    constructor(appointmentsRepository) {
        this.appointmentsRepository = appointmentsRepository;
    }
    async findAll(facilityId, status, date) {
        const queryBuilder = this.appointmentsRepository
            .createQueryBuilder('a')
            .leftJoinAndSelect('a.patient', 'p')
            .leftJoinAndSelect('a.phcCenter', 'c')
            .leftJoinAndSelect('a.createdByUser', 'u')
            .orderBy('a.appointmentDate', 'ASC')
            .addOrderBy('a.appointmentTime', 'ASC')
            .take(100);
        if (facilityId) {
            queryBuilder.andWhere('a.phcCenterId = :facilityId', { facilityId });
        }
        if (status && status !== 'all') {
            queryBuilder.andWhere('a.status = :status', { status });
        }
        if (date) {
            queryBuilder.andWhere('a.appointmentDate = :date', { date });
        }
        const appointments = await queryBuilder.getMany();
        return appointments.map((a) => ({
            id: a.id,
            appointmentId: `APT-${String(a.id).padStart(5, '0')}`,
            appointmentDate: a.appointmentDate,
            appointmentTime: a.appointmentTime,
            appointmentType: a.appointmentType,
            reason: a.reason,
            status: a.status,
            reminderSent: a.reminderSent === 1,
            createdAt: a.createdAt,
            client: {
                id: a.patientId,
                clientId: `PAT-${String(a.patientId).padStart(5, '0')}`,
                firstName: a.patient?.firstName,
                lastName: a.patient?.lastName,
                phone: a.patient?.phone,
            },
            facility: {
                id: a.phcCenterId,
                name: a.phcCenter?.centerName,
            },
            createdBy: a.createdByUser?.fullName || null,
        }));
    }
    async findOne(id) {
        const appointment = await this.appointmentsRepository.findOne({
            where: { id },
            relations: ['patient', 'phcCenter', 'createdByUser'],
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        return {
            id: appointment.id,
            appointmentId: `APT-${String(appointment.id).padStart(5, '0')}`,
            appointmentDate: appointment.appointmentDate,
            appointmentTime: appointment.appointmentTime,
            appointmentType: appointment.appointmentType,
            reason: appointment.reason,
            status: appointment.status,
            reminderSent: appointment.reminderSent === 1,
            createdAt: appointment.createdAt,
            client: {
                id: appointment.patientId,
                clientId: `PAT-${String(appointment.patientId).padStart(5, '0')}`,
                firstName: appointment.patient?.firstName,
                lastName: appointment.patient?.lastName,
                phone: appointment.patient?.phone,
            },
            facility: {
                id: appointment.phcCenterId,
                name: appointment.phcCenter?.centerName,
            },
            createdBy: appointment.createdByUser?.fullName || null,
        };
    }
    async findByPatient(patientId) {
        const appointments = await this.appointmentsRepository.find({
            where: { patientId },
            relations: ['phcCenter'],
            order: { appointmentDate: 'DESC', appointmentTime: 'DESC' },
        });
        return appointments.map((a) => ({
            id: a.id,
            appointmentId: `APT-${String(a.id).padStart(5, '0')}`,
            appointmentDate: a.appointmentDate,
            appointmentTime: a.appointmentTime,
            appointmentType: a.appointmentType,
            reason: a.reason,
            status: a.status,
            facility: a.phcCenter?.centerName,
        }));
    }
    async findUpcoming(facilityId, days = 7) {
        const today = new Date();
        const endDate = new Date();
        endDate.setDate(today.getDate() + days);
        const queryBuilder = this.appointmentsRepository
            .createQueryBuilder('a')
            .leftJoinAndSelect('a.patient', 'p')
            .leftJoinAndSelect('a.phcCenter', 'c')
            .where('a.appointmentDate >= :today', { today: today.toISOString().split('T')[0] })
            .andWhere('a.appointmentDate <= :endDate', { endDate: endDate.toISOString().split('T')[0] })
            .andWhere('a.status = :status', { status: 'scheduled' })
            .orderBy('a.appointmentDate', 'ASC')
            .addOrderBy('a.appointmentTime', 'ASC');
        if (facilityId) {
            queryBuilder.andWhere('a.phcCenterId = :facilityId', { facilityId });
        }
        const appointments = await queryBuilder.getMany();
        return appointments.map((a) => ({
            id: a.id,
            appointmentId: `APT-${String(a.id).padStart(5, '0')}`,
            appointmentDate: a.appointmentDate,
            appointmentTime: a.appointmentTime,
            appointmentType: a.appointmentType,
            client: {
                id: a.patientId,
                firstName: a.patient?.firstName,
                lastName: a.patient?.lastName,
                phone: a.patient?.phone,
            },
            facility: a.phcCenter?.centerName,
        }));
    }
    async create(createDto, userId, facilityId) {
        const appointment = this.appointmentsRepository.create({
            patientId: createDto.clientId,
            phcCenterId: facilityId || 1,
            appointmentDate: new Date(createDto.appointmentDate),
            appointmentTime: createDto.appointmentTime,
            appointmentType: createDto.appointmentType,
            reason: createDto.reason || null,
            status: 'scheduled',
            createdBy: userId,
        });
        const saved = await this.appointmentsRepository.save(appointment);
        return {
            message: 'Appointment scheduled',
            appointment: {
                id: saved.id,
                appointmentId: `APT-${String(saved.id).padStart(5, '0')}`,
                appointmentDate: saved.appointmentDate,
                appointmentTime: saved.appointmentTime,
                status: saved.status,
            },
        };
    }
    async update(id, updateDto) {
        const appointment = await this.appointmentsRepository.findOne({ where: { id } });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        if (updateDto.appointmentDate) {
            appointment.appointmentDate = new Date(updateDto.appointmentDate);
        }
        if (updateDto.appointmentTime) {
            appointment.appointmentTime = updateDto.appointmentTime;
        }
        if (updateDto.appointmentType) {
            appointment.appointmentType = updateDto.appointmentType;
        }
        if (updateDto.reason !== undefined) {
            appointment.reason = updateDto.reason;
        }
        if (updateDto.status) {
            appointment.status = updateDto.status;
        }
        await this.appointmentsRepository.save(appointment);
        return { message: 'Appointment updated' };
    }
    async cancel(id) {
        const appointment = await this.appointmentsRepository.findOne({ where: { id } });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        appointment.status = 'cancelled';
        await this.appointmentsRepository.save(appointment);
        return { message: 'Appointment cancelled' };
    }
    async complete(id) {
        const appointment = await this.appointmentsRepository.findOne({ where: { id } });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        appointment.status = 'completed';
        await this.appointmentsRepository.save(appointment);
        return { message: 'Appointment marked as completed' };
    }
    async markNoShow(id) {
        const appointment = await this.appointmentsRepository.findOne({ where: { id } });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        appointment.status = 'no_show';
        await this.appointmentsRepository.save(appointment);
        return { message: 'Appointment marked as no-show' };
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(appointment_entity_1.Appointment)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map