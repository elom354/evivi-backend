import { LeanedDocument } from '@app/core/providers/base.mongo.repository';
import { User, OTP_METHOD } from '@app/user/infrastructure/models';

// Types pour les inputs
export interface RegisterInput {
  firstname: string;
  lastname: string;
  gender: string;
  email: string;
  phone: string;
  phoneCountryCode?: string;
  password: string;
  otpMethod?: OTP_METHOD;
}

export interface LoginInput {
  identifier: string; // email ou phone
  password: string;
}

export interface VerifyOtpInput {
  userId: string;
  code: string;
}

export interface ResendOtpInput {
  userId: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
}

export interface ChangePasswordInput {
  userId: string;
  oldPassword: string;
  newPassword: string;
}

export interface RefreshTokenInput {
  refreshToken: string;
}

// Types pour les outputs
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
}

export interface AuthResponse {
  user: LeanedDocument<User>;
  tokens: AuthTokens;
}

export interface LoginResponse extends AuthResponse {
  message: string;
}

export interface RegisterResponse {
  user: LeanedDocument<User>;
  message: string;
  requiresVerification: boolean;
}

export interface ForgotPasswordResponse {
  message: string;
  email: string;
}

export interface ResetPasswordResponse {
  message: string;
  success: boolean;
}

export interface VerifyOtpResponse {
  user: LeanedDocument<User>;
  tokens: AuthTokens;
  message: string;
}

// JWT Payload
export interface JwtPayload {
  sub: string; // userId
  email: string;
  isAdmin: boolean;
  iat?: number;
  exp?: number;
}

export interface JwtRefreshPayload {
  sub: string;
  tokenVersion?: number;
  iat?: number;
  exp?: number;
}

// Types pour la validation
export interface TokenValidationResult {
  valid: boolean;
  payload?: JwtPayload;
  error?: string;
}

export interface PasswordResetToken {
  userId: string;
  token: string;
  expiresAt: Date;
}
