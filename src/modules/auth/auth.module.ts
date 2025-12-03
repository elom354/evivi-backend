import { Module } from '@nestjs/common';
import { LibAuthModule } from '@app/auth/auth.module';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [LibAuthModule], 
  controllers: [AuthController],
})
export class ApiAuthModule {}
