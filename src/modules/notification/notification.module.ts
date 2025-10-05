import { LibJournalModule } from '@app/journal';
import { LibNotificationModule } from '@app/notification';
import { Module } from '@nestjs/common';
import { AdminEmailTemplateController } from './controllers/admin';
import { UserNotificationController } from './controllers/user';

@Module({
  imports: [LibNotificationModule, LibJournalModule],
  controllers: [UserNotificationController, AdminEmailTemplateController],
})
export class ApiNotificationModule {}
