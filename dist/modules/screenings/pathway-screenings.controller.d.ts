import { PathwayScreeningsService } from './pathway-screenings.service';
import { CreateHypertensionScreeningDto, UpdateHypertensionScreeningDto } from './dto/hypertension-screening.dto';
import { CreateDiabetesScreeningDto, UpdateDiabetesScreeningDto } from './dto/diabetes-screening.dto';
import { CreateCervicalScreeningDto, UpdateCervicalScreeningDto } from './dto/cervical-screening.dto';
import { CreateBreastScreeningDto, UpdateBreastScreeningDto } from './dto/breast-screening.dto';
import { CreatePsaScreeningDto, UpdatePsaScreeningDto } from './dto/psa-screening.dto';
export declare class PathwayScreeningsController {
    private pathwayService;
    constructor(pathwayService: PathwayScreeningsService);
    createHypertensionScreening(id: string, dto: Omit<CreateHypertensionScreeningDto, 'screeningId'>, req: {
        user: {
            id: number;
        };
    }): Promise<{
        message: string;
        data: {
            id: number;
            screeningResult: import("./entities").HypertensionResult;
            averageBp: string;
            referToDoctor: boolean;
        };
    }>;
    getHypertensionScreening(id: string): Promise<import("./entities").HypertensionScreening | null>;
    updateHypertensionScreening(id: string, dto: UpdateHypertensionScreeningDto): Promise<{
        message: string;
    }>;
    createDiabetesScreening(id: string, dto: Omit<CreateDiabetesScreeningDto, 'screeningId'>, req: {
        user: {
            id: number;
        };
    }): Promise<{
        message: string;
        data: {
            id: number;
            screeningResult: import("./entities").DiabetesResult;
            bloodSugarLevel: number;
            referToDoctor: boolean;
        };
    }>;
    getDiabetesScreening(id: string): Promise<import("./entities").DiabetesScreening | null>;
    updateDiabetesScreening(id: string, dto: UpdateDiabetesScreeningDto): Promise<{
        message: string;
    }>;
    createCervicalScreening(id: string, dto: Omit<CreateCervicalScreeningDto, 'screeningId'>, req: {
        user: {
            id: number;
        };
    }): Promise<{
        message: string;
        data: {
            id: number;
            screeningResult: "negative" | "positive" | "suspicious" | "inconclusive";
            followUpRequired: boolean;
        };
    }>;
    getCervicalScreening(id: string): Promise<import("./entities").CervicalScreening | null>;
    updateCervicalScreening(id: string, dto: UpdateCervicalScreeningDto): Promise<{
        message: string;
    }>;
    createBreastScreening(id: string, dto: Omit<CreateBreastScreeningDto, 'screeningId'>, req: {
        user: {
            id: number;
        };
    }): Promise<{
        message: string;
        data: {
            id: number;
            riskAssessment: "low" | "moderate" | "high";
            referralRequired: boolean;
        };
    }>;
    getBreastScreening(id: string): Promise<import("./entities").BreastScreening | null>;
    updateBreastScreening(id: string, dto: UpdateBreastScreeningDto): Promise<{
        message: string;
    }>;
    createPsaScreening(id: string, dto: Omit<CreatePsaScreeningDto, 'screeningId'>, req: {
        user: {
            id: number;
        };
    }): Promise<{
        message: string;
        data: {
            id: number;
            screeningResult: import("./entities").PsaResult;
            psaLevel: number;
            referToDoctor: boolean;
        };
    }>;
    getPsaScreening(id: string): Promise<import("./entities").PsaScreening | null>;
    updatePsaScreening(id: string, dto: UpdatePsaScreeningDto): Promise<{
        message: string;
    }>;
    getPathwayData(id: string): Promise<{
        pathway: string;
        data: import("./entities").HypertensionScreening | import("./entities").DiabetesScreening | import("./entities").CervicalScreening | import("./entities").BreastScreening | import("./entities").PsaScreening;
    } | {
        pathway: null;
        data: null;
    }>;
}
