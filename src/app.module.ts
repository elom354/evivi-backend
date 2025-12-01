import { LibCoreModule } from '@app/core';
import { Module } from '@nestjs/common';
import { ApiUserAccessControlModule } from './modules/access-control/access-control.module';
import { ApiAuthModule } from './modules/auth/auth.module';
import { ApiCoreModule } from './modules/core/core.module';
import { ApiJournalModule } from './modules/journal/journal.module';

@Module({
  imports: [
    // LibCoreModule,
    // ApiCoreModule,
    ApiAuthModule,
    // ApiUserAccessControlModule,
    ApiJournalModule,
  ],
})
export class ApiAppModule {}
