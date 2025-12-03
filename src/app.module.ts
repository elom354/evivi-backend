import { LibCoreModule } from '@app/core';
import { Module } from '@nestjs/common';
// import { ApiUserAccessControlModule } from './modules/access-control/access-control.module';
// import { ApiCoreModule } from './modules/core/core.module';
import { APP_GUARD } from '@nestjs/core';
import { ApiJournalModule } from './modules/journal/journal.module';
// import { ApiKeyGuard } from '@app/user-access-control/domain/services/api-key.guard';

@Module({
  imports: [
    LibCoreModule,
    // ApiCoreModule,
    // ApiUserAccessControlModule,
    ApiJournalModule,
  ],
  providers: [
    // {
    //   // provide: APP_GUARD,
    //   // useClass: ApiKeyGuard,
    // },
  ],
})
export class ApiAppModule {}
