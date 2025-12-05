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
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/roles.constant';
import { VolunteersService } from './volunteers.service';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';

@Controller('volunteers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VolunteersController {
  constructor(private readonly volunteersService: VolunteersService) {}

  /**
   * Register a new volunteer - CHO and Admin only
   */
  @Post()
  @Roles(Role.CHO, Role.ADMIN)
  async create(@Body() createVolunteerDto: CreateVolunteerDto, @Request() req: any) {
    const volunteer = await this.volunteersService.create(
      createVolunteerDto,
      req.user.id,
      req.user.facility_id,
    );

    return {
      message: 'Volunteer registered successfully',
      volunteer: this.formatVolunteer(volunteer),
    };
  }

  /**
   * Get all volunteers - CHO and Admin can access
   */
  @Get()
  @Roles(Role.CHO, Role.ADMIN)
  async findAll(
    @Request() req: any,
    @Query('status') status?: string,
    @Query('gender') gender?: string,
    @Query('trained') trained?: string,
    @Query('search') search?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    // CHO can only see volunteers from their facility, Admin can see all
    const phcCenterId = req.user.role === 'admin' ? undefined : req.user.facility_id;

    const { volunteers, total } = await this.volunteersService.findAll({
      phcCenterId,
      status,
      gender,
      trainingCompleted: trained ? trained === 'true' : undefined,
      search,
      limit: limit ? parseInt(limit) : 50,
      offset: offset ? parseInt(offset) : 0,
    });

    return {
      total,
      volunteers: volunteers.map(v => this.formatVolunteer(v)),
    };
  }

  /**
   * Get volunteer statistics - CHO and Admin
   */
  @Get('stats')
  @Roles(Role.CHO, Role.ADMIN)
  async getStats(@Request() req: any) {
    const phcCenterId = req.user.role === 'admin' ? undefined : req.user.facility_id;
    return this.volunteersService.getStats(phcCenterId);
  }

  /**
   * Get a single volunteer by ID
   */
  @Get(':id')
  @Roles(Role.CHO, Role.ADMIN)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const volunteer = await this.volunteersService.findOne(id);
    return this.formatVolunteer(volunteer);
  }

  /**
   * Update a volunteer - CHO and Admin
   */
  @Put(':id')
  @Roles(Role.CHO, Role.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVolunteerDto: UpdateVolunteerDto,
  ) {
    const volunteer = await this.volunteersService.update(id, updateVolunteerDto);
    return {
      message: 'Volunteer updated successfully',
      volunteer: this.formatVolunteer(volunteer),
    };
  }

  /**
   * Activate a volunteer
   */
  @Put(':id/activate')
  @Roles(Role.CHO, Role.ADMIN)
  async activate(@Param('id', ParseIntPipe) id: number) {
    const volunteer = await this.volunteersService.activate(id);
    return {
      message: 'Volunteer activated',
      volunteer: this.formatVolunteer(volunteer),
    };
  }

  /**
   * Deactivate a volunteer
   */
  @Put(':id/deactivate')
  @Roles(Role.CHO, Role.ADMIN)
  async deactivate(@Param('id', ParseIntPipe) id: number) {
    const volunteer = await this.volunteersService.deactivate(id);
    return {
      message: 'Volunteer deactivated',
      volunteer: this.formatVolunteer(volunteer),
    };
  }

  /**
   * Mark training as completed
   */
  @Put(':id/training-completed')
  @Roles(Role.CHO, Role.ADMIN)
  async markTrainingCompleted(
    @Param('id', ParseIntPipe) id: number,
    @Body('trainingDate') trainingDate?: string,
  ) {
    const volunteer = await this.volunteersService.markTrainingCompleted(id, trainingDate);
    return {
      message: 'Training marked as completed',
      volunteer: this.formatVolunteer(volunteer),
    };
  }

  /**
   * Format volunteer for API response
   */
  private formatVolunteer(volunteer: any) {
    return {
      id: volunteer.id,
      volunteerCode: volunteer.volunteerCode,
      fullName: volunteer.fullName,
      firstName: volunteer.firstName,
      lastName: volunteer.lastName,
      phone: volunteer.phone,
      altPhone: volunteer.altPhone,
      email: volunteer.email,
      gender: volunteer.gender,
      age: volunteer.age,
      dateOfBirth: volunteer.dateOfBirth,
      address: volunteer.address,
      lga: volunteer.lga,
      ward: volunteer.ward,
      community: volunteer.community,
      occupation: volunteer.occupation,
      educationLevel: volunteer.educationLevel,
      nextOfKin: volunteer.nextOfKin,
      nextOfKinPhone: volunteer.nextOfKinPhone,
      skills: volunteer.skills,
      notes: volunteer.notes,
      status: volunteer.status,
      trainingCompleted: volunteer.trainingCompleted === 1,
      trainingDate: volunteer.trainingDate,
      facility: volunteer.phcCenter ? {
        id: volunteer.phcCenter.id,
        name: volunteer.phcCenter.centerName,
      } : null,
      registeredBy: volunteer.registeredByUser ? {
        id: volunteer.registeredByUser.id,
        name: volunteer.registeredByUser.fullName,
      } : null,
      createdAt: volunteer.createdAt,
      updatedAt: volunteer.updatedAt,
    };
  }
}
