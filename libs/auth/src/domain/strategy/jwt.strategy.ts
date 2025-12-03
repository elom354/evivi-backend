import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AppConfig } from '@app/core/config';
import { LeanedDocument } from '@app/core/providers/base.mongo.repository';
import { User } from '@app/user/infrastructure/models';
import { UserRepository } from '@app/user/infrastructure/repositories';
import { JwtPayload } from '../types/auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly config: ConfigService<AppConfig, true>,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('LIB_USER_JWT_SECRET', { infer: true }),
      issuer: config.get('LIB_USER_JWT_ISSUER', { infer: true }),
    });
  }

  async validate(payload: JwtPayload): Promise<LeanedDocument<User>> {
    const user = await this.userRepository.getById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    if (!user.emailVerified && !user.phoneVerified) {
      throw new UnauthorizedException('Compte non vérifié');
    }

    return user;
  }
}
