import { Response } from 'express';
import { ReportsService } from './reports.service';
import { AuditService } from '../audit/audit.service';
export declare class ReportsController {
    private reportsService;
    private auditService;
    constructor(reportsService: ReportsService, auditService: AuditService);
    getSummary(req: any, facilityId?: string, screeningType?: string, startDate?: string, endDate?: string, status?: string): Promise<import("./reports.service").ScreeningSummary>;
    getDetails(req: any, facilityId?: string, screeningType?: string, startDate?: string, endDate?: string, status?: string): Promise<any[]>;
    getFacilityComparison(startDate?: string, endDate?: string): Promise<import("./reports.service").FacilityComparison[]>;
    getAbnormalResults(req: any, facilityId?: string, startDate?: string, endDate?: string): Promise<any[]>;
    getTrends(req: any, facilityId?: string, period?: 'daily' | 'weekly' | 'monthly', days?: string): Promise<{
        date: string;
        count: number;
        completed: number;
    }[]>;
    exportCSV(req: any, res: Response, facilityId?: string, screeningType?: string, startDate?: string, endDate?: string, status?: string): Promise<void>;
    private buildFilters;
}
