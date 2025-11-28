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
import { ScreeningsService } from '../screenings/screenings.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('clients')
@UseGuards(JwtAuthGuard)
export class PatientsController {
  constructor(
    private patientsService: PatientsService,
    private screeningsService: ScreeningsService,
  ) {}

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
    // Create the patient
    const result = await this.patientsService.create(
      createPatientDto,
      req.user.id,
    );

    // Create a screening session for the patient
    const screeningResult = await this.screeningsService.create(
      {
        clientId: result.client.id,
        notificationTypeId: result.screeningTypeId,
      },
      req.user.id,
      createPatientDto.phcCenterId,
    );

    return {
      message: 'Client registered and screening session created',
      client: result.client,
      screening: screeningResult.session,
    };
  }
}
