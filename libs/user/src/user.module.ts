import { Module } from '@nestjs/common';
import { LibUserDomainModule } from './domain/domain.module';
import { LibUserInfrastructureModule } from './infrastructure/infrastructure.module';

@Module({
  imports: [LibUserInfrastructureModule, LibUserDomainModule],
  exports: [LibUserDomainModule, LibUserInfrastructureModule],
})
export class UserModule {}
