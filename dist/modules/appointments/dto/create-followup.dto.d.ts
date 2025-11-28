export declare class CreateFollowupDto {
    clientId: number;
    screeningId?: number;
    followupDate: string;
    followupTime?: string;
    followupType: string;
    followupInstructions?: string;
    sendSmsReminder?: boolean;
    reminderDaysBefore?: number;
}
