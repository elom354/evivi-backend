import { ModelDefinition } from '@nestjs/mongoose';

import { EmailTemplate, EmailTemplateSchema } from './emailTemplate';
import { UserNotification, UserNotificationSchema } from './userNotification';
import { User, UserSchema } from '@app/user/infrastructure/models';

export const ModelsMainProviders: ModelDefinition[] = [
  { name: EmailTemplate.name, schema: EmailTemplateSchema },
  { name: UserNotification.name, schema: UserNotificationSchema },
  { name: User.name, schema: UserSchema },
];
