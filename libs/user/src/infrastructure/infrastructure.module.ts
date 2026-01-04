import { Module } from '@nestjs/common';
import { UserRepository, GalleryRepository } from './repositories';
import { LibCoreModule } from '@app/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelsMainProviders } from '@app/notification/infrastructure/models';
import { MAIN_DATABASE_CONNECTION_NAME } from '@app/common/constants';

@Module({
  imports: [
    LibCoreModule,
    MongooseModule.forFeature(
      ModelsMainProviders,
      MAIN_DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [UserRepository, GalleryRepository],
  exports: [UserRepository, GalleryRepository],
})
export class LibUserInfrastructureModule {}
