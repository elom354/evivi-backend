import { LibCoreModule } from '@app/core';
import { OtpService } from '@app/core/services/sms/otp.service';
import { LibNotificationModule } from '@app/notification';
import { Module } from '@nestjs/common';
import { LibUserInfrastructureModule } from '../infrastructure/infrastructure.module';
import { UserService } from './services/user/user.service';

@Module({
  imports: [LibCoreModule, LibNotificationModule, LibUserInfrastructureModule],
  providers: [UserService, OtpService],
  exports: [UserService, OtpService, LibUserInfrastructureModule],
})
export class LibUserDomainModule {}
