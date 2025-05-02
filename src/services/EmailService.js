import nodemailer from 'nodemailer';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import Queue from 'bull';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
export class EmailService {
    static instance;
    transporter;
    emailQueue;
    templates;
    constructor() {
        this.initializeTransporter();
        this.initializeQueue();
        this.loadTemplates();
    }
    static getInstance() {
        if (!EmailService.instance) {
            EmailService.instance = new EmailService();
        }
        return EmailService.instance;
    }
    initializeTransporter() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }
    initializeQueue() {
        this.emailQueue = new Queue('email-queue', {
            redis: {
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379'),
            },
        });
        this.emailQueue.process(async (job) => {
            const { to, subject, html } = job.data;
            await this.sendEmailDirectly(to, subject, html);
        });
    }
    loadTemplates() {
        this.templates = new Map();
        const templatesDir = path.join(__dirname, '../templates/email');
        if (fs.existsSync(templatesDir)) {
            const files = fs.readdirSync(templatesDir);
            files.forEach((file) => {
                if (file.endsWith('.hbs')) {
                    const templateName = path.basename(file, '.hbs');
                    const templateContent = fs.readFileSync(path.join(templatesDir, file), 'utf-8');
                    this.templates.set(templateName, Handlebars.compile(templateContent));
                }
            });
        }
    }
    async sendEmailDirectly(to, subject, html) {
        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_FROM || 'noreply@example.com',
                to,
                subject,
                html,
            });
        }
        catch (error) {
            console.error('Failed to send email:', error);
            throw error;
        }
    }
    async sendEmail(userId, content, template) {
        try {
            const userEmail = await this.getUserEmail(userId);
            if (!userEmail) {
                throw new Error(`Email not found for user: ${userId}`);
            }
            const emailContent = template
                ? this.formatEmail(template, content)
                : content;
            await this.transporter.sendMail({
                from: process.env.SMTP_FROM,
                to: userEmail,
                subject: template?.subject || 'Notification',
                html: emailContent
            });
            console.log(`Email sent successfully to ${userEmail}`);
        }
        catch (error) {
            console.error('Failed to send email:', error);
            throw error;
        }
    }
    async getUserEmail(userId) {
        // TODO: 사용자 이메일 조회 구현
        return 'user@example.com';
    }
    formatEmail(template, content) {
        return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${template.subject}</h1>
            </div>
            <div class="content">
              ${content}
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    }
    async verifyConnection() {
        try {
            await this.transporter.verify();
            return true;
        }
        catch (error) {
            console.error('SMTP connection verification failed:', error);
            return false;
        }
    }
    getQueueUI() {
        const serverAdapter = new ExpressAdapter();
        createBullBoard({
            queues: [new BullAdapter(this.emailQueue)],
            serverAdapter,
        });
        return serverAdapter.getRouter();
    }
}
