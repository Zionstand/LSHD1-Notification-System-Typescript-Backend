import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('clients')
@UseGuards(JwtAuthGuard)
export class PatientsController {
  constructor(private patientsService: PatientsService) {}

  @Get()
  async findAll(@Request() req: any) {
    return this.patientsService.findAll(req.user.facility_id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.patientsService.findOne(+id);
  }

  @Post()
  async create(@Body() createPatientDto: CreatePatientDto, @Request() req: any) {
    return this.patientsService.create(
      createPatientDto,
      req.user.id,
      req.user.facility_id || 1,
    );
  }
}
