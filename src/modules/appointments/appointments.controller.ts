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
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Get()
  async findAll(
    @Request() req: any,
    @Query('status') status?: string,
    @Query('date') date?: string,
  ) {
    return this.appointmentsService.findAll(req.user.facility_id, status, date);
  }

  @Get('upcoming')
  async findUpcoming(@Request() req: any, @Query('days') days?: string) {
    return this.appointmentsService.findUpcoming(
      req.user.facility_id,
      days ? parseInt(days) : 7,
    );
  }

  @Get('patient/:patientId')
  async findByPatient(@Param('patientId') patientId: string) {
    return this.appointmentsService.findByPatient(+patientId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(+id);
  }

  @Post()
  async create(@Body() createDto: CreateAppointmentDto, @Request() req: any) {
    return this.appointmentsService.create(
      createDto,
      req.user.id,
      req.user.facility_id || 1,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(+id, updateDto);
  }

  @Put(':id/cancel')
  async cancel(@Param('id') id: string) {
    return this.appointmentsService.cancel(+id);
  }

  @Put(':id/complete')
  async complete(@Param('id') id: string) {
    return this.appointmentsService.complete(+id);
  }

  @Put(':id/no-show')
  async markNoShow(@Param('id') id: string) {
    return this.appointmentsService.markNoShow(+id);
  }
}
