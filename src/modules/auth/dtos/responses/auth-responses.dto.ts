import {
  AuthTokens,
  ForgotPasswordResponse,
  LoginResponse,
  RegisterResponse,
  ResetPasswordResponse,
  VerifyOtpResponse,
} from '@app/auth/domain/types/auth.types';
import { LeanedDocument } from '@app/core/providers/base.mongo.repository';
import { User } from '@app/user/infrastructure/models';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de base pour les informations utilisateur publiques
 */
export class UserDto {
  @ApiProperty({ type: String, example: '507f1f77bcf86cd799439011' })
  _id: string;

  @ApiProperty({ type: String, example: 'Doe' })
  fullName: string;

  @ApiProperty({ type: String, example: 'M' })
  gender: string;

  @ApiProperty({ type: String, example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ type: String, example: '+22899223344' })
  phone: string;

  @ApiProperty({ type: String, example: '+228', required: false })
  phoneCountryCode?: string;

  @ApiProperty({ type: String, example: 'active' })
  status: string;

  @ApiProperty({ type: Boolean, example: false })
  emailVerified: boolean;

  @ApiProperty({ type: Boolean, example: false })
  phoneVerified: boolean;

  @ApiProperty({ type: Boolean, example: false })
  isAdmin: boolean;

  @ApiProperty({ type: Date, required: false })
  emailVerifiedAt?: Date;

  @ApiProperty({ type: Date, required: false })
  phoneVerifiedAt?: Date;

  @ApiProperty({ type: String, required: false })
  image?: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  constructor(user: LeanedDocument<User>) {
    this._id = user._id.toString();
    this.fullName = user.fullName;
    this.gender = user.gender;
    this.email = user.email;
    this.phone = user.phone;
    this.phoneCountryCode = user.phoneCountryCode;
    this.status = user.status;
    this.emailVerified = user.emailVerified;
    this.phoneVerified = user.phoneVerified;
    this.isAdmin = user.isAdmin;
    this.emailVerifiedAt = user.emailVerifiedAt;
    this.phoneVerifiedAt = user.phoneVerifiedAt;
    this.image = user.image;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}

/**
 * DTO pour les tokens d'authentification
 */
export class TokensDto {
  @ApiProperty({
    type: String,
    description: "Le token d'accès JWT",
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    type: String,
    description: 'Le token de rafraîchissement',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    type: Number,
    description: "Durée de validité du token d'accès en secondes",
    example: 3600,
  })
  expiresIn: number;

  @ApiProperty({
    type: Number,
    description: 'Durée de validité du token de rafraîchissement en secondes',
    example: 604800,
  })
  refreshExpiresIn: number;

  constructor(tokens: AuthTokens) {
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
    this.expiresIn = tokens.expiresIn;
    this.refreshExpiresIn = tokens.refreshExpiresIn;
  }
}

/**
 * DTO de réponse pour l'inscription
 */
export class RegisterResponseDto {
  @ApiProperty({ type: UserDto })
  user: UserDto;

  @ApiProperty({
    type: String,
    example:
      'Inscription réussie. Veuillez vérifier votre email pour le code de vérification.',
  })
  message: string;

  @ApiProperty({ type: Boolean, example: true })
  requiresVerification: boolean;

  constructor(response: RegisterResponse) {
    this.user = new UserDto(response.user);
    this.message = response.message;
    this.requiresVerification = response.requiresVerification;
  }
}

/**
 * DTO de réponse pour la vérification OTP
 */
export class VerifyOtpResponseDto {
  @ApiProperty({ type: UserDto })
  user: UserDto;

  @ApiProperty({ type: TokensDto })
  tokens: TokensDto;

  @ApiProperty({
    type: String,
    example: 'Compte vérifié avec succès.',
  })
  message: string;

  constructor(response: VerifyOtpResponse) {
    this.user = new UserDto(response.user);
    this.tokens = new TokensDto(response.tokens);
    this.message = response.message;
  }
}

/**
 * DTO de réponse pour la connexion
 */
export class LoginResponseDto {
  @ApiProperty({ type: UserDto })
  user: UserDto;

  @ApiProperty({ type: TokensDto })
  tokens: TokensDto;

  @ApiProperty({
    type: String,
    example: 'Connexion réussie',
  })
  message: string;

  constructor(response: LoginResponse) {
    this.user = new UserDto(response.user);
    this.tokens = new TokensDto(response.tokens);
    this.message = response.message;
  }
}

/**
 * DTO de réponse pour la déconnexion
 */
export class LogoutResponseDto {
  @ApiProperty({
    type: String,
    example: 'Déconnexion réussie',
  })
  message: string;

  constructor(response: { message: string }) {
    this.message = response.message;
  }
}

/**
 * DTO de réponse pour le rafraîchissement de token
 */
export class RefreshTokenResponseDto {
  @ApiProperty({ type: TokensDto })
  tokens: TokensDto;

  constructor(tokens: AuthTokens) {
    this.tokens = new TokensDto(tokens);
  }
}

/**
 * DTO de réponse pour la demande de réinitialisation de mot de passe
 */
export class ForgotPasswordResponseDto {
  @ApiProperty({
    type: String,
    example:
      'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.',
  })
  message: string;

  @ApiProperty({
    type: String,
    example: 'john.doe@example.com',
  })
  email: string;

  constructor(response: ForgotPasswordResponse) {
    this.message = response.message;
    this.email = response.email;
  }
}

/**
 * DTO de réponse pour la réinitialisation de mot de passe
 */
export class ResetPasswordResponseDto {
  @ApiProperty({
    type: String,
    example: 'Votre mot de passe a été réinitialisé avec succès.',
  })
  message: string;

  @ApiProperty({ type: Boolean, example: true })
  success: boolean;

  constructor(response: ResetPasswordResponse) {
    this.message = response.message;
    this.success = response.success;
  }
}

/**
 * DTO de réponse pour le changement de mot de passe
 */
export class ChangePasswordResponseDto {
  @ApiProperty({
    type: String,
    example: 'Votre mot de passe a été modifié avec succès.',
  })
  message: string;

  constructor(response: { message: string }) {
    this.message = response.message;
  }
}
