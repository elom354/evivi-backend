import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import * as ms from 'ms';

import { ErrorResult } from '@app/common/utils';
import { AppConfig } from '@app/core/config';
import { LeanedDocument } from '@app/core/providers/base.mongo.repository';
import { PasswordService } from '@app/core/services/password.service';
import { OtpService } from '@app/core/services/sms/otp.service';
import { NotifyService } from '@app/notification/infrastructure/services/notify.service';
import { OTP_METHOD, User, USER_STATUS } from '@app/user/infrastructure/models';
import { UserRepository } from '@app/user/infrastructure/repositories';

import { UserService } from '@app/user/domain/services/user/user.service';
import {
  AuthResponse,
  AuthTokens,
  ChangePasswordInput,
  ForgotPasswordInput,
  ForgotPasswordResponse,
  JwtPayload,
  JwtRefreshPayload,
  LoginInput,
  LoginResponse,
  RefreshTokenInput,
  RegisterInput,
  RegisterResponse,
  ResendOtpInput,
  ResetPasswordInput,
  ResetPasswordResponse,
  TokenValidationResult,
  VerifyOtpInput,
  VerifyOtpResponse,
} from '../types/auth.types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly jwtSecret: string;
  private readonly jwtIssuer: string;
  private readonly jwtExpiresIn: string;
  private readonly jwtRefreshExpiresIn: string;

  constructor(
    private readonly config: ConfigService<AppConfig, true>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
    private readonly otpService: OtpService,
    private readonly notifyService: NotifyService,
  ) {
    this.jwtSecret = this.config.get('LIB_USER_JWT_SECRET', { infer: true });
    this.jwtIssuer = this.config.get('LIB_USER_JWT_ISSUER', { infer: true });
    this.jwtExpiresIn = this.config.get('LIB_USER_JWT_TOKEN_EXPIRES_IN', {
      infer: true,
    });
    this.jwtRefreshExpiresIn = this.config.get(
      'LIB_USER_JWT_REFRESH_TOKEN_EXPIRES_IN',
      { infer: true },
    );
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(input: RegisterInput): Promise<RegisterResponse> {
    this.logger.log(`Registering new user: ${input.email}`);

    // Créer l'utilisateur via UserService (qui gère l'envoi d'OTP)
    const user = await this.userService.create(input, {
      isAdmin: false,
      otpMethod: input.otpMethod || OTP_METHOD.EMAIL,
    });

    return {
      user,
      message:
        'Inscription réussie. Veuillez vérifier votre ' +
        (input.otpMethod === OTP_METHOD.SMS ? 'téléphone' : 'email') +
        ' pour le code de vérification.',
      requiresVerification: true,
    };
  }

  /**
   * Vérification de l'OTP après inscription
   */
  async verifyOtp(input: VerifyOtpInput): Promise<VerifyOtpResponse> {
    this.logger.log(`Verifying OTP for user: ${input.userId}`);

    // Vérifier l'OTP via UserService
    const user = await this.userService.verifyOtp(input.userId, input.code);

    // Générer les tokens après vérification réussie
    const tokens = await this.generateTokens(user);

    // Sauvegarder le token dans la base
    await this.userRepository.updateById(user._id.toString(), {
      token: tokens.accessToken,
    } as any);

    return {
      user,
      tokens,
      message: 'Compte vérifié avec succès.',
    };
  }

  /**
   * Renvoyer un code OTP
   */
  async resendOtp(input: ResendOtpInput): Promise<{ message: string }> {
    this.logger.log(`Resending OTP for user: ${input.userId}`);

    await this.userService.resendOtp(input.userId);

    return {
      message: 'Un nouveau code de vérification a été envoyé.',
    };
  }

  /**
   * Connexion utilisateur
   */
  async login(input: LoginInput): Promise<LoginResponse> {
    this.logger.log(`Login attempt for: ${input.identifier}`);

    // Identifier si c'est un email ou un phone
    const isEmail = input.identifier.includes('@');
    const user = isEmail
      ? await this.userRepository.getActiveByEmail(input.identifier)
      : await this.userRepository.getActiveByPhone(input.identifier);

    if (!user) {
      throw new ErrorResult({
        code: 401_001,
        clean_message: 'Identifiants incorrects',
        message: 'Email/Téléphone ou mot de passe incorrect',
      });
    }

    // Vérifier si le compte est actif
    if (user.status !== USER_STATUS.ACTIVE) {
      throw new ErrorResult({
        code: 403_001,
        clean_message: 'Compte non vérifié',
        message:
          'Votre compte doit être vérifié avant de pouvoir vous connecter',
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await PasswordService.isPasswordMatch(
      user.passwordSalt || '',
      input.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new ErrorResult({
        code: 401_001,
        clean_message: 'Identifiants incorrects',
        message: 'Email/Téléphone ou mot de passe incorrect',
      });
    }

    // Générer les tokens
    const tokens = await this.generateTokens(user);

    // Sauvegarder le token dans la base
    await this.userRepository.updateById(user._id.toString(), {
      token: tokens.accessToken,
    } as any);

    this.logger.log(`User logged in successfully: ${user.email}`);

    return {
      user,
      tokens,
      message: 'Connexion réussie',
    };
  }

  /**
   * Déconnexion utilisateur
   */
  async logout(userId: string): Promise<{ message: string }> {
    this.logger.log(`Logging out user: ${userId}`);

    // Révoquer le token en le supprimant
    await this.userRepository.updateById(userId, {
      token: null,
      sessionRevokedAt: new Date(),
    } as any);

    return {
      message: 'Déconnexion réussie',
    };
  }

  /**
   * Rafraîchir les tokens
   */
  async refreshTokens(input: RefreshTokenInput): Promise<AuthTokens> {
    this.logger.log('Refreshing tokens');

    try {
      // Vérifier et décoder le refresh token
      const payload = this.jwtService.verify<JwtRefreshPayload>(
        input.refreshToken,
        {
          secret: this.jwtSecret,
          issuer: this.jwtIssuer,
        },
      );

      // Récupérer l'utilisateur
      const user = await this.userRepository.getById(payload.sub);

      if (!user) {
        throw new ErrorResult({
          code: 401_003,
          clean_message: 'Token invalide',
          message: 'Le token de rafraîchissement est invalide',
        });
      }

      if (user.status !== USER_STATUS.ACTIVE) {
        throw new ErrorResult({
          code: 403_002,
          clean_message: 'Compte désactivé',
          message: 'Votre compte a été désactivé',
        });
      }

      // Générer de nouveaux tokens
      const tokens = await this.generateTokens(user);

      // Sauvegarder le nouveau token
      await this.userRepository.updateById(user._id.toString(), {
        token: tokens.accessToken,
      } as any);

      return tokens;
    } catch (error) {
      this.logger.error('Failed to refresh tokens', error);
      throw new ErrorResult({
        code: 401_003,
        clean_message: 'Token invalide',
        message: 'Le token de rafraîchissement est invalide ou expiré',
      });
    }
  }

  /**
   * Demande de réinitialisation de mot de passe
   */
  async forgotPassword(
    input: ForgotPasswordInput,
  ): Promise<ForgotPasswordResponse> {
    this.logger.log(`Password reset requested for: ${input.email}`);

    const user = await this.userRepository.getActiveByEmail(input.email);

    // Ne pas révéler si l'email existe ou non pour des raisons de sécurité
    if (!user) {
      return {
        message:
          'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.',
        email: input.email,
      };
    }

    // Générer un token de réinitialisation
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Expiration dans 1 heure
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Sauvegarder le token
    await this.userRepository.updateById(user._id.toString(), {
      passwordResetToken: hashedToken,
      passwordResetTokenExpiresAt: expiresAt,
    } as any);

    // Envoyer l'email avec le token (non hashé)
    await this.notifyService.notifyByEmail(
      'password-reset',
      {
        firstname: user.firstname,
        resetToken,
        resetLink: `${this.config.get('API_APP_BASE_URL')}/auth/reset-password?token=${resetToken}`,
      },
      user.email,
      user._id.toString(),
    );

    this.logger.log(`Password reset email sent to: ${input.email}`);

    return {
      message:
        'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.',
      email: input.email,
    };
  }

  /**
   * Réinitialisation du mot de passe
   */
  async resetPassword(
    input: ResetPasswordInput,
  ): Promise<ResetPasswordResponse> {
    this.logger.log('Processing password reset');

    // Hasher le token reçu pour comparaison
    const hashedToken = crypto
      .createHash('sha256')
      .update(input.token)
      .digest('hex');

    // Trouver l'utilisateur avec ce token
    const user = await this.userRepository.getOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      throw new ErrorResult({
        code: 400_075,
        clean_message: 'Token invalide ou expiré',
        message:
          'Le lien de réinitialisation est invalide ou a expiré. Veuillez en demander un nouveau.',
      });
    }

    // Hasher le nouveau mot de passe
    const { salt, hashedPassword } = await PasswordService.hashPassword(
      input.password,
    );

    // Mettre à jour le mot de passe et supprimer le token
    await this.userRepository.updateById(user._id.toString(), {
      password: hashedPassword,
      passwordSalt: salt,
      passwordResetToken: null,
      passwordResetTokenExpiresAt: null,
      sessionRevokedAt: new Date(), // Révoquer toutes les sessions
    } as any);

    // Envoyer un email de confirmation
    await this.notifyService.notifyByEmail(
      'password-changed',
      {
        firstname: user.firstname,
      },
      user.email,
      user._id.toString(),
    );

    this.logger.log(`Password reset successful for user: ${user.email}`);

    return {
      message: 'Votre mot de passe a été réinitialisé avec succès.',
      success: true,
    };
  }

  /**
   * Changement de mot de passe (utilisateur connecté)
   */
  async changePassword(
    input: ChangePasswordInput,
  ): Promise<{ message: string }> {
    this.logger.log(`Changing password for user: ${input.userId}`);

    const user = await this.userRepository.getById(input.userId);

    if (!user) {
      throw new ErrorResult({
        code: 404_016,
        clean_message: 'Utilisateur introuvable',
        message: 'Utilisateur introuvable',
      });
    }

    // Vérifier l'ancien mot de passe
    const isOldPasswordValid = await PasswordService.isPasswordMatch(
      user.passwordSalt || '',
      input.oldPassword,
      user.password,
    );

    if (!isOldPasswordValid) {
      throw new ErrorResult({
        code: 401_002,
        clean_message: 'Ancien mot de passe incorrect',
        message: "L'ancien mot de passe est incorrect",
      });
    }

    // Hasher le nouveau mot de passe
    const { salt, hashedPassword } = await PasswordService.hashPassword(
      input.newPassword,
    );

    // Mettre à jour le mot de passe
    await this.userRepository.updateById(user._id.toString(), {
      password: hashedPassword,
      passwordSalt: salt,
    } as any);

    // Envoyer un email de confirmation
    await this.notifyService.notifyByEmail(
      'password-changed',
      {
        firstname: user.firstname,
      },
      user.email,
      user._id.toString(),
    );

    this.logger.log(`Password changed successfully for user: ${user.email}`);

    return {
      message: 'Votre mot de passe a été modifié avec succès.',
    };
  }

  /**
   * Valider un token JWT
   */
  async validateToken(token: string): Promise<TokenValidationResult> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: this.jwtSecret,
        issuer: this.jwtIssuer,
      });

      // Vérifier que l'utilisateur existe toujours
      const user = await this.userRepository.getById(payload.sub);

      if (!user) {
        return {
          valid: false,
          error: 'User not found',
        };
      }

      if (user.status !== USER_STATUS.ACTIVE) {
        return {
          valid: false,
          error: 'User account is not active',
        };
      }

      // Vérifier si la session n'a pas été révoquée
      if (user.sessionRevokedAt && payload.iat) {
        const tokenIssuedAt = new Date(payload.iat * 1000);
        if (tokenIssuedAt < user.sessionRevokedAt) {
          return {
            valid: false,
            error: 'Token has been revoked',
          };
        }
      }

      return {
        valid: true,
        payload,
      };
    } catch (error) {
      this.logger.error('Token validation failed', error);
      return {
        valid: false,
        error: error.message,
      };
    }
  }

  /**
   * Récupérer l'utilisateur depuis un token
   */
  async getUserFromToken(token: string): Promise<LeanedDocument<User> | null> {
    const validation = await this.validateToken(token);

    if (!validation.valid || !validation.payload) {
      return null;
    }

    return this.userRepository.getById(validation.payload.sub);
  }

  /**
   * Générer les tokens d'authentification (access + refresh)
   */
  /**
   * Générer les tokens d'authentification (access + refresh)
   */
  private async generateTokens(
    user: LeanedDocument<User>,
  ): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      isAdmin: user.isAdmin,
    };

    const refreshPayload: JwtRefreshPayload = {
      sub: user._id.toString(),
    };

    // ✅ Utilisez un cast de type pour résoudre l'erreur TypeScript
    const accessTokenExpiresInSeconds = Math.floor(
      ms(this.jwtExpiresIn as ms.StringValue) / 1000,
    );
    const refreshTokenExpiresInSeconds = Math.floor(
      ms(this.jwtRefreshExpiresIn as ms.StringValue) / 1000,
    );

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.jwtSecret,
        issuer: this.jwtIssuer,
        expiresIn: accessTokenExpiresInSeconds,
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: this.jwtSecret,
        issuer: this.jwtIssuer,
        expiresIn: refreshTokenExpiresInSeconds,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: accessTokenExpiresInSeconds,
      refreshExpiresIn: refreshTokenExpiresInSeconds,
    };
  }
}
