import { Module } from '@nestjs/common';
import { LibAuthDomainModule } from './domain/domain.module';
import { LibAUthInfrastructureModule } from './infrastructure/infrastructure.module';

@Module({
  imports: [LibAUthInfrastructureModule, LibAuthDomainModule],
  exports: [LibAuthDomainModule],
})
export class LibAuthModule {}
