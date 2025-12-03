import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsEnum,
  IsOptional,
  Length
} from 'class-validator';
import { OTP_METHOD } from '@app/user/infrastructure/models';

/**
 * DTO pour l'inscription d'un nouvel utilisateur
 */
export class RegisterDto {
  @ApiProperty({
    type: String,
    description: "Le prénom de l'utilisateur",
    example: 'John',
  })
  @IsString({ message: 'Le prénom doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le prénom est obligatoire' })
  firstname: string;

  @ApiProperty({
    type: String,
    description: "Le nom de famille de l'utilisateur",
    example: 'Doe',
  })
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le nom est obligatoire' })
  lastname: string;

  @ApiProperty({
    type: String,
    description: "Le sexe de l'utilisateur",
    enum: ['M', 'F'],
    example: 'M',
  })
  @IsEnum(['M', 'F'], { message: "Le sexe doit être 'M' ou 'F'" })
  @IsNotEmpty({ message: 'Le sexe est obligatoire' })
  gender: string;

  @ApiProperty({
    type: String,
    format: 'email',
    description: "L'adresse e-mail de l'utilisateur",
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: "L'adresse e-mail n'est pas valide" })
  @IsNotEmpty({ message: "L'adresse e-mail est obligatoire" })
  email: string;

  @ApiProperty({
    type: String,
    description: "Le numéro de téléphone de l'utilisateur",
    example: '+22899223344',
  })
  @IsString({ message: 'Le numéro de téléphone doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le numéro de téléphone est obligatoire' })
  phone: string;

  @ApiProperty({
    type: String,
    description: "L'indicatif du pays",
    example: '+228',
    required: false,
  })
  @IsString({ message: "L'indicatif du pays doit être une chaîne de caractères" })
  @IsOptional()
  phoneCountryCode?: string;

  @ApiProperty({
    type: String,
    description: "Le mot de passe de l'utilisateur",
    example: 'Strong@Password123',
    minLength: 8,
  })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  @IsNotEmpty({ message: 'Le mot de passe est obligatoire' })
  password: string;

  @ApiProperty({
    type: String,
    enum: OTP_METHOD,
    description: 'Méthode de vérification OTP',
    example: OTP_METHOD.EMAIL,
    required: false,
  })
  @IsEnum(OTP_METHOD, { message: 'La méthode OTP doit être email ou sms' })
  @IsOptional()
  otpMethod?: OTP_METHOD = OTP_METHOD.EMAIL;
}

/**
 * DTO pour la vérification OTP
 */
export class VerifyOtpDto {
  @ApiProperty({
    type: String,
    description: "L'identifiant de l'utilisateur",
    example: '507f1f77bcf86cd799439011',
  })
  @IsString({ message: "L'identifiant utilisateur doit être une chaîne de caractères" })
  @IsNotEmpty({ message: "L'identifiant utilisateur est obligatoire" })
  userId: string;

  @ApiProperty({
    type: String,
    description: 'Le code OTP à vérifier',
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  @IsString({ message: 'Le code OTP doit être une chaîne de caractères' })
  @Length(6, 6, { message: 'Le code OTP doit contenir exactement 6 caractères' })
  @IsNotEmpty({ message: 'Le code OTP est obligatoire' })
  code: string;
}

/**
 * DTO pour le renvoi d'OTP
 */
export class ResendOtpDto {
  @ApiProperty({
    type: String,
    description: "L'identifiant de l'utilisateur",
    example: '507f1f77bcf86cd799439011',
  })
  @IsString({ message: "L'identifiant utilisateur doit être une chaîne de caractères" })
  @IsNotEmpty({ message: "L'identifiant utilisateur est obligatoire" })
  userId: string;
}

/**
 * DTO pour la connexion
 */
export class LoginDto {
  @ApiProperty({
    type: String,
    description: "Email ou numéro de téléphone de l'utilisateur",
    example: 'john.doe@example.com',
  })
  @IsString({ message: "L'identifiant doit être une chaîne de caractères" })
  @IsNotEmpty({ message: "L'identifiant est obligatoire" })
  identifier: string;

  @ApiProperty({
    type: String,
    description: "Le mot de passe de l'utilisateur",
    example: 'Strong@Password123',
  })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le mot de passe est obligatoire' })
  password: string;
}

/**
 * DTO pour le rafraîchissement de token
 */
export class RefreshTokenDto {
  @ApiProperty({
    type: String,
    description: 'Le token de rafraîchissement',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString({ message: 'Le token de rafraîchissement doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le token de rafraîchissement est obligatoire' })
  refreshToken: string;
}

/**
 * DTO pour la demande de réinitialisation de mot de passe
 */
export class ForgotPasswordDto {
  @ApiProperty({
    type: String,
    format: 'email',
    description: "L'adresse e-mail de l'utilisateur",
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: "L'adresse e-mail n'est pas valide" })
  @IsNotEmpty({ message: "L'adresse e-mail est obligatoire" })
  email: string;
}

/**
 * DTO pour la réinitialisation de mot de passe
 */
export class ResetPasswordDto {
  @ApiProperty({
    type: String,
    description: 'Le token de réinitialisation',
    example: 'a1b2c3d4e5f6...',
  })
  @IsString({ message: 'Le token doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le token est obligatoire' })
  token: string;

  @ApiProperty({
    type: String,
    description: 'Le nouveau mot de passe',
    example: 'NewStrong@Password123',
    minLength: 8,
  })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  @IsNotEmpty({ message: 'Le mot de passe est obligatoire' })
  password: string;
}

/**
 * DTO pour le changement de mot de passe
 */
export class ChangePasswordDto {
  @ApiProperty({
    type: String,
    description: "L'ancien mot de passe",
    example: 'OldPassword123',
  })
  @IsString({ message: "L'ancien mot de passe doit être une chaîne de caractères" })
  @IsNotEmpty({ message: "L'ancien mot de passe est obligatoire" })
  oldPassword: string;

  @ApiProperty({
    type: String,
    description: 'Le nouveau mot de passe',
    example: 'NewStrong@Password123',
    minLength: 8,
  })
  @IsString({ message: 'Le nouveau mot de passe doit être une chaîne de caractères' })
  @MinLength(8, { message: 'Le nouveau mot de passe doit contenir au moins 8 caractères' })
  @IsNotEmpty({ message: 'Le nouveau mot de passe est obligatoire' })
  newPassword: string;
}
