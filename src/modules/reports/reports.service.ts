import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Screening } from '../screenings/entities/screening.entity';
import { Patient } from '../patients/entities/patient.entity';
import { HypertensionScreening } from '../screenings/entities/hypertension-screening.entity';
import { DiabetesScreening } from '../screenings/entities/diabetes-screening.entity';
import { CervicalScreening } from '../screenings/entities/cervical-screening.entity';
import { BreastScreening } from '../screenings/entities/breast-screening.entity';
import { PsaScreening } from '../screenings/entities/psa-screening.entity';

export interface ReportFilters {
  facilityId?: number;
  screeningType?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string;
}

export interface ScreeningSummary {
  totalScreenings: number;
  completedScreenings: number;
  pendingScreenings: number;
  inProgressScreenings: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  referralRate: number;
  completionRate: number;
}

export interface FacilityComparison {
  facilityId: number;
  facilityName: string;
  totalScreenings: number;
  completedScreenings: number;
  completionRate: number;
}

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Screening)
    private screeningsRepository: Repository<Screening>,
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
    @InjectRepository(HypertensionScreening)
    private hypertensionRepository: Repository<HypertensionScreening>,
    @InjectRepository(DiabetesScreening)
    private diabetesRepository: Repository<DiabetesScreening>,
    @InjectRepository(CervicalScreening)
    private cervicalRepository: Repository<CervicalScreening>,
    @InjectRepository(BreastScreening)
    private breastRepository: Repository<BreastScreening>,
    @InjectRepository(PsaScreening)
    private psaRepository: Repository<PsaScreening>,
  ) {}

  async getScreeningSummary(filters: ReportFilters = {}): Promise<ScreeningSummary> {
    const { facilityId, screeningType, startDate, endDate, status } = filters;

    const query = this.screeningsRepository
      .createQueryBuilder('s')
      .leftJoin('s.patient', 'p');

    if (facilityId) {
      query.andWhere('p.phcCenterId = :facilityId', { facilityId });
    }

    if (screeningType) {
      query.andWhere('s.screeningType = :screeningType', { screeningType });
    }

    if (startDate && endDate) {
      query.andWhere('s.screeningDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    } else if (startDate) {
      query.andWhere('s.screeningDate >= :startDate', { startDate });
    } else if (endDate) {
      query.andWhere('s.screeningDate <= :endDate', { endDate });
    }

    if (status) {
      query.andWhere('s.status = :status', { status });
    }

    const screenings = await query.getMany();

    const totalScreenings = screenings.length;
    const completedScreenings = screenings.filter(s => s.status === 'completed').length;
    const pendingScreenings = screenings.filter(s => s.status === 'pending').length;
    const inProgressScreenings = screenings.filter(s => s.status === 'in_progress').length;

    // Count by type
    const byType: Record<string, number> = {};
    screenings.forEach(s => {
      byType[s.screeningType] = (byType[s.screeningType] || 0) + 1;
    });

    // Count by status
    const byStatus: Record<string, number> = {};
    screenings.forEach(s => {
      byStatus[s.status] = (byStatus[s.status] || 0) + 1;
    });

    // Calculate referral rate
    const referrals = screenings.filter(s => s.referralFacility).length;
    const referralRate = totalScreenings > 0 ? (referrals / totalScreenings) * 100 : 0;

    // Calculate completion rate
    const completionRate = totalScreenings > 0 ? (completedScreenings / totalScreenings) * 100 : 0;

    return {
      totalScreenings,
      completedScreenings,
      pendingScreenings,
      inProgressScreenings,
      byType,
      byStatus,
      referralRate: Math.round(referralRate * 100) / 100,
      completionRate: Math.round(completionRate * 100) / 100,
    };
  }

  async getScreeningDetails(filters: ReportFilters = {}): Promise<any[]> {
    const { facilityId, screeningType, startDate, endDate, status } = filters;

    const query = this.screeningsRepository
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.patient', 'p')
      .leftJoinAndSelect('s.conductedByUser', 'u')
      .leftJoinAndSelect('p.phcCenter', 'f');

    if (facilityId) {
      query.andWhere('p.phcCenterId = :facilityId', { facilityId });
    }

    if (screeningType) {
      query.andWhere('s.screeningType = :screeningType', { screeningType });
    }

    if (startDate && endDate) {
      query.andWhere('s.screeningDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    } else if (startDate) {
      query.andWhere('s.screeningDate >= :startDate', { startDate });
    } else if (endDate) {
      query.andWhere('s.screeningDate <= :endDate', { endDate });
    }

    if (status) {
      query.andWhere('s.status = :status', { status });
    }

    query.orderBy('s.screeningDate', 'DESC');

    const screenings = await query.getMany();

    return screenings.map(s => ({
      id: s.id,
      date: s.screeningDate,
      time: s.screeningTime,
      patientName: `${s.patient?.firstName || ''} ${s.patient?.lastName || ''}`.trim(),
      patientId: s.patientId,
      screeningType: s.screeningType,
      status: s.status,
      conductedBy: s.conductedByUser?.fullName || 'N/A',
      facility: s.patient?.phcCenter?.centerName || 'N/A',
      vitals: {
        bp: s.bloodPressureSystolic && s.bloodPressureDiastolic
          ? `${s.bloodPressureSystolic}/${s.bloodPressureDiastolic}`
          : null,
        temperature: s.temperature,
        pulseRate: s.pulseRate,
        weight: s.weight,
      },
      result: s.patientStatus || s.diagnosis,
      referral: s.referralFacility,
    }));
  }

  async getFacilityComparison(startDate?: Date, endDate?: Date): Promise<FacilityComparison[]> {
    const query = this.screeningsRepository
      .createQueryBuilder('s')
      .leftJoin('s.patient', 'p')
      .leftJoin('p.phcCenter', 'f')
      .select('p.phcCenterId', 'facilityId')
      .addSelect('f.centerName', 'facilityName')
      .addSelect('COUNT(*)', 'totalScreenings')
      .addSelect('SUM(CASE WHEN s.status = "completed" THEN 1 ELSE 0 END)', 'completedScreenings')
      .groupBy('p.phcCenterId')
      .addGroupBy('f.centerName');

    if (startDate && endDate) {
      query.andWhere('s.screeningDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const results = await query.getRawMany();

    return results.map(r => ({
      facilityId: r.facilityId,
      facilityName: r.facilityName || 'Unknown Facility',
      totalScreenings: parseInt(r.totalScreenings),
      completedScreenings: parseInt(r.completedScreenings),
      completionRate: r.totalScreenings > 0
        ? Math.round((parseInt(r.completedScreenings) / parseInt(r.totalScreenings)) * 100 * 100) / 100
        : 0,
    }));
  }

  async getAbnormalResults(filters: ReportFilters = {}): Promise<any[]> {
    const { facilityId, startDate, endDate } = filters;

    const abnormalResults: any[] = [];

    // Get hypertension abnormals
    const htQuery = this.hypertensionRepository
      .createQueryBuilder('ht')
      .leftJoinAndSelect('ht.screening', 's')
      .leftJoinAndSelect('s.patient', 'p')
      .where('ht.screeningResult IN (:...results)', {
        results: ['high_stage1', 'high_stage2', 'crisis'],
      });

    if (facilityId) {
      htQuery.andWhere('p.phcCenterId = :facilityId', { facilityId });
    }

    if (startDate && endDate) {
      htQuery.andWhere('s.screeningDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const htResults = await htQuery.getMany();
    htResults.forEach(ht => {
      abnormalResults.push({
        type: 'Hypertension',
        patientName: `${ht.screening?.patient?.firstName || ''} ${ht.screening?.patient?.lastName || ''}`.trim(),
        date: ht.screening?.screeningDate,
        result: ht.screeningResult,
        details: `BP: ${ht.systolicBp1}/${ht.diastolicBp1}`,
        referral: ht.referToDoctor,
      });
    });

    // Get diabetes abnormals (high blood sugar)
    const dbQuery = this.diabetesRepository
      .createQueryBuilder('db')
      .leftJoinAndSelect('db.screening', 's')
      .leftJoinAndSelect('s.patient', 'p')
      .where('db.screeningResult IN (:...results)', {
        results: ['pre_diabetic', 'diabetic'],
      });

    if (facilityId) {
      dbQuery.andWhere('p.phcCenterId = :facilityId', { facilityId });
    }

    if (startDate && endDate) {
      dbQuery.andWhere('s.screeningDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const dbResults = await dbQuery.getMany();
    dbResults.forEach(db => {
      abnormalResults.push({
        type: 'Diabetes',
        patientName: `${db.screening?.patient?.firstName || ''} ${db.screening?.patient?.lastName || ''}`.trim(),
        date: db.screening?.screeningDate,
        result: db.screeningResult,
        details: `Blood Sugar: ${db.bloodSugarLevel} ${db.unit || 'mg/dL'}`,
        referral: db.referToDoctor,
      });
    });

    // Get cervical positive results
    const cvQuery = this.cervicalRepository
      .createQueryBuilder('cv')
      .leftJoinAndSelect('cv.screening', 's')
      .leftJoinAndSelect('s.patient', 'p')
      .where('cv.screeningResult IN (:...results)', {
        results: ['positive', 'suspicious'],
      });

    if (facilityId) {
      cvQuery.andWhere('p.phcCenterId = :facilityId', { facilityId });
    }

    if (startDate && endDate) {
      cvQuery.andWhere('s.screeningDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const cvResults = await cvQuery.getMany();
    cvResults.forEach(cv => {
      abnormalResults.push({
        type: 'Cervical Cancer',
        patientName: `${cv.screening?.patient?.firstName || ''} ${cv.screening?.patient?.lastName || ''}`.trim(),
        date: cv.screening?.screeningDate,
        result: cv.screeningResult,
        details: `Method: ${cv.screeningMethod}`,
        referral: cv.followUpRequired,
      });
    });

    // Get breast high risk results
    const brQuery = this.breastRepository
      .createQueryBuilder('br')
      .leftJoinAndSelect('br.screening', 's')
      .leftJoinAndSelect('s.patient', 'p')
      .where('br.riskAssessment IN (:...results)', {
        results: ['moderate', 'high'],
      });

    if (facilityId) {
      brQuery.andWhere('p.phcCenterId = :facilityId', { facilityId });
    }

    if (startDate && endDate) {
      brQuery.andWhere('s.screeningDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const brResults = await brQuery.getMany();
    brResults.forEach(br => {
      abnormalResults.push({
        type: 'Breast Cancer',
        patientName: `${br.screening?.patient?.firstName || ''} ${br.screening?.patient?.lastName || ''}`.trim(),
        date: br.screening?.screeningDate,
        result: br.riskAssessment,
        details: br.summaryFindings,
        referral: br.referralRequired,
      });
    });

    return abnormalResults.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async getTrendData(
    facilityId?: number,
    period: 'daily' | 'weekly' | 'monthly' = 'daily',
    days: number = 30,
  ): Promise<{ date: string; count: number; completed: number }[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let dateFormat: string;
    let groupBy: string;

    switch (period) {
      case 'weekly':
        dateFormat = '%Y-%U';
        groupBy = 'YEARWEEK(s.screening_date)';
        break;
      case 'monthly':
        dateFormat = '%Y-%m';
        groupBy = 'DATE_FORMAT(s.screening_date, "%Y-%m")';
        break;
      default:
        dateFormat = '%Y-%m-%d';
        groupBy = 'DATE(s.screening_date)';
    }

    const query = this.screeningsRepository
      .createQueryBuilder('s')
      .leftJoin('s.patient', 'p')
      .select(`DATE_FORMAT(s.screeningDate, '${dateFormat}')`, 'date')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(CASE WHEN s.status = "completed" THEN 1 ELSE 0 END)', 'completed')
      .where('s.screeningDate >= :startDate', { startDate })
      .groupBy(groupBy)
      .orderBy('date', 'ASC');

    if (facilityId) {
      query.andWhere('p.phcCenterId = :facilityId', { facilityId });
    }

    const results = await query.getRawMany();

    return results.map(r => ({
      date: r.date,
      count: parseInt(r.count),
      completed: parseInt(r.completed),
    }));
  }

  // Export data as CSV format
  async exportToCSV(filters: ReportFilters = {}): Promise<string> {
    const data = await this.getScreeningDetails(filters);

    if (data.length === 0) {
      return 'No data available for the selected filters';
    }

    const headers = [
      'ID',
      'Date',
      'Time',
      'Patient Name',
      'Patient ID',
      'Screening Type',
      'Status',
      'Conducted By',
      'Facility',
      'Blood Pressure',
      'Temperature',
      'Pulse Rate',
      'Weight',
      'Result',
      'Referral',
    ];

    const rows = data.map(d => [
      d.id,
      d.date,
      d.time,
      d.patientName,
      d.patientId,
      d.screeningType,
      d.status,
      d.conductedBy,
      d.facility,
      d.vitals.bp || '',
      d.vitals.temperature || '',
      d.vitals.pulseRate || '',
      d.vitals.weight || '',
      d.result || '',
      d.referral || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    return csvContent;
  }
}
