import nodemailer from 'nodemailer';
import winston from 'winston';

export class EmailService {
  private transporter: nodemailer.Transporter;
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.simple(),
      transports: [new winston.transports.Console()],
    });

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    });
  }

  private getBaseTemplate(title: string, bodyContent: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0; color: #333; }
          .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
          .header { background-color: #1a4731; color: #ffffff; padding: 24px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px; }
          .content { padding: 32px 24px; line-height: 1.6; }
          .otp-box { background-color: #f0f4f1; border: 1px dashed #2d6a4f; padding: 16px; text-align: center; border-radius: 6px; margin: 24px 0; }
          .otp-code { font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #2d6a4f; }
          .footer { background-color: #f8f9fa; padding: 16px; text-align: center; font-size: 12px; color: #6c757d; border-top: 1px solid #e9ecef; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>MIZAN</h1>
          </div>
          <div class="content">
            ${bodyContent}
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} MIZAN. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"MIZAN" <${process.env.SMTP_USER || 'noreply@mizan.app'}>`,
        to,
        subject,
        html,
      });
      this.logger.info(`Email sent to ${to} with subject: ${subject}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}. Error: ${(error as Error).message}`);
    }
  }

  async sendVerificationEmail(to: string, name: string, otp: string): Promise<void> {
    const body = `
      <h2>Assalamu Alaikum ${name},</h2>
      <p>Thank you for creating an account with MIZAN. Please use the verification code below to verify your email address:</p>
      <div class="otp-box">
        <div class="otp-code">${otp}</div>
      </div>
      <p>This code is valid for 10 minutes. If you did not request this account, please ignore this email.</p>
    `;
    const html = this.getBaseTemplate('Verify Your Email - MIZAN', body);
    await this.sendEmail(to, 'Verify Your MIZAN Account', html);
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    const body = `
      <h2>Welcome to MIZAN, ${name}!</h2>
      <p>Your account has been successfully verified.</p>
      <p>You can now calculate Zakat, distribute Inheritance according to authentic Fiqh rules, and export official PDF reports.</p>
    `;
    const html = this.getBaseTemplate('Welcome to MIZAN', body);
    await this.sendEmail(to, 'Welcome to MIZAN', html);
  }

  async sendPasswordResetEmail(to: string, name: string, otp: string): Promise<void> {
    const body = `
      <h2>Assalamu Alaikum ${name},</h2>
      <p>We received a request to reset your MIZAN account password. Use the code below to set a new password:</p>
      <div class="otp-box">
        <div class="otp-code">${otp}</div>
      </div>
      <p>This code is valid for 10 minutes. If you did not request a password reset, please secure your account.</p>
    `;
    const html = this.getBaseTemplate('Password Reset Request - MIZAN', body);
    await this.sendEmail(to, 'MIZAN Password Reset Code', html);
  }
}
