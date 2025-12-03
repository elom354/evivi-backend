import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResult } from '@app/common/utils';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Cas 1: ErrorResult personnalisé
    if (exception instanceof ErrorResult) {
      const httpCode = this.getHttpStatusFromErrorCode(exception.code);

      return response.status(httpCode).json({
        success: false,
        errors: exception.details,
        timestamp: new Date().toISOString(),
      });
    }

    // Cas 2: HttpException de NestJS
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      return response.status(status).json({
        success: false,
        ...(typeof exceptionResponse === 'object'
          ? exceptionResponse
          : { message: exceptionResponse }),
        timestamp: new Date().toISOString(),
      });
    }

    // Cas 3: Erreur inconnue (500)
    console.error('Unhandled exception:', exception);

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      errors: [
        {
          code: 500_000,
          clean_message: 'Une erreur interne est survenue',
          message: 'Une erreur interne est survenue',
        },
      ],
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Convertit le code d'erreur en code HTTP approprié
   */
  private getHttpStatusFromErrorCode(code: number): number {
    const prefix = Math.floor(code / 1000);

    switch (prefix) {
      case 400:
        return HttpStatus.BAD_REQUEST;
      case 401:
        return HttpStatus.UNAUTHORIZED;
      case 403:
        return HttpStatus.FORBIDDEN;
      case 404:
        return HttpStatus.NOT_FOUND;
      case 409:
        return HttpStatus.CONFLICT;
      case 422:
        return HttpStatus.UNPROCESSABLE_ENTITY;
      case 500:
        return HttpStatus.INTERNAL_SERVER_ERROR;
      default:
        return HttpStatus.BAD_REQUEST;
    }
  }
}
