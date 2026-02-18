import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;
    private readonly logger = new Logger(MailService.name);

    constructor(private configService: ConfigService) {
        this.createTransporter();
    }

    private createTransporter() {
        const host = this.configService.get<string>('MAIL_HOST');
        const port = Number(this.configService.get('MAIL_PORT')) || 587;
        const user = this.configService.get<string>('MAIL_USERNAME');
        const pass = this.configService.get<string>('MAIL_PASSWORD');

        if (!host || !user || !pass) {
            this.logger.warn('Mail configuration missing. Emails will not be sent.');
            return;
        }

        this.transporter = nodemailer.createTransport({
            host: host,
            port: port,
            secure: port === 465, // true for 465, false for other ports
            auth: {
                user: user,
                pass: pass,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        this.verifyConnection();
    }

    private async verifyConnection() {
        if (!this.transporter) return;
        try {
            await this.transporter.verify();
            this.logger.log('Mail server connection established successfully');
        } catch (error) {
            this.logger.error('Mail server connection failed', error);
        }
    }

    async sendMail(to: string, subject: string, html: string) {
        if (!this.transporter) {
            this.logger.warn(`Cannot send email to ${to}. Transporter not initialized.`);
            return;
        }

        const fromAddress = this.configService.get<string>('MAIL_FROM_ADDRESS') || 'noreply@example.com';
        const fromName = this.configService.get<string>('MAIL_FROM_NAME') || 'No Reply';
        const from = `"${fromName}" <${fromAddress}>`;

        try {
            const info = await this.transporter.sendMail({
                from,
                to,
                subject,
                html,
            });
            this.logger.log(`Email sent: ${info.messageId}`);
            return info;
        } catch (error) {
            this.logger.error(`Error sending email to ${to}`, error);
            throw error;
        }
    }

    async sendUserConfirmation(user: any, token: string) {
        const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
        const url = `${frontendUrl}/confirm?token=${token}`;
        const html = `
      <h1>Welcome ${user.name}!</h1>
      <p>Please confirm your email by clicking usually the link below:</p>
      <a href="${url}">Confirm Email</a>
    `;
        await this.sendMail(user.email, 'Welcome to App! Confirm your Email', html);
    }

    async sendForgotPassword(user: any, token: string) {
        const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
        const url = `${frontendUrl}/reset-password?token=${token}`;
        const html = `
      <h1>Hello ${user.name}</h1>
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${url}">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `;
        await this.sendMail(user.email, 'Password Reset Request', html);
    }

    async sendLoginNotification(user: any, ip: string, userAgent: string) {
        const html = `
        <h1>Login Notification</h1>
        <p>Hello ${user.name},</p>
        <p>We detected a new login to your account.</p>
        <p><strong>IP:</strong> ${ip}</p>
        <p><strong>Device:</strong> ${userAgent}</p>
        <p>If this was not you, please reset your password immediately.</p>
      `;
        await this.sendMail(user.email, 'New Login Detected', html);
    }

    async sendUserStatusChange(user: any, status: string) {
        const html = `
        <h1>Account Status Update</h1>
        <p>Hello ${user.name},</p>
        <p>Your account status has been changed to: <strong>${status}</strong>.</p>
        <p>If you have questions, please contact support.</p>
      `;
        await this.sendMail(user.email, 'Account Status Change', html);
    }
}
