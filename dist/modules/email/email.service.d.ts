import { ConfigService } from '@nestjs/config';
interface SendEmailParams {
    to: string;
    toName?: string;
    subject: string;
    textContent: string;
    htmlContent: string;
}
interface EmailResult {
    success: boolean;
    messageId?: string;
    error?: string;
}
export declare class EmailService {
    private configService;
    private readonly logger;
    private readonly mailjet;
    private readonly senderEmail;
    private readonly senderName;
    private readonly adminEmail;
    private readonly supportEmail;
    private readonly supportPhone;
    constructor(configService: ConfigService);
    sendEmail(params: SendEmailParams): Promise<EmailResult>;
    sendStaffApprovalEmail(staffEmail: string, staffName: string, role: string): Promise<EmailResult>;
    sendStaffRejectionEmail(staffEmail: string, staffName: string, role: string): Promise<EmailResult>;
    sendNewStaffRegistrationEmail(newStaffName: string, newStaffEmail: string, newStaffRole: string, facilityName?: string): Promise<EmailResult>;
    private formatRoleName;
}
export {};
