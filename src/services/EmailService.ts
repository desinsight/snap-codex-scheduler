import nodemailer from 'nodemailer';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import Queue from 'bull';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { NotificationTemplate } from '../types/notification';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export class EmailService {
  private static instance: EmailService;
  private transporter: nodemailer.Transporter;
  private emailQueue: Queue.Queue;
  private templates: Map<string, Handlebars.TemplateDelegate>;

  private constructor() {
    this.initializeTransporter();
    this.initializeQueue();
    this.loadTemplates();
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  private initializeTransporter() {
    const config: EmailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    };

    this.transporter = nodemailer.createTransport(config);
  }

  private initializeQueue() {
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

  private loadTemplates() {
    this.templates = new Map();
    const templatesDir = path.join(__dirname, '../templates/email');

    if (fs.existsSync(templatesDir)) {
      const files = fs.readdirSync(templatesDir);
      files.forEach((file) => {
        if (file.endsWith('.hbs')) {
          const templateName = path.basename(file, '.hbs');
          const templateContent = fs.readFileSync(
            path.join(templatesDir, file),
            'utf-8'
          );
          this.templates.set(templateName, Handlebars.compile(templateContent));
        }
      });
    }
  }

  private async sendEmailDirectly(
    to: string,
    subject: string,
    html: string
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@example.com',
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  public async sendEmail(
    to: string,
    template: NotificationTemplate,
    variables: Record<string, string>
  ): Promise<void> {
    const templateFn = this.templates.get(template);
    if (!templateFn) {
      throw new Error(`Template ${template} not found`);
    }

    const html = templateFn(variables);
    const subject = variables.subject || 'Notification';

    await this.emailQueue.add({
      to,
      subject,
      html,
    });
  }

  public getQueueUI() {
    const serverAdapter = new ExpressAdapter();
    createBullBoard({
      queues: [new BullAdapter(this.emailQueue)],
      serverAdapter,
    });
    return serverAdapter.getRouter();
  }
}
