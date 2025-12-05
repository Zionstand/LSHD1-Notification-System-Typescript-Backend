import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { VitalsService } from './vitals.service';
import { CreateVitalRecordDto } from './dto/create-vital-record.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/roles.constant';

@Controller('vitals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VitalsController {
  constructor(private readonly vitalsService: VitalsService) {}

  /**
   * Record vital signs - Not allowed for HIM Officers (they can only view)
   */
  @Post()
  @Roles(Role.ADMIN, Role.NURSE, Role.DOCTOR, Role.CHO, Role.MLS)
  async create(@Body() createDto: CreateVitalRecordDto, @Request() req: any) {
    const record = await this.vitalsService.create(createDto, req.user.id);
    return {
      message: 'Vital signs recorded successfully',
      vitalRecord: this.vitalsService.formatVitalRecord(record),
    };
  }

  @Get('patient/:patientId')
  async findByPatient(@Param('patientId') patientId: string) {
    const records = await this.vitalsService.findByPatient(+patientId);
    return {
      count: records.length,
      records: records.map((r) => this.vitalsService.formatVitalRecord(r)),
    };
  }

  @Get('patient/:patientId/latest')
  async getLatestByPatient(@Param('patientId') patientId: string) {
    const record = await this.vitalsService.getLatestByPatient(+patientId);
    if (!record) {
      return { record: null };
    }
    return { record: this.vitalsService.formatVitalRecord(record) };
  }

  @Get('screening/:screeningId')
  async findByScreening(@Param('screeningId') screeningId: string) {
    const records = await this.vitalsService.findByScreening(+screeningId);
    return {
      count: records.length,
      records: records.map((r) => this.vitalsService.formatVitalRecord(r)),
    };
  }

  @Get('screening/:screeningId/latest')
  async getLatestByScreening(@Param('screeningId') screeningId: string) {
    const record = await this.vitalsService.getLatestByScreening(+screeningId);
    if (!record) {
      return { record: null };
    }
    return { record: this.vitalsService.formatVitalRecord(record) };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const record = await this.vitalsService.findOne(+id);
    return { record: this.vitalsService.formatVitalRecord(record) };
  }
}
