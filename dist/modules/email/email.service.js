"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const Mailjet = require('node-mailjet');
let EmailService = EmailService_1 = class EmailService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(EmailService_1.name);
        const publicKey = this.configService.get('MAILJET_API_PUBLIC_KEY');
        const privateKey = this.configService.get('MAILJET_API_PRIVATE_KEY');
        if (!publicKey || !privateKey) {
            this.logger.warn('Mailjet API keys not configured. Email sending will be disabled.');
        }
        this.mailjet = new Mailjet({
            apiKey: publicKey || '',
            apiSecret: privateKey || '',
        });
        this.senderEmail = this.configService.get('SENDER_EMAIL_ADDRESS') || 'noreply@lshd1.com';
        this.senderName = this.configService.get('SENDER_EMAIL_NAME') || 'LSHD1 Screening System';
        this.adminEmail = this.configService.get('ADMIN_EMAIL_ADDRESS') || '';
        this.supportEmail = this.configService.get('SUPPORT_EMAIL_ADDRESS') || '';
        this.supportPhone = this.configService.get('SUPPORT_PHONE_NUMBER') || '';
    }
    async sendEmail(params) {
        const { to, toName, subject, textContent, htmlContent } = params;
        try {
            const response = await this.mailjet
                .post('send', { version: 'v3.1' })
                .request({
                Messages: [
                    {
                        From: {
                            Email: this.senderEmail,
                            Name: this.senderName,
                        },
                        To: [
                            {
                                Email: to,
                                Name: toName || to,
                            },
                        ],
                        Subject: subject,
                        TextPart: textContent,
                        HTMLPart: htmlContent,
                    },
                ],
            });
            const result = response.body;
            if (result.Messages && result.Messages[0]?.Status === 'success') {
                this.logger.log(`Email sent successfully to ${to}`);
                return {
                    success: true,
                    messageId: result.Messages[0]?.To?.[0]?.MessageID,
                };
            }
            else {
                const errorMsg = result.Messages?.[0]?.Errors?.[0]?.ErrorMessage || 'Unknown error';
                this.logger.error(`Failed to send email to ${to}: ${errorMsg}`);
                return {
                    success: false,
                    error: errorMsg,
                };
            }
        }
        catch (error) {
            const errorMessage = error.response?.body?.Messages?.[0]?.Errors?.[0]?.ErrorMessage
                || error.message
                || 'Failed to send email';
            this.logger.error(`Email sending error: ${errorMessage}`);
            return {
                success: false,
                error: errorMessage,
            };
        }
    }
    async sendStaffApprovalEmail(staffEmail, staffName, role) {
        const formattedRole = this.formatRoleName(role);
        const loginUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
        const subject = 'Your LSHD1 Account Has Been Approved';
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">LSHD1 Screening System</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #16a34a; margin: 0 0 20px 0; font-size: 22px;">Account Approved!</h2>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Dear <strong>${staffName}</strong>,
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Great news! Your <strong>${formattedRole}</strong> account has been approved. You can now log in to the LSHD1 Screening System and start using all the features available to you.
              </p>

              <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 15px 20px; margin: 25px 0; border-radius: 0 4px 4px 0;">
                <p style="color: #166534; margin: 0; font-size: 14px;">
                  <strong>Your Role:</strong> ${formattedRole}<br>
                  <strong>Email:</strong> ${staffEmail}
                </p>
              </div>

              <table cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td style="background-color: #16a34a; border-radius: 6px;">
                    <a href="${loginUrl}" style="display: inline-block; padding: 14px 30px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">
                      Login Now
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                If you have any questions or need assistance, please contact our support team.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 30px; border-top: 1px solid #e5e5e5;">
              <p style="color: #666666; font-size: 12px; margin: 0; text-align: center;">
                LSHD1 Screening System<br>
                ${this.supportEmail ? `Email: ${this.supportEmail}` : ''} ${this.supportPhone ? `| Phone: ${this.supportPhone}` : ''}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
        const textContent = `
Dear ${staffName},

Great news! Your ${formattedRole} account has been approved. You can now log in to the LSHD1 Screening System.

Your Role: ${formattedRole}
Email: ${staffEmail}

Login here: ${loginUrl}

If you have any questions, please contact our support team.

LSHD1 Screening System
${this.supportEmail ? `Email: ${this.supportEmail}` : ''}
${this.supportPhone ? `Phone: ${this.supportPhone}` : ''}
    `;
        return this.sendEmail({
            to: staffEmail,
            toName: staffName,
            subject,
            textContent,
            htmlContent,
        });
    }
    async sendStaffRejectionEmail(staffEmail, staffName, role) {
        const formattedRole = this.formatRoleName(role);
        const subject = 'LSHD1 Account Registration Update';
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">LSHD1 Screening System</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #dc2626; margin: 0 0 20px 0; font-size: 22px;">Registration Update</h2>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Dear <strong>${staffName}</strong>,
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                We regret to inform you that your <strong>${formattedRole}</strong> account registration could not be approved at this time.
              </p>

              <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px 20px; margin: 25px 0; border-radius: 0 4px 4px 0;">
                <p style="color: #991b1b; margin: 0; font-size: 14px;">
                  This may be due to incomplete information or verification requirements. Please contact the administrator for more details.
                </p>
              </div>

              <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                If you believe this is an error or have questions, please reach out to our support team.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 30px; border-top: 1px solid #e5e5e5;">
              <p style="color: #666666; font-size: 12px; margin: 0; text-align: center;">
                LSHD1 Screening System<br>
                ${this.supportEmail ? `Email: ${this.supportEmail}` : ''} ${this.supportPhone ? `| Phone: ${this.supportPhone}` : ''}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
        const textContent = `
Dear ${staffName},

We regret to inform you that your ${formattedRole} account registration could not be approved at this time.

This may be due to incomplete information or verification requirements. Please contact the administrator for more details.

If you have any questions, please contact our support team.

LSHD1 Screening System
${this.supportEmail ? `Email: ${this.supportEmail}` : ''}
${this.supportPhone ? `Phone: ${this.supportPhone}` : ''}
    `;
        return this.sendEmail({
            to: staffEmail,
            toName: staffName,
            subject,
            textContent,
            htmlContent,
        });
    }
    async sendNewStaffRegistrationEmail(newStaffName, newStaffEmail, newStaffRole, facilityName) {
        if (!this.adminEmail) {
            this.logger.warn('Admin email not configured. Skipping new staff registration notification.');
            return { success: false, error: 'Admin email not configured' };
        }
        const formattedRole = this.formatRoleName(newStaffRole);
        const dashboardUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
        const subject = `New Staff Registration: ${newStaffName} (${formattedRole})`;
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">LSHD1 Screening System</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #ca8a04; margin: 0 0 20px 0; font-size: 22px;">New Staff Registration</h2>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                A new staff member has registered and is awaiting your approval.
              </p>

              <div style="background-color: #fefce8; border: 1px solid #fef08a; padding: 20px; margin: 25px 0; border-radius: 8px;">
                <table cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #fef08a;">
                      <strong style="color: #713f12;">Name:</strong>
                      <span style="color: #333333; float: right;">${newStaffName}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #fef08a;">
                      <strong style="color: #713f12;">Email:</strong>
                      <span style="color: #333333; float: right;">${newStaffEmail}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #fef08a;">
                      <strong style="color: #713f12;">Role:</strong>
                      <span style="color: #333333; float: right;">${formattedRole}</span>
                    </td>
                  </tr>
                  ${facilityName ? `
                  <tr>
                    <td style="padding: 8px 0;">
                      <strong style="color: #713f12;">Facility:</strong>
                      <span style="color: #333333; float: right;">${facilityName}</span>
                    </td>
                  </tr>
                  ` : ''}
                </table>
              </div>

              <table cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td style="background-color: #ca8a04; border-radius: 6px;">
                    <a href="${dashboardUrl}/dashboard" style="display: inline-block; padding: 14px 30px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">
                      Review & Approve
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                Please log in to the admin dashboard to review and approve this registration.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 30px; border-top: 1px solid #e5e5e5;">
              <p style="color: #666666; font-size: 12px; margin: 0; text-align: center;">
                LSHD1 Screening System - Admin Notification<br>
                This is an automated message. Please do not reply directly.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
        const textContent = `
New Staff Registration

A new staff member has registered and is awaiting your approval.

Name: ${newStaffName}
Email: ${newStaffEmail}
Role: ${formattedRole}
${facilityName ? `Facility: ${facilityName}` : ''}

Please log in to the admin dashboard to review and approve this registration:
${dashboardUrl}/dashboard

LSHD1 Screening System - Admin Notification
    `;
        return this.sendEmail({
            to: this.adminEmail,
            toName: 'Admin',
            subject,
            textContent,
            htmlContent,
        });
    }
    formatRoleName(role) {
        const roleMap = {
            admin: 'Administrator',
            him_officer: 'HIM Officer',
            nurse: 'Nurse',
            doctor: 'Doctor',
            mls: 'Medical Lab Scientist',
            cho: 'Community Health Officer',
        };
        return roleMap[role] || role;
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map