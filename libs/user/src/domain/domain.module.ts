import { LibCoreModule } from '@app/core';
import { OtpService } from '@app/core/services/sms/otp.service';
import { LibNotificationModule } from '@app/notification';
import { Module } from '@nestjs/common';
import { LibUserInfrastructureModule } from '../infrastructure/infrastructure.module';
import { GalleryService } from './services/gallery/gallery.service';
import { UserService } from './services/user/user.service';

@Module({
  imports: [LibCoreModule, LibNotificationModule, LibUserInfrastructureModule],
  providers: [UserService, OtpService, GalleryService],
  exports: [
    UserService,
    OtpService,
    GalleryService,
    LibUserInfrastructureModule,
  ],
})
export class LibUserDomainModule {}
