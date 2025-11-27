import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PathwayScreeningsService } from './pathway-screenings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateHypertensionScreeningDto,
  UpdateHypertensionScreeningDto,
} from './dto/hypertension-screening.dto';
import {
  CreateDiabetesScreeningDto,
  UpdateDiabetesScreeningDto,
} from './dto/diabetes-screening.dto';
import {
  CreateCervicalScreeningDto,
  UpdateCervicalScreeningDto,
} from './dto/cervical-screening.dto';
import {
  CreateBreastScreeningDto,
  UpdateBreastScreeningDto,
} from './dto/breast-screening.dto';
import {
  CreatePsaScreeningDto,
  UpdatePsaScreeningDto,
} from './dto/psa-screening.dto';

@Controller('screenings')
@UseGuards(JwtAuthGuard)
export class PathwayScreeningsController {
  constructor(private pathwayService: PathwayScreeningsService) {}

  // ==================== HYPERTENSION ====================

  @Post(':id/hypertension')
  async createHypertensionScreening(
    @Param('id') id: string,
    @Body() dto: Omit<CreateHypertensionScreeningDto, 'screeningId'>,
    @Request() req: { user: { id: number } },
  ) {
    return this.pathwayService.createHypertensionScreening(
      { ...dto, screeningId: +id },
      req.user.id,
    );
  }

  @Get(':id/hypertension')
  async getHypertensionScreening(@Param('id') id: string) {
    return this.pathwayService.getHypertensionScreening(+id);
  }

  @Put(':id/hypertension')
  async updateHypertensionScreening(
    @Param('id') id: string,
    @Body() dto: UpdateHypertensionScreeningDto,
  ) {
    return this.pathwayService.updateHypertensionScreening(+id, dto);
  }

  // ==================== DIABETES ====================

  @Post(':id/diabetes')
  async createDiabetesScreening(
    @Param('id') id: string,
    @Body() dto: Omit<CreateDiabetesScreeningDto, 'screeningId'>,
    @Request() req: { user: { id: number } },
  ) {
    return this.pathwayService.createDiabetesScreening(
      { ...dto, screeningId: +id },
      req.user.id,
    );
  }

  @Get(':id/diabetes')
  async getDiabetesScreening(@Param('id') id: string) {
    return this.pathwayService.getDiabetesScreening(+id);
  }

  @Put(':id/diabetes')
  async updateDiabetesScreening(
    @Param('id') id: string,
    @Body() dto: UpdateDiabetesScreeningDto,
  ) {
    return this.pathwayService.updateDiabetesScreening(+id, dto);
  }

  // ==================== CERVICAL ====================

  @Post(':id/cervical')
  async createCervicalScreening(
    @Param('id') id: string,
    @Body() dto: Omit<CreateCervicalScreeningDto, 'screeningId'>,
    @Request() req: { user: { id: number } },
  ) {
    return this.pathwayService.createCervicalScreening(
      { ...dto, screeningId: +id },
      req.user.id,
    );
  }

  @Get(':id/cervical')
  async getCervicalScreening(@Param('id') id: string) {
    return this.pathwayService.getCervicalScreening(+id);
  }

  @Put(':id/cervical')
  async updateCervicalScreening(
    @Param('id') id: string,
    @Body() dto: UpdateCervicalScreeningDto,
  ) {
    return this.pathwayService.updateCervicalScreening(+id, dto);
  }

  // ==================== BREAST ====================

  @Post(':id/breast')
  async createBreastScreening(
    @Param('id') id: string,
    @Body() dto: Omit<CreateBreastScreeningDto, 'screeningId'>,
    @Request() req: { user: { id: number } },
  ) {
    return this.pathwayService.createBreastScreening(
      { ...dto, screeningId: +id },
      req.user.id,
    );
  }

  @Get(':id/breast')
  async getBreastScreening(@Param('id') id: string) {
    return this.pathwayService.getBreastScreening(+id);
  }

  @Put(':id/breast')
  async updateBreastScreening(
    @Param('id') id: string,
    @Body() dto: UpdateBreastScreeningDto,
  ) {
    return this.pathwayService.updateBreastScreening(+id, dto);
  }

  // ==================== PSA ====================

  @Post(':id/psa')
  async createPsaScreening(
    @Param('id') id: string,
    @Body() dto: Omit<CreatePsaScreeningDto, 'screeningId'>,
    @Request() req: { user: { id: number } },
  ) {
    return this.pathwayService.createPsaScreening(
      { ...dto, screeningId: +id },
      req.user.id,
    );
  }

  @Get(':id/psa')
  async getPsaScreening(@Param('id') id: string) {
    return this.pathwayService.getPsaScreening(+id);
  }

  @Put(':id/psa')
  async updatePsaScreening(
    @Param('id') id: string,
    @Body() dto: UpdatePsaScreeningDto,
  ) {
    return this.pathwayService.updatePsaScreening(+id, dto);
  }

  // ==================== GENERIC PATHWAY DATA ====================

  @Get(':id/pathway-data')
  async getPathwayData(@Param('id') id: string) {
    // First get the screening to determine the pathway
    const screening = await this.pathwayService.getPathwayData(+id, 'hypertension');
    if (screening) return { pathway: 'hypertension', data: screening };

    const diabetes = await this.pathwayService.getPathwayData(+id, 'diabetes');
    if (diabetes) return { pathway: 'diabetes', data: diabetes };

    const cervical = await this.pathwayService.getPathwayData(+id, 'cervical');
    if (cervical) return { pathway: 'cervical', data: cervical };

    const breast = await this.pathwayService.getPathwayData(+id, 'breast');
    if (breast) return { pathway: 'breast', data: breast };

    const psa = await this.pathwayService.getPathwayData(+id, 'psa');
    if (psa) return { pathway: 'psa', data: psa };

    return { pathway: null, data: null };
  }
}
