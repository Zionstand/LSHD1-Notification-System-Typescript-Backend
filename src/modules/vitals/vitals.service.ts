import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VitalRecord } from './entities/vital-record.entity';
import { CreateVitalRecordDto } from './dto/create-vital-record.dto';
import { Screening } from '../screenings/entities/screening.entity';

@Injectable()
export class VitalsService {
  constructor(
    @InjectRepository(VitalRecord)
    private vitalRecordsRepository: Repository<VitalRecord>,
    @InjectRepository(Screening)
    private screeningsRepository: Repository<Screening>,
  ) {}

  async create(createDto: CreateVitalRecordDto, recordedBy: number): Promise<VitalRecord> {
    // Calculate BMI if weight and height are provided
    let bmi: number | undefined;
    if (createDto.weight && createDto.height) {
      const heightInMeters = createDto.height / 100;
      bmi = parseFloat((createDto.weight / (heightInMeters * heightInMeters)).toFixed(2));
    }

    const vitalRecord = new VitalRecord();
    vitalRecord.patientId = createDto.patientId;
    vitalRecord.screeningId = createDto.screeningId ?? null;
    vitalRecord.bloodPressureSystolic = createDto.systolicBp;
    vitalRecord.bloodPressureDiastolic = createDto.diastolicBp;
    vitalRecord.temperature = createDto.temperature ?? null;
    vitalRecord.pulseRate = createDto.pulseRate ?? null;
    vitalRecord.respiratoryRate = createDto.respiratoryRate ?? null;
    vitalRecord.weight = createDto.weight ?? null;
    vitalRecord.height = createDto.height ?? null;
    vitalRecord.bmi = bmi ?? null;
    vitalRecord.bloodSugarRandom = createDto.bloodSugarRandom ?? null;
    vitalRecord.bloodSugarFasting = createDto.bloodSugarFasting ?? null;
    vitalRecord.notes = createDto.notes ?? null;
    vitalRecord.recordedBy = recordedBy;
    vitalRecord.recordedAt = new Date();

    const saved = await this.vitalRecordsRepository.save(vitalRecord);

    // If linked to a screening, update the screening's vitals and status
    if (createDto.screeningId) {
      const screening = await this.screeningsRepository.findOne({
        where: { id: createDto.screeningId },
      });

      if (screening) {
        // Update screening with latest vitals
        screening.bloodPressureSystolic = createDto.systolicBp;
        screening.bloodPressureDiastolic = createDto.diastolicBp;
        if (createDto.temperature) screening.temperature = createDto.temperature;
        if (createDto.pulseRate) screening.pulseRate = createDto.pulseRate;
        if (createDto.respiratoryRate) screening.respiratoryRate = createDto.respiratoryRate;
        if (createDto.weight) screening.weight = createDto.weight;
        if (createDto.height) screening.height = createDto.height;
        if (bmi) screening.bmi = bmi;
        if (createDto.bloodSugarRandom) screening.bloodSugarRandom = createDto.bloodSugarRandom;
        if (createDto.bloodSugarFasting) screening.bloodSugarFasting = createDto.bloodSugarFasting;

        // Update status to in_progress when vitals are recorded
        if (screening.status === 'pending') {
          screening.status = 'in_progress';
        }

        await this.screeningsRepository.save(screening);
      }
    }

    return saved;
  }

  async findByPatient(patientId: number): Promise<VitalRecord[]> {
    return this.vitalRecordsRepository.find({
      where: { patientId },
      relations: ['recordedByUser', 'screening'],
      order: { recordedAt: 'DESC' },
    });
  }

  async findByScreening(screeningId: number): Promise<VitalRecord[]> {
    return this.vitalRecordsRepository.find({
      where: { screeningId },
      relations: ['recordedByUser'],
      order: { recordedAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<VitalRecord> {
    const record = await this.vitalRecordsRepository.findOne({
      where: { id },
      relations: ['recordedByUser', 'patient', 'screening'],
    });

    if (!record) {
      throw new NotFoundException('Vital record not found');
    }

    return record;
  }

  async getLatestByPatient(patientId: number): Promise<VitalRecord | null> {
    return this.vitalRecordsRepository.findOne({
      where: { patientId },
      relations: ['recordedByUser'],
      order: { recordedAt: 'DESC' },
    });
  }

  async getLatestByScreening(screeningId: number): Promise<VitalRecord | null> {
    return this.vitalRecordsRepository.findOne({
      where: { screeningId },
      relations: ['recordedByUser'],
      order: { recordedAt: 'DESC' },
    });
  }

  // Format vital record for API response
  formatVitalRecord(record: VitalRecord) {
    return {
      id: record.id,
      patientId: record.patientId,
      screeningId: record.screeningId,
      bloodPressure: {
        systolic: record.bloodPressureSystolic,
        diastolic: record.bloodPressureDiastolic,
        formatted: record.bloodPressureSystolic && record.bloodPressureDiastolic
          ? `${record.bloodPressureSystolic}/${record.bloodPressureDiastolic} mmHg`
          : null,
      },
      temperature: record.temperature,
      pulseRate: record.pulseRate,
      respiratoryRate: record.respiratoryRate,
      weight: record.weight,
      height: record.height,
      bmi: record.bmi,
      bloodSugar: {
        random: record.bloodSugarRandom,
        fasting: record.bloodSugarFasting,
      },
      notes: record.notes,
      recordedBy: record.recordedByUser ? {
        id: record.recordedByUser.id,
        name: record.recordedByUser.fullName,
      } : null,
      recordedAt: record.recordedAt,
      createdAt: record.createdAt,
    };
  }
}
