import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { LibCoreModule } from '@app/core';
import { LibNotificationModule } from '@app/notification';
import { UserModule } from '@app/user/user.module';
import { AppConfig } from '@app/core/config';

import { AuthService } from './services/auth.service';
import { JwtRefreshStrategy, JwtStrategy } from './strategy';

@Module({
  imports: [
    LibCoreModule,
    UserModule,
    LibNotificationModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService<AppConfig, true>) => ({
        secret: config.get('LIB_USER_JWT_SECRET', { infer: true }),
        signOptions: {
          issuer: config.get('LIB_USER_JWT_ISSUER', { infer: true }),
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService, PassportModule, JwtModule],
})
export class LibAuthDomainModule {}
