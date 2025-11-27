import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private dashboardService;
    constructor(dashboardService: DashboardService);
    getStats(req: any): Promise<{
        totalClients: number;
        todayScreenings: number;
        pendingScreenings: number;
        completedToday: number;
    }>;
}
