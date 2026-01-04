import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { LibCoreModule } from '@app/core';
import { ApiKeyGuard } from '@app/auth/domain/guards/api-key.guard';
import { JwtAuthGuard } from '@app/auth/domain/guards/jwt-auth.guard';

import { ApiJournalModule } from './modules/journal/journal.module';
import { ApiAuthModule } from './modules/auth/auth.module';
import { ApiNotificationModule } from './modules/notification/notification.module';
import { ApiGalleryModule } from './modules/gallery/gallery.module';

@Module({
  imports: [
    LibCoreModule,
    ApiJournalModule,
    ApiNotificationModule,
    ApiAuthModule,
    ApiGalleryModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class ApiAppModule {}
