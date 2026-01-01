import { plainToInstance, Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  Validate,
  validateSync,
} from 'class-validator';
import * as ms from 'ms';

import { Environment, MailerClient } from '../types';

export class AppConfig {
  // ================================= GLOBAL
  @IsEnum(Environment)
  NODE_ENV: string;

  @IsString()
  @IsNotEmpty()
  GLOBAL_APP_NAME: string;

  @IsString()
  @IsNotEmpty()
  GLOBAL_APP_INSTANCE_NAME: string;

  @IsString()
  @IsNotEmpty()
  GLOBAL_MAIN_DATABASE_URI: string;

  @IsString()
  @IsNotEmpty()
  API_KEY: string;

  @IsString()
  @IsNotEmpty()
  API_KEY_HEADER: string;

  @IsString()
  @IsNotEmpty()
  GLOBAL_JOURNAL_DATABASE_URI: string;

  @IsString()
  @IsNotEmpty()
  GLOBAL_CORS: string = 'http://localhost:5173';

  // ================================= API APP
  @IsInt()
  @Min(0)
  @Max(65_535)
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  API_APP_PORT: number = 6000;

  @IsUrl({ require_protocol: true, require_tld: false })
  API_APP_BASE_URL: string;

  @IsString()
  @IsNotEmpty()
  API_APP_PREFIX: string;

  @IsString()
  @IsOptional()
  API_APP_HOST = '0.0.0.0';

  @IsString()
  @IsNotEmpty()
  API_APP_LOGS_DIRECTORY: string;

  // ================================= LIBRAIRIES
  // ------------- User
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  LIB_USER_PASSWORD_VALIDATION_ENABLED: boolean = false;

  @IsString()
  @IsNotEmpty()
  LIB_USER_DEFAULT_PASSWORD: string;

  @IsEmail()
  LIB_USER_DEFAULT_SUPER_ADMIN_EMAIL: string;

  @IsString()
  @IsNotEmpty()
  LIB_USER_DEFAULT_SUPER_ADMIN_PASSWORD: string;

  @IsInt()
  @Min(5)
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  LIB_USER_OTP_EXPIRES_IN_MIN: number = 10;

  @IsString()
  @IsOptional()
  LIB_USER_WHITELIST_EMAILS: string;

  @IsString()
  @IsNotEmpty()
  LIB_USER_WHITELIST_OTP: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  LIB_USER_TOKEN_VALIDATION_ENABLED: boolean = false;

  @IsString()
  @IsNotEmpty()
  LIB_USER_JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  LIB_USER_JWT_ISSUER: string;

  @IsString()
  @IsNotEmpty()
  @Validate(
    (value: ms.StringValue) => {
      const duration = ms(value);
      return typeof duration === 'number' && duration > 0;
    },
    {
      message:
        'LIB_USER_ACCESS_CONTROL_JWT_ACCESS_TOKEN_EXPIRES_IN must be a valid duration string (e.g.,"1d", "1h", "30m", "600s").',
    },
  )
  LIB_USER_JWT_TOKEN_EXPIRES_IN: ms.StringValue;

  @IsString()
  @IsNotEmpty()
  @Validate(
    (value: ms.StringValue) => {
      const duration = ms(value);
      return typeof duration === 'number' && duration > 0;
    },
    {
      message:
        'LIB_USER_ACCESS_CONTROL_JWT_REFRESH_TOKEN_EXPIRES_IN must be a valid duration string (e.g.,"1d", "1h", "30m", "600s").',
    },
  )
  LIB_USER_JWT_REFRESH_TOKEN_EXPIRES_IN: ms.StringValue;

  // Email Verification
  @IsInt()
  @Min(5)
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  LIB_USER_EMAIL_VERIFICATION_TOKEN_EXPIRES_IN_MIN: number = 10;

  // ------------- Journal
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  LIB_JOURNAL_ENABLED: boolean = false;

  @IsEnum(MailerClient)
  LIB_NOTIFICATION_MAILER_CLIENT_NAME: string;

  // Mailtrap
  // Dans votre AppConfig, remplacez toutes les configs mailer par :

  // ================================= NOTIFICATION
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  LIB_NOTIFICATION_EMAIL_ENABLED: boolean = false;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  LIB_NOTIFICATION_SMS_ENABLED: boolean = false;

  // Email Configuration (un seul provider)
  @IsString()
  @IsNotEmpty()
  LIB_NOTIFICATION_MAILER_HOST: string;

  @IsInt()
  @Min(0)
  @Max(65_535)
  @Transform(({ value }) => parseInt(value, 10))
  LIB_NOTIFICATION_MAILER_PORT: number = 587;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  LIB_NOTIFICATION_MAILER_SECURE: boolean = false;

  @IsString()
  @IsNotEmpty()
  LIB_NOTIFICATION_MAILER_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  LIB_NOTIFICATION_MAILER_PASSWORD: string;

  @IsEmail()
  LIB_NOTIFICATION_MAILER_DEFAULT_FROM: string;

  // Dans AppConfig, remplacez les configs SMS par :

  @IsString()
  @IsNotEmpty()
  LIB_NOTIFICATION_SMS_AFRIKSMS_API_KEY: string;

  @IsString()
  @IsNotEmpty()
  LIB_NOTIFICATION_SMS_AFRIKSMS_SENDER_NAME: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  LIB_USER_OTP_DEV_MODE: boolean = false;
}

export function validateConfig(payload: Record<string, any>) {
  const config = plainToInstance(AppConfig, payload, {
    exposeDefaultValues: true,
  });

  const errors = validateSync(config, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const message = errors
      .map((e) =>
        Object.values(e.constraints || {})
          .map((msg) => `- ${msg}`)
          .join('\n'),
      )
      .join('\n');

    throw new Error(
      `${AppConfig.name} environment variables validation failed\n${message}`,
    );
  }

  return config;
}
