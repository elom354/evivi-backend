import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendMailOptions } from 'nodemailer';
import { AppConfig } from '../../config';
import { MailerTransporter } from './transport';

@Injectable()
export class MailService {
  private readonly transporter: MailerTransporter;
  private readonly defaultFrom: string;

  constructor(private readonly config: ConfigService<AppConfig, true>) {
    this.defaultFrom = this.config.get('LIB_NOTIFICATION_MAILER_DEFAULT_FROM', {
      infer: true,
    });

    this.transporter = new MailerTransporter({
      host: this.config.get('LIB_NOTIFICATION_MAILER_HOST', { infer: true }),
      port: this.config.get('LIB_NOTIFICATION_MAILER_PORT', { infer: true }),
      secure: this.config.get('LIB_NOTIFICATION_MAILER_SECURE', { infer: true }),
      auth: {
        user: this.config.get('LIB_NOTIFICATION_MAILER_USERNAME', { infer: true }),
        pass: this.config.get('LIB_NOTIFICATION_MAILER_PASSWORD', { infer: true }),
      },
    });
  }

  async send(mailOptions: Omit<SendMailOptions, 'from'>) {
    await this.transporter.sendMail({
      ...mailOptions,
      from: this.defaultFrom,
    });
  }
}
