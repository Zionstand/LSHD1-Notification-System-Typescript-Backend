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
    getExtendedStats(req: any): Promise<{
        totalScreenings: number;
        completedScreenings: number;
        completionRate: number;
        referrals: number;
        referralRate: number;
        thisWeekScreenings: number;
        thisMonthScreenings: number;
        upcomingAppointments: number;
        newClientsThisMonth: number;
        screeningsByType: any;
        last7DaysTrend: {
            date: string;
            count: number;
        }[];
        totalClients: number;
        todayScreenings: number;
        pendingScreenings: number;
        completedToday: number;
    }>;
}
