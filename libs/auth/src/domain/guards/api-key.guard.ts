import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const apiKey = this.extractApiKey(request);

    if (!apiKey) {
      throw new UnauthorizedException('API Key is required');
    }

    const validApiKey = this.configService.get<string>('API_KEY');

    if (apiKey !== validApiKey) {
      throw new UnauthorizedException('Invalid API Key');
    }

    return true;
  }

  private extractApiKey(request: Request): string | undefined {
    const apiKeyHeader = this.configService.get<string>(
      'API_KEY_HEADER',
      'x-api-key',
    );

    // Try to get from header first
    const headerKey = request.headers[apiKeyHeader.toLowerCase()] as string;
    if (headerKey) {
      return headerKey;
    }

    // Try to get from query parameter
    const queryKey = request.query[apiKeyHeader] as string;
    if (queryKey) {
      return queryKey;
    }

    // Try to get from body
    const bodyKey = (request.body as Record<string, unknown>)?.[
      apiKeyHeader
    ] as string;
    if (bodyKey) {
      return bodyKey;
    }

    return undefined;
  }
}
