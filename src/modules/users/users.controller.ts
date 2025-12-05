import {
  Controller,
  Get,
  Put,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/roles.constant';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  async findAll(@Query('status') status?: string) {
    return this.usersService.findAll(status);
  }

  @Get('pending')
  @Roles(Role.ADMIN)
  async findPending() {
    return this.usersService.findPendingUsers();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put(':id/approve')
  @Roles(Role.ADMIN)
  async approveUser(@Param('id') id: string, @Request() req: any) {
    return this.usersService.approveUser(+id, req.user.id);
  }

  @Put(':id/reject')
  @Roles(Role.ADMIN)
  async rejectUser(@Param('id') id: string, @Request() req: any) {
    return this.usersService.rejectUser(+id, req.user.id);
  }

  @Put(':id/suspend')
  @Roles(Role.ADMIN)
  async suspendUser(@Param('id') id: string, @Request() req: any) {
    return this.usersService.suspendUser(+id, req.user.id);
  }

  @Put(':id/reactivate')
  @Roles(Role.ADMIN)
  async reactivateUser(@Param('id') id: string, @Request() req: any) {
    return this.usersService.reactivateUser(+id, req.user.id);
  }
}
