import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('stats')
  async getStats(@Request() req: any) {
    return this.dashboardService.getStats(req.user.facility_id);
  }

  @Get('extended-stats')
  async getExtendedStats(@Request() req: any) {
    return this.dashboardService.getExtendedStats(req.user.facility_id);
  }
}
