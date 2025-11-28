import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ScreeningsService } from './screenings.service';
import { CreateScreeningDto } from './dto/create-screening.dto';
import { UpdateVitalsDto } from './dto/update-vitals.dto';
import { CompleteScreeningDto } from './dto/complete-screening.dto';
import { DoctorAssessmentDto } from './dto/doctor-assessment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('screenings')
@UseGuards(JwtAuthGuard)
export class ScreeningsController {
  constructor(private screeningsService: ScreeningsService) {}

  @Get()
  async findAll(@Request() req: any, @Query('status') status?: string) {
    return this.screeningsService.findAll(req.user.facility_id, status);
  }

  @Get('patient/:patientId')
  async findByPatient(@Param('patientId') patientId: string) {
    return this.screeningsService.findByPatient(+patientId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.screeningsService.findOne(+id);
  }

  @Post()
  async create(@Body() createDto: CreateScreeningDto, @Request() req: any) {
    return this.screeningsService.create(
      createDto,
      req.user.id,
      req.user.facility_id || 1,
    );
  }

  @Put(':id/vitals')
  async updateVitals(
    @Param('id') id: string,
    @Body() updateDto: UpdateVitalsDto,
  ) {
    return this.screeningsService.updateVitals(+id, updateDto);
  }

  @Put(':id/complete')
  async complete(
    @Param('id') id: string,
    @Body() completeDto: CompleteScreeningDto,
  ) {
    return this.screeningsService.complete(+id, completeDto);
  }

  @Get('doctor/pending')
  async findPendingDoctorReview(@Request() req: any) {
    return this.screeningsService.findPendingDoctorReview(req.user.facility_id);
  }

  @Put(':id/doctor-assessment')
  async addDoctorAssessment(
    @Param('id') id: string,
    @Body() dto: DoctorAssessmentDto,
    @Request() req: any,
  ) {
    return this.screeningsService.addDoctorAssessment(+id, dto, req.user.id);
  }
}
