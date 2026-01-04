import { LibJournalModule } from '@app/journal';
import { LibUserDomainModule } from '@app/user/domain/domain.module';
import { Module } from '@nestjs/common';
import { GalleryController } from './controllers';

@Module({
  imports: [LibUserDomainModule, LibJournalModule],
  controllers: [GalleryController],
})
export class ApiGalleryModule {}
