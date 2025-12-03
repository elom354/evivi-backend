import { ObjectUtils } from '@app/common/utils';
import { AppConfig } from '@app/core/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NextFunction, Request, Response } from 'express';
import * as mongoSanitize from 'express-mongo-sanitize';
import { ApiAppModule } from './app.module';
import { AllExceptionsFilter } from '@app/common/utils/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(ApiAppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  const config = app.get(ConfigService<AppConfig, true>);

  const globalPrefix = config.get('API_APP_PREFIX', {
    infer: true,
  });
  const allowedOrigins = (
    config.get('GLOBAL_CORS', { infer: true }) ?? '*'
  ).split(',');

  app.setGlobalPrefix(globalPrefix);
  app.disable('x-powered-by');
  app.set('trust proxy', 'loopback');

  app.enableCors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes('*')) {
        return callback(null, true);
      }

      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error(''), false);
      }

      return callback(null, true);
    },
  });

  const baseUrl = config.get('API_APP_BASE_URL', { infer: true });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Backend DEYDEY')
    .setDescription('API documentation for deydey academic ')
    .setVersion('1.0.0')
    .addServer(`${baseUrl}/${globalPrefix}`)
    .addBearerAuth()
    .addTag('Deydey API')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig, {
      ignoreGlobalPrefix: true,
    });
  SwaggerModule.setup('docs/api/v1', app, documentFactory);

  app.use(
    mongoSanitize({
      allowDots: true,
      replaceWith: '_',
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Remove Mongodb special keys from request body (deep)
  app.use((req: Request, _: Response, next: NextFunction) => {
    const keys = ['createdAt', 'updatedAt', '__v', 'deleted', 'deletedAt'];
    req.body = ObjectUtils.removeKeys(req.body as Record<string, any>, keys);
    next();
  });

  // Parse [page], [limit] and [query] in req.query and set [skip]
  app.use((req: Request, _: Response, next: NextFunction) => {
    const {
      page = '1',
      limit = '20',
      query = '',
      type = '',
      countryCode = '',
    } = req.query;

    let parsedPage = parseInt(page as string, 10);
    let parsedLimit = parseInt(limit as string, 10);

    if (Number.isNaN(parsedPage) || parsedPage < 1) {
      parsedPage = 1;
    }

    if (Number.isNaN(parsedLimit) || parsedLimit < 1) {
      parsedLimit = 20;
    }

    req.filterQuery = {
      page: parsedPage,
      limit: parsedLimit,
      skip: (parsedPage - 1) * parsedLimit,
      query: query as string,
      type: type as string,
      countryCode: countryCode as string,
    };

    next();
  });

  const port = config.get('API_APP_PORT', { infer: true });
  const host = config.get('API_APP_HOST', { infer: true });

  await app.listen(port, host);
  Logger.log(`🚀 Application is running on: ${baseUrl}/${globalPrefix};`);
}
bootstrap();
