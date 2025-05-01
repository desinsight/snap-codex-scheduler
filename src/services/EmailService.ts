import { NotificationTemplate } from '../types/notification';

interface EmailConfig {
  provider: 'sendgrid' | 'ses';
  apiKey: string;
  fromEmail: string;
  fromName: string;
}

class EmailService {
  private static instance: EmailService;
  private config: EmailConfig;

  private constructor(config: EmailConfig) {
    this.config = config;
  }

  public static getInstance(config: EmailConfig): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService(config);
    }
    return EmailService.instance;
  }

  private async sendWithSendGrid(to: string, subject: string, html: string) {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: {
          email: this.config.fromEmail,
          name: this.config.fromName,
        },
        subject,
        content: [{ type: 'text/html', value: html }],
      }),
    });

    if (!response.ok) {
      throw new Error(`SendGrid API error: ${response.statusText}`);
    }
  }

  private async sendWithSES(to: string, subject: string, html: string) {
    const response = await fetch('https://email.us-east-1.amazonaws.com/v2/email/outbound-emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        FromEmailAddress: this.config.fromEmail,
        Destination: { ToAddresses: [to] },
        Content: {
          Simple: {
            Subject: { Data: subject },
            Body: { Html: { Data: html } },
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`AWS SES API error: ${response.statusText}`);
    }
  }

  public async sendEmail(
    to: string,
    template: NotificationTemplate,
    variables: Record<string, string>
  ) {
    const html = this.renderTemplate(template.content, variables);

    try {
      if (this.config.provider === 'sendgrid') {
        await this.sendWithSendGrid(to, template.subject || '', html);
      } else {
        await this.sendWithSES(to, template.subject || '', html);
      }

      return { success: true };
    } catch (error) {
      console.error('이메일 전송 실패:', error);
      return { success: false, error };
    }
  }

  private renderTemplate(template: string, variables: Record<string, string>): string {
    return template.replace(/\${(\w+)}/g, (_, key) => variables[key] || '');
  }
}

export default EmailService;
