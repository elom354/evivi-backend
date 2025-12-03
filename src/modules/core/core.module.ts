import { LibJournalModule } from '@app/journal';
import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ExpectionHandlerFilter } from './exceptions';
import { ResponseTransformerInterceptor } from './interceptors/response/transformer';
import { ResponseValidationInterceptor } from './interceptors/response/validator';
import { WinstonLogger } from './services/logger/winston';

@Module({
  imports: [
    LibJournalModule,
  ],
  providers: [
    // { provide: APP_GUARD, useClass: AuthGuard },

    { provide: APP_INTERCEPTOR, useClass: ResponseTransformerInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ResponseValidationInterceptor },
    { provide: APP_FILTER, useClass: ExpectionHandlerFilter },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    },
    WinstonLogger,
    ExpectionHandlerFilter,
  ],
})
export class ApiCoreModule {}
