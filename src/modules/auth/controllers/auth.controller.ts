import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import {
  RegisterDto,
  RegisterResponseDto,
  VerifyOtpDto,
  VerifyOtpResponseDto,
  ResendOtpDto,
  LoginDto,
  LoginResponseDto,
  RefreshTokenDto,
  RefreshTokenResponseDto,
  ForgotPasswordDto,
  ForgotPasswordResponseDto,
  ResetPasswordDto,
  ResetPasswordResponseDto,
  ChangePasswordDto,
  ChangePasswordResponseDto,
  LogoutResponseDto,
} from '../dtos/index';
import { AuthService } from '@app/auth/domain/services/auth.service';
import { CurrentUser, Public } from '@app/auth/domain';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: "Inscription d'un nouvel utilisateur" })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: RegisterResponseDto })
  @ApiResponse({ status: '4XX', description: 'Erreur de validation' })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<RegisterResponseDto> {
    try {
      const result = await this.authService.register(dto);
      return new RegisterResponseDto(result);
    } catch (error) {
      throw error;
    }
  }

  @Public()
  @ApiOperation({ summary: "Vérification du code OTP après l'inscription" })
  @ApiBody({ type: VerifyOtpDto })
  @ApiResponse({ status: HttpStatus.OK, type: VerifyOtpResponseDto })
  @ApiResponse({ status: '4XX', description: 'Code OTP invalide' })
  @HttpCode(HttpStatus.OK)
  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto): Promise<VerifyOtpResponseDto> {
    try {
      const result = await this.authService.verifyOtp(dto);
      return new VerifyOtpResponseDto(result);
    } catch (error) {
      throw error;
    }
  }

  @Public()
  @ApiOperation({ summary: 'Renvoyer un code OTP' })
  @ApiBody({ type: ResendOtpDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OTP renvoyé avec succès',
  })
  @ApiResponse({ status: '4XX', description: 'Erreur lors du renvoi' })
  @HttpCode(HttpStatus.OK)
  @Post('resend-otp')
  async resendOtp(@Body() dto: ResendOtpDto): Promise<{ message: string }> {
    try {
      return await this.authService.resendOtp(dto);
    } catch (error) {
      throw error;
    }
  }

  @Public()
  @ApiOperation({ summary: 'Connexion utilisateur' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: HttpStatus.OK, type: LoginResponseDto })
  @ApiResponse({ status: '4XX', description: 'Identifiants incorrects' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    try {
      const result = await this.authService.login(dto);
      return new LoginResponseDto(result);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Déconnexion utilisateur' })
  @ApiResponse({ status: HttpStatus.OK, type: LogoutResponseDto })
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@CurrentUser('_id') userId: string): Promise<LogoutResponseDto> {
    try {
      const result = await this.authService.logout(userId.toString());
      return new LogoutResponseDto(result);
    } catch (error) {
      throw error;
    }
  }

  @Public()
  @ApiOperation({ summary: 'Rafraîchir les tokens JWT' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: HttpStatus.OK, type: RefreshTokenResponseDto })
  @ApiResponse({ status: '4XX', description: 'Token invalide ou expiré' })
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  async refreshToken(
    @Body() dto: RefreshTokenDto,
  ): Promise<RefreshTokenResponseDto> {
    try {
      const result = await this.authService.refreshTokens(dto);
      return new RefreshTokenResponseDto(result);
    } catch (error) {
      throw error;
    }
  }

  @Public()
  @ApiOperation({ summary: 'Demande de réinitialisation de mot de passe' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: HttpStatus.OK, type: ForgotPasswordResponseDto })
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponseDto> {
    try {
      const result = await this.authService.forgotPassword(dto);
      return new ForgotPasswordResponseDto(result);
    } catch (error) {
      throw error;
    }
  }

  @Public()
  @ApiOperation({ summary: 'Réinitialisation du mot de passe' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: HttpStatus.OK, type: ResetPasswordResponseDto })
  @ApiResponse({ status: '4XX', description: 'Token invalide ou expiré' })
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(
    @Body() dto: ResetPasswordDto,
  ): Promise<ResetPasswordResponseDto> {
    try {
      const result = await this.authService.resetPassword(dto);
      return new ResetPasswordResponseDto(result);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary: 'Changement de mot de passe (utilisateur connecté)',
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ status: HttpStatus.OK, type: ChangePasswordResponseDto })
  @ApiResponse({ status: '4XX', description: 'Ancien mot de passe incorrect' })
  @HttpCode(HttpStatus.OK)
  @Post('change-password')
  async changePassword(
    @CurrentUser('_id') userId: string,
    @Body() dto: ChangePasswordDto,
  ): Promise<ChangePasswordResponseDto> {
    try {
      const result = await this.authService.changePassword({
        ...dto,
        userId: userId.toString(),
      });
      return new ChangePasswordResponseDto(result);
    } catch (error) {
      throw error;
    }
  }
}
