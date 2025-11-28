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
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/roles.constant';

// Public controller for registration - no auth required
@Controller('facilities/public')
export class PublicFacilitiesController {
  constructor(private facilitiesService: FacilitiesService) {}

  @Get()
  async findAllPublic() {
    // Only return active facilities for public access
    return this.facilitiesService.findAllPublic();
  }
}

@Controller('facilities')
@UseGuards(JwtAuthGuard, RolesGuard)
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
  @Roles(Role.ADMIN)
  async create(@Body() createDto: CreateFacilityDto) {
    return this.facilitiesService.create(createDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  async update(@Param('id') id: string, @Body() updateDto: UpdateFacilityDto) {
    return this.facilitiesService.update(+id, updateDto);
  }

  @Put(':id/activate')
  @Roles(Role.ADMIN)
  async activate(@Param('id') id: string) {
    return this.facilitiesService.activate(+id);
  }

  @Put(':id/deactivate')
  @Roles(Role.ADMIN)
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
