import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  Res,
  Header,
} from '@nestjs/common';
import { Response } from 'express';
import { ReportsService, ReportFilters } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/roles.constant';
import { AuditService } from '../audit/audit.service';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(
    private reportsService: ReportsService,
    private auditService: AuditService,
  ) {}

  @Get('summary')
  @Roles(Role.ADMIN, Role.HIM_OFFICER, Role.DOCTOR)
  async getSummary(
    @Request() req: any,
    @Query('facilityId') facilityId?: string,
    @Query('screeningType') screeningType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: string,
  ) {
    const filters: ReportFilters = this.buildFilters(
      req,
      facilityId,
      screeningType,
      startDate,
      endDate,
      status,
    );

    return this.reportsService.getScreeningSummary(filters);
  }

  @Get('details')
  @Roles(Role.ADMIN, Role.HIM_OFFICER, Role.DOCTOR)
  async getDetails(
    @Request() req: any,
    @Query('facilityId') facilityId?: string,
    @Query('screeningType') screeningType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: string,
  ) {
    const filters: ReportFilters = this.buildFilters(
      req,
      facilityId,
      screeningType,
      startDate,
      endDate,
      status,
    );

    return this.reportsService.getScreeningDetails(filters);
  }

  @Get('facility-comparison')
  @Roles(Role.ADMIN)
  async getFacilityComparison(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getFacilityComparison(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('abnormal-results')
  @Roles(Role.ADMIN, Role.DOCTOR)
  async getAbnormalResults(
    @Request() req: any,
    @Query('facilityId') facilityId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters: ReportFilters = {};

    // Non-admin users can only see their facility's data
    if (req.user.role !== 'admin' && req.user.facility_id) {
      filters.facilityId = req.user.facility_id;
    } else if (facilityId) {
      filters.facilityId = parseInt(facilityId);
    }

    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);

    return this.reportsService.getAbnormalResults(filters);
  }

  @Get('trends')
  @Roles(Role.ADMIN, Role.HIM_OFFICER, Role.DOCTOR)
  async getTrends(
    @Request() req: any,
    @Query('facilityId') facilityId?: string,
    @Query('period') period?: 'daily' | 'weekly' | 'monthly',
    @Query('days') days?: string,
  ) {
    let facility: number | undefined;

    if (req.user.role !== 'admin' && req.user.facility_id) {
      facility = req.user.facility_id;
    } else if (facilityId) {
      facility = parseInt(facilityId);
    }

    return this.reportsService.getTrendData(
      facility,
      period || 'daily',
      days ? parseInt(days) : 30,
    );
  }

  @Get('export/csv')
  @Roles(Role.ADMIN, Role.HIM_OFFICER)
  @Header('Content-Type', 'text/csv')
  async exportCSV(
    @Request() req: any,
    @Res() res: Response,
    @Query('facilityId') facilityId?: string,
    @Query('screeningType') screeningType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: string,
  ) {
    const filters: ReportFilters = this.buildFilters(
      req,
      facilityId,
      screeningType,
      startDate,
      endDate,
      status,
    );

    const csvData = await this.reportsService.exportToCSV(filters);

    // Log the export action
    await this.auditService.log({
      userId: req.user.id,
      action: 'EXPORT',
      resource: 'REPORT',
      details: { format: 'CSV', filters },
      facilityId: req.user.facility_id,
    });

    const filename = `screening-report-${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvData);
  }

  private buildFilters(
    req: any,
    facilityId?: string,
    screeningType?: string,
    startDate?: string,
    endDate?: string,
    status?: string,
  ): ReportFilters {
    const filters: ReportFilters = {};

    // Non-admin users can only see their facility's data
    if (req.user.role !== 'admin' && req.user.facility_id) {
      filters.facilityId = req.user.facility_id;
    } else if (facilityId) {
      filters.facilityId = parseInt(facilityId);
    }

    if (screeningType) filters.screeningType = screeningType;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);
    if (status) filters.status = status;

    return filters;
  }
}
