import { Repository } from 'typeorm';
import { Screening } from './entities/screening.entity';
import { HypertensionScreening, HypertensionResult } from './entities/hypertension-screening.entity';
import { DiabetesScreening, DiabetesResult } from './entities/diabetes-screening.entity';
import { CervicalScreening } from './entities/cervical-screening.entity';
import { BreastScreening } from './entities/breast-screening.entity';
import { PsaScreening, PsaResult } from './entities/psa-screening.entity';
import { CreateHypertensionScreeningDto, UpdateHypertensionScreeningDto } from './dto/hypertension-screening.dto';
import { CreateDiabetesScreeningDto, UpdateDiabetesScreeningDto } from './dto/diabetes-screening.dto';
import { CreateCervicalScreeningDto, UpdateCervicalScreeningDto } from './dto/cervical-screening.dto';
import { CreateBreastScreeningDto, UpdateBreastScreeningDto } from './dto/breast-screening.dto';
import { CreatePsaScreeningDto, UpdatePsaScreeningDto } from './dto/psa-screening.dto';
export declare class PathwayScreeningsService {
    private screeningsRepository;
    private hypertensionRepository;
    private diabetesRepository;
    private cervicalRepository;
    private breastRepository;
    private psaRepository;
    constructor(screeningsRepository: Repository<Screening>, hypertensionRepository: Repository<HypertensionScreening>, diabetesRepository: Repository<DiabetesScreening>, cervicalRepository: Repository<CervicalScreening>, breastRepository: Repository<BreastScreening>, psaRepository: Repository<PsaScreening>);
    private calculateHypertensionResult;
    private calculateDiabetesResult;
    private calculatePsaResult;
    createHypertensionScreening(dto: CreateHypertensionScreeningDto, userId: number): Promise<{
        message: string;
        data: {
            id: number;
            screeningResult: HypertensionResult;
            averageBp: string;
            referToDoctor: boolean;
        };
    }>;
    getHypertensionScreening(screeningId: number): Promise<HypertensionScreening | null>;
    updateHypertensionScreening(screeningId: number, dto: UpdateHypertensionScreeningDto): Promise<{
        message: string;
    }>;
    createDiabetesScreening(dto: CreateDiabetesScreeningDto, userId: number): Promise<{
        message: string;
        data: {
            id: number;
            screeningResult: DiabetesResult;
            bloodSugarLevel: number;
            referToDoctor: boolean;
        };
    }>;
    getDiabetesScreening(screeningId: number): Promise<DiabetesScreening | null>;
    updateDiabetesScreening(screeningId: number, dto: UpdateDiabetesScreeningDto): Promise<{
        message: string;
    }>;
    createCervicalScreening(dto: CreateCervicalScreeningDto, userId: number): Promise<{
        message: string;
        data: {
            id: number;
            screeningResult: "positive" | "negative" | "suspicious" | "inconclusive";
            followUpRequired: boolean;
        };
    }>;
    getCervicalScreening(screeningId: number): Promise<CervicalScreening | null>;
    updateCervicalScreening(screeningId: number, dto: UpdateCervicalScreeningDto): Promise<{
        message: string;
    }>;
    createBreastScreening(dto: CreateBreastScreeningDto, userId: number): Promise<{
        message: string;
        data: {
            id: number;
            riskAssessment: "low" | "moderate" | "high";
            referralRequired: boolean;
        };
    }>;
    getBreastScreening(screeningId: number): Promise<BreastScreening | null>;
    updateBreastScreening(screeningId: number, dto: UpdateBreastScreeningDto): Promise<{
        message: string;
    }>;
    createPsaScreening(dto: CreatePsaScreeningDto, userId: number): Promise<{
        message: string;
        data: {
            id: number;
            screeningResult: PsaResult;
            psaLevel: number;
            referToDoctor: boolean;
        };
    }>;
    getPsaScreening(screeningId: number): Promise<PsaScreening | null>;
    updatePsaScreening(screeningId: number, dto: UpdatePsaScreeningDto): Promise<{
        message: string;
    }>;
    getPathwayData(screeningId: number, pathway: string): Promise<HypertensionScreening | DiabetesScreening | CervicalScreening | BreastScreening | PsaScreening | null>;
}
