import { MAIN_DATABASE_CONNECTION_NAME } from '@app/common/constants';
import { LibCoreModule } from '@app/core';
import { ModelsMainProviders } from '@app/notification/infrastructure/models';
import { LibUserInfrastructureModule } from '@app/user/infrastructure/infrastructure.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    LibCoreModule,
    LibUserInfrastructureModule,
    MongooseModule.forFeature(
      ModelsMainProviders,
      MAIN_DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [],
  exports: [LibUserInfrastructureModule],
})
export class LibAUthInfrastructureModule {}
