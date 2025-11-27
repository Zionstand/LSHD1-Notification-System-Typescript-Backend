import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FacilitiesService } from './facilities.service';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('facilities')
@UseGuards(JwtAuthGuard)
export class FacilitiesController {
  constructor(private facilitiesService: FacilitiesService) {}

  @Get()
  async findAll(@Query('includeInactive') includeInactive?: string) {
    return this.facilitiesService.findAll(includeInactive === 'true');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.facilitiesService.findOne(+id);
  }

  @Post()
  async create(@Body() createDto: CreateFacilityDto) {
    return this.facilitiesService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateFacilityDto) {
    return this.facilitiesService.update(+id, updateDto);
  }

  @Put(':id/activate')
  async activate(@Param('id') id: string) {
    return this.facilitiesService.activate(+id);
  }

  @Put(':id/deactivate')
  async deactivate(@Param('id') id: string) {
    return this.facilitiesService.deactivate(+id);
  }
}

// Separate controller for notification-types at root level
@Controller('notification-types')
@UseGuards(JwtAuthGuard)
export class NotificationTypesController {
  constructor(private facilitiesService: FacilitiesService) {}

  @Get()
  async getNotificationTypes() {
    return this.facilitiesService.getNotificationTypes();
  }
}
