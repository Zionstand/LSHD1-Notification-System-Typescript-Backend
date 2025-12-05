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
import { DividersService } from './dividers.service';
import { CreateDividerDto } from './dto/create-divider.dto';
import { UpdateDividerDto } from './dto/update-divider.dto';

@Controller('dividers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DividersController {
  constructor(private readonly dividersService: DividersService) {}

  /**
   * Create a new divider - CHO and Admin only
   */
  @Post()
  @Roles(Role.CHO, Role.ADMIN)
  async create(@Body() createDividerDto: CreateDividerDto, @Request() req: any) {
    const divider = await this.dividersService.create(
      createDividerDto,
      req.user.id,
      req.user.facility_id,
    );

    return {
      message: 'Divider captured successfully',
      divider: this.formatDivider(divider),
    };
  }

  /**
   * Get all dividers - CHO and Admin can access
   */
  @Get()
  @Roles(Role.CHO, Role.ADMIN)
  async findAll(
    @Request() req: any,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    // CHO can only see dividers from their facility, Admin can see all
    const phcCenterId = req.user.role === 'admin' ? undefined : req.user.facility_id;

    const { dividers, total } = await this.dividersService.findAll({
      phcCenterId,
      status,
      search,
      limit: limit ? parseInt(limit) : 50,
      offset: offset ? parseInt(offset) : 0,
    });

    return {
      total,
      dividers: dividers.map(d => this.formatDivider(d)),
    };
  }

  /**
   * Get divider statistics - CHO and Admin
   */
  @Get('stats')
  @Roles(Role.CHO, Role.ADMIN)
  async getStats(@Request() req: any) {
    const phcCenterId = req.user.role === 'admin' ? undefined : req.user.facility_id;
    return this.dividersService.getStats(phcCenterId);
  }

  /**
   * Get a single divider by ID
   */
  @Get(':id')
  @Roles(Role.CHO, Role.ADMIN)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const divider = await this.dividersService.findOne(id);
    return this.formatDivider(divider);
  }

  /**
   * Update a divider - CHO and Admin
   */
  @Put(':id')
  @Roles(Role.CHO, Role.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDividerDto: UpdateDividerDto,
  ) {
    const divider = await this.dividersService.update(id, updateDividerDto);
    return {
      message: 'Divider updated successfully',
      divider: this.formatDivider(divider),
    };
  }

  /**
   * Deactivate a divider
   */
  @Put(':id/deactivate')
  @Roles(Role.CHO, Role.ADMIN)
  async deactivate(@Param('id', ParseIntPipe) id: number) {
    const divider = await this.dividersService.deactivate(id);
    return {
      message: 'Divider deactivated',
      divider: this.formatDivider(divider),
    };
  }

  /**
   * Activate a divider
   */
  @Put(':id/activate')
  @Roles(Role.CHO, Role.ADMIN)
  async activate(@Param('id', ParseIntPipe) id: number) {
    const divider = await this.dividersService.activate(id);
    return {
      message: 'Divider activated',
      divider: this.formatDivider(divider),
    };
  }

  /**
   * Format divider for API response
   */
  private formatDivider(divider: any) {
    return {
      id: divider.id,
      dividerCode: divider.dividerCode,
      fullName: divider.fullName,
      phone: divider.phone,
      address: divider.address,
      lga: divider.lga,
      ward: divider.ward,
      community: divider.community,
      notes: divider.notes,
      status: divider.status,
      facility: divider.phcCenter ? {
        id: divider.phcCenter.id,
        name: divider.phcCenter.centerName,
      } : null,
      capturedBy: divider.capturedByUser ? {
        id: divider.capturedByUser.id,
        name: divider.capturedByUser.fullName,
      } : null,
      createdAt: divider.createdAt,
      updatedAt: divider.updatedAt,
    };
  }
}
