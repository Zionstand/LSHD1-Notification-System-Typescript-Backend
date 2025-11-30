import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Screening } from "./entities/screening.entity";
import { CreateScreeningDto } from "./dto/create-screening.dto";
import { UpdateVitalsDto } from "./dto/update-vitals.dto";
import { CompleteScreeningDto } from "./dto/complete-screening.dto";
import { DoctorAssessmentDto } from "./dto/doctor-assessment.dto";
// import { NotificationsService } from '../notifications/notifications.service';

const SCREENING_TYPES: Record<number, { name: string; pathway: string }> = {
  1: { name: "Hypertension Screening", pathway: "hypertension" },
  2: { name: "Diabetes Screening", pathway: "diabetes" },
  3: { name: "Cervical Cancer Screening", pathway: "cervical" },
  4: { name: "Breast Cancer Screening", pathway: "breast" },
  5: { name: "PSA Screening", pathway: "psa" },
};

// Map screening type name to ID for reverse lookup
const SCREENING_TYPE_IDS: Record<string, number> = {
  "Hypertension Screening": 1,
  "Diabetes Screening": 2,
  "Cervical Cancer Screening": 3,
  "Breast Cancer Screening": 4,
  "PSA Screening": 5,
};

@Injectable()
export class ScreeningsService {
  private readonly logger = new Logger(ScreeningsService.name);

  constructor(
    @InjectRepository(Screening)
    private screeningsRepository: Repository<Screening>
    // @Inject(forwardRef(() => NotificationsService))
    // private notificationsService: NotificationsService,
  ) {}

  async findAll(facilityId?: number, status?: string) {
    const queryBuilder = this.screeningsRepository
      .createQueryBuilder("s")
      .leftJoinAndSelect("s.patient", "p")
      .leftJoinAndSelect("s.conductedByUser", "u")
      .orderBy("s.screeningDate", "DESC")
      .addOrderBy("s.screeningTime", "DESC")
      .take(100);

    if (status && status !== "all") {
      queryBuilder.andWhere("s.status = :status", { status });
    }

    const screenings = await queryBuilder.getMany();

    return screenings.map((s) => {
      const typeId = SCREENING_TYPE_IDS[s.screeningType] || 1;
      const typeInfo = SCREENING_TYPES[typeId] || {
        name: s.screeningType || "General Screening",
        pathway: "general",
      };

      return {
        id: s.id,
        sessionId: `SCR-${String(s.id).padStart(5, "0")}`,
        status: s.status,
        createdAt: s.createdAt,
        screeningDate: s.screeningDate,
        screeningTime: s.screeningTime,
        client: {
          id: s.patientId,
          clientId: `PAT-${String(s.patientId).padStart(5, "0")}`,
          firstName: s.patient?.firstName,
          lastName: s.patient?.lastName,
        },
        notificationType: {
          id: typeId,
          name: typeInfo.name,
          pathway: typeInfo.pathway,
        },
        conductedBy: s.conductedByUser?.fullName || null,
        vitals: {
          bloodPressureSystolic: s.bloodPressureSystolic,
          bloodPressureDiastolic: s.bloodPressureDiastolic,
          temperature: s.temperature,
          pulseRate: s.pulseRate,
          respiratoryRate: s.respiratoryRate,
          weight: s.weight,
          height: s.height,
          bmi: s.bmi,
        },
        results: {
          diagnosis: s.diagnosis,
          prescription: s.prescription,
          recommendations: s.recommendations,
          nextAppointment: s.nextAppointment,
        },
      };
    });
  }

  async findOne(id: number) {
    const screening = await this.screeningsRepository.findOne({
      where: { id },
      relations: ["patient", "conductedByUser"],
    });

    if (!screening) {
      throw new NotFoundException("Screening not found");
    }

    const typeId = SCREENING_TYPE_IDS[screening.screeningType] || 1;
    const typeInfo = SCREENING_TYPES[typeId] || {
      name: screening.screeningType || "General Screening",
      pathway: "general",
    };

    return {
      id: screening.id,
      sessionId: `SCR-${String(screening.id).padStart(5, "0")}`,
      status: screening.status,
      createdAt: screening.createdAt,
      screeningDate: screening.screeningDate,
      screeningTime: screening.screeningTime,
      client: {
        id: screening.patientId,
        clientId: `PAT-${String(screening.patientId).padStart(5, "0")}`,
        firstName: screening.patient?.firstName,
        lastName: screening.patient?.lastName,
      },
      notificationType: {
        id: typeId,
        name: typeInfo.name,
        pathway: typeInfo.pathway,
      },
      conductedBy: screening.conductedByUser?.fullName || null,
      vitals: {
        bloodPressureSystolic: screening.bloodPressureSystolic,
        bloodPressureDiastolic: screening.bloodPressureDiastolic,
        temperature: screening.temperature,
        pulseRate: screening.pulseRate,
        respiratoryRate: screening.respiratoryRate,
        weight: screening.weight,
        height: screening.height,
        bmi: screening.bmi,
      },
      results: {
        diagnosis: screening.diagnosis,
        prescription: screening.prescription,
        recommendations: screening.recommendations,
        nextAppointment: screening.nextAppointment,
      },
    };
  }

  async create(
    createDto: CreateScreeningDto,
    userId: number,
    facilityId: number
  ) {
    const typeInfo = SCREENING_TYPES[createDto.notificationTypeId] || {
      name: "General Screening",
      pathway: "general",
    };

    const now = new Date();
    const screeningDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const screeningTime = now.toTimeString().split(" ")[0]; // HH:MM:SS

    const screening = this.screeningsRepository.create({
      patientId: createDto.clientId,
      screeningType: typeInfo.name,
      screeningDate: new Date(screeningDate),
      screeningTime: screeningTime,
      conductedBy: userId,
      status: "pending",
    } as Partial<Screening>);

    const saved = await this.screeningsRepository.save(screening);

    return {
      message: "Screening session created",
      session: {
        id: saved.id,
        sessionId: `SCR-${String(saved.id).padStart(5, "0")}`,
        status: saved.status,
      },
    };
  }

  async updateVitals(id: number, updateDto: UpdateVitalsDto) {
    const screening = await this.screeningsRepository.findOne({
      where: { id },
    });

    if (!screening) {
      throw new NotFoundException("Screening not found");
    }

    if (updateDto.systolicBp !== undefined)
      screening.bloodPressureSystolic = updateDto.systolicBp;
    if (updateDto.diastolicBp !== undefined)
      screening.bloodPressureDiastolic = updateDto.diastolicBp;
    if (updateDto.weight !== undefined) screening.weight = updateDto.weight;
    if (updateDto.pulseRate !== undefined)
      screening.pulseRate = updateDto.pulseRate;
    if (updateDto.temperature !== undefined)
      screening.temperature = updateDto.temperature;

    // Update status to in_progress when vitals are recorded
    if (screening.status === "pending") {
      screening.status = "in_progress";
    }

    await this.screeningsRepository.save(screening);

    return { message: "Vital signs recorded" };
  }

  async complete(id: number, completeDto: CompleteScreeningDto) {
    const screening = await this.screeningsRepository.findOne({
      where: { id },
    });

    if (!screening) {
      throw new NotFoundException("Screening not found");
    }

    screening.status = "completed";

    if (completeDto.data) {
      if (completeDto.data.result) {
        screening.diagnosis = completeDto.data.result;
      }
      if (completeDto.data.notes) {
        screening.recommendations = completeDto.data.notes;
      }
      if (completeDto.data.bloodSugar) {
        screening.bloodSugarRandom = completeDto.data.bloodSugar;
      }
      if (completeDto.data.systolic) {
        screening.bloodPressureSystolic = completeDto.data.systolic;
      }
      if (completeDto.data.diastolic) {
        screening.bloodPressureDiastolic = completeDto.data.diastolic;
      }
    }

    await this.screeningsRepository.save(screening);

    return { message: "Screening completed" };
  }

  // Doctor assessment - adds clinical findings and assessment
  async addDoctorAssessment(
    id: number,
    dto: DoctorAssessmentDto,
    doctorId: number
  ) {
    const screening = await this.screeningsRepository.findOne({
      where: { id },
    });

    if (!screening) {
      throw new NotFoundException("Screening not found");
    }

    // Update the screening with doctor's assessment
    screening.diagnosis = dto.clinicalAssessment;
    if (dto.recommendations) screening.recommendations = dto.recommendations;
    if (dto.prescription) screening.prescription = dto.prescription;
    if (dto.patientStatus) screening.patientStatus = dto.patientStatus;
    if (dto.referralFacility) screening.referralFacility = dto.referralFacility;
    if (dto.nextAppointment)
      screening.nextAppointment = new Date(dto.nextAppointment);

    screening.doctorId = doctorId;
    screening.doctorAssessedAt = new Date();

    // Update status based on patient status
    if (dto.patientStatus === "requires_followup") {
      screening.status = "follow_up";
    } else {
      screening.status = "completed";
    }

    await this.screeningsRepository.save(screening);

    // // Send SMS notification to patient about screening results
    // try {
    //   const smsResult = await this.notificationsService.sendScreeningResultSms(
    //     screening.id,
    //     doctorId,
    //   );
    //   this.logger.log(`SMS notification for screening ${screening.id}: ${smsResult.message}`);
    // } catch (error) {
    //   // Log error but don't fail the assessment
    //   this.logger.error(`Failed to send SMS for screening ${screening.id}: ${error.message}`);
    // }

    return {
      message: "Doctor assessment saved successfully",
      screening: {
        id: screening.id,
        patientStatus: screening.patientStatus,
        status: screening.status,
        doctorAssessedAt: screening.doctorAssessedAt,
      },
    };
  }

  // Get screenings pending doctor review
  async findPendingDoctorReview(facilityId?: number) {
    const queryBuilder = this.screeningsRepository
      .createQueryBuilder("s")
      .leftJoinAndSelect("s.patient", "p")
      .leftJoinAndSelect("s.conductedByUser", "u")
      .where("s.doctorId IS NULL")
      .andWhere("s.status IN (:...statuses)", {
        statuses: ["pending", "follow_up"],
      })
      .orderBy("s.screeningDate", "DESC")
      .addOrderBy("s.screeningTime", "DESC")
      .take(100);

    const screenings = await queryBuilder.getMany();

    return screenings.map((s) => {
      const typeId = SCREENING_TYPE_IDS[s.screeningType] || 1;
      const typeInfo = SCREENING_TYPES[typeId] || {
        name: s.screeningType || "General Screening",
        pathway: "general",
      };

      return {
        id: s.id,
        sessionId: `SCR-${String(s.id).padStart(5, "0")}`,
        status: s.status,
        createdAt: s.createdAt,
        screeningDate: s.screeningDate,
        screeningTime: s.screeningTime,
        client: {
          id: s.patientId,
          clientId: `PAT-${String(s.patientId).padStart(5, "0")}`,
          firstName: s.patient?.firstName,
          lastName: s.patient?.lastName,
        },
        notificationType: {
          id: typeId,
          name: typeInfo.name,
          pathway: typeInfo.pathway,
        },
        conductedBy: s.conductedByUser?.fullName || null,
        vitals: {
          bloodPressureSystolic: s.bloodPressureSystolic,
          bloodPressureDiastolic: s.bloodPressureDiastolic,
          temperature: s.temperature,
          pulseRate: s.pulseRate,
          weight: s.weight,
        },
      };
    });
  }

  // Get all screenings for a specific patient (medical history)
  async findByPatient(patientId: number) {
    const screenings = await this.screeningsRepository
      .createQueryBuilder("s")
      .leftJoinAndSelect("s.patient", "p")
      .leftJoinAndSelect("s.conductedByUser", "u")
      .where("s.patientId = :patientId", { patientId })
      .orderBy("s.screeningDate", "DESC")
      .addOrderBy("s.screeningTime", "DESC")
      .getMany();

    return screenings.map((s) => {
      const typeId = SCREENING_TYPE_IDS[s.screeningType] || 1;
      const typeInfo = SCREENING_TYPES[typeId] || {
        name: s.screeningType || "General Screening",
        pathway: "general",
      };

      return {
        id: s.id,
        sessionId: `SCR-${String(s.id).padStart(5, "0")}`,
        status: s.status,
        createdAt: s.createdAt,
        screeningDate: s.screeningDate,
        screeningTime: s.screeningTime,
        notificationType: {
          id: typeId,
          name: typeInfo.name,
          pathway: typeInfo.pathway,
        },
        conductedBy: s.conductedByUser?.fullName || null,
        vitals: {
          bloodPressureSystolic: s.bloodPressureSystolic,
          bloodPressureDiastolic: s.bloodPressureDiastolic,
          temperature: s.temperature,
          pulseRate: s.pulseRate,
          respiratoryRate: s.respiratoryRate,
          weight: s.weight,
          height: s.height,
          bmi: s.bmi,
        },
        results: {
          diagnosis: s.diagnosis,
          prescription: s.prescription,
          recommendations: s.recommendations,
          nextAppointment: s.nextAppointment,
        },
      };
    });
  }
}
