import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuditService, AuditLogFilters } from './audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/roles.constant';
import { AuditAction, AuditResource } from './entities/audit-log.entity';

@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditController {
  constructor(private auditService: AuditService) {}

  @Get()
  @Roles(Role.ADMIN)
  async findAll(
    @Request() req: any,
    @Query('userId') userId?: string,
    @Query('action') action?: AuditAction,
    @Query('resource') resource?: AuditResource,
    @Query('resourceId') resourceId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const filters: AuditLogFilters = {};

    if (userId) filters.userId = parseInt(userId);
    if (action) filters.action = action;
    if (resource) filters.resource = resource;
    if (resourceId) filters.resourceId = parseInt(resourceId);
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);
    if (limit) filters.limit = parseInt(limit);
    if (offset) filters.offset = parseInt(offset);

    // Non-admin users can only see their facility's logs
    if (req.user.role !== 'admin' && req.user.facility_id) {
      filters.facilityId = req.user.facility_id;
    }

    return this.auditService.findAll(filters);
  }

  @Get('stats')
  @Roles(Role.ADMIN)
  async getStats(@Request() req: any) {
    const facilityId = req.user.role !== 'admin' ? req.user.facility_id : undefined;
    return this.auditService.getStats(facilityId);
  }

  @Get('user/:userId')
  @Roles(Role.ADMIN)
  async findByUser(
    @Query('userId') userId: string,
    @Query('limit') limit?: string,
  ) {
    return this.auditService.findByUser(
      parseInt(userId),
      limit ? parseInt(limit) : 50,
    );
  }
}
