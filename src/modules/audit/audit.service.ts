import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { AuditLog, AuditAction, AuditResource } from './entities/audit-log.entity';

export interface AuditLogParams {
  userId?: number | null;
  action: AuditAction;
  resource: AuditResource;
  resourceId?: number | null;
  details?: string | object | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  facilityId?: number | null;
}

export interface AuditLogFilters {
  userId?: number;
  action?: AuditAction;
  resource?: AuditResource;
  resourceId?: number;
  facilityId?: number;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async log(params: AuditLogParams): Promise<AuditLog> {
    const auditLog = this.auditLogRepository.create({
      userId: params.userId ?? null,
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId ?? null,
      details:
        typeof params.details === 'object'
          ? JSON.stringify(params.details)
          : params.details ?? null,
      ipAddress: params.ipAddress ?? null,
      userAgent: params.userAgent ?? null,
      facilityId: params.facilityId ?? null,
    });

    return this.auditLogRepository.save(auditLog);
  }

  async findAll(filters: AuditLogFilters = {}): Promise<{ data: AuditLog[]; total: number }> {
    const {
      userId,
      action,
      resource,
      resourceId,
      facilityId,
      startDate,
      endDate,
      limit = 50,
      offset = 0,
    } = filters;

    const where: any = {};

    if (userId) where.userId = userId;
    if (action) where.action = action;
    if (resource) where.resource = resource;
    if (resourceId) where.resourceId = resourceId;
    if (facilityId) where.facilityId = facilityId;

    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate);
    } else if (startDate) {
      where.createdAt = MoreThanOrEqual(startDate);
    } else if (endDate) {
      where.createdAt = LessThanOrEqual(endDate);
    }

    const [data, total] = await this.auditLogRepository.findAndCount({
      where,
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });

    return { data, total };
  }

  async findByUser(userId: number, limit = 50): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findByResource(resource: AuditResource, resourceId: number, limit = 50): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { resource, resourceId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  // Get summary statistics
  async getStats(facilityId?: number): Promise<{
    totalLogs: number;
    logsByAction: Record<string, number>;
    logsByResource: Record<string, number>;
    recentLogins: number;
    failedLogins: number;
  }> {
    const baseWhere = facilityId ? { facilityId } : {};

    const totalLogs = await this.auditLogRepository.count({ where: baseWhere });

    // Get logs by action
    const actionStats = await this.auditLogRepository
      .createQueryBuilder('log')
      .select('log.action', 'action')
      .addSelect('COUNT(*)', 'count')
      .where(facilityId ? 'log.facilityId = :facilityId' : '1=1', { facilityId })
      .groupBy('log.action')
      .getRawMany();

    const logsByAction: Record<string, number> = {};
    actionStats.forEach((stat) => {
      logsByAction[stat.action] = parseInt(stat.count);
    });

    // Get logs by resource
    const resourceStats = await this.auditLogRepository
      .createQueryBuilder('log')
      .select('log.resource', 'resource')
      .addSelect('COUNT(*)', 'count')
      .where(facilityId ? 'log.facilityId = :facilityId' : '1=1', { facilityId })
      .groupBy('log.resource')
      .getRawMany();

    const logsByResource: Record<string, number> = {};
    resourceStats.forEach((stat) => {
      logsByResource[stat.resource] = parseInt(stat.count);
    });

    // Get recent logins (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentLogins = await this.auditLogRepository.count({
      where: {
        action: 'LOGIN',
        createdAt: MoreThanOrEqual(oneDayAgo),
        ...(facilityId ? { facilityId } : {}),
      },
    });

    // Get failed logins (last 24 hours)
    const failedLogins = await this.auditLogRepository.count({
      where: {
        action: 'LOGIN_FAILED',
        createdAt: MoreThanOrEqual(oneDayAgo),
        ...(facilityId ? { facilityId } : {}),
      },
    });

    return {
      totalLogs,
      logsByAction,
      logsByResource,
      recentLogins,
      failedLogins,
    };
  }
}
