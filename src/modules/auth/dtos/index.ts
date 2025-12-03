// Request DTOs
export {
  RegisterDto,
  VerifyOtpDto,
  ResendOtpDto,
  LoginDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from './requests/auth-requests.dto';

// Response DTOs
export {
  UserDto,
  TokensDto,
  RegisterResponseDto,
  VerifyOtpResponseDto,
  LoginResponseDto,
  LogoutResponseDto,
  RefreshTokenResponseDto,
  ForgotPasswordResponseDto,
  ResetPasswordResponseDto,
  ChangePasswordResponseDto,
} from './responses/auth-responses.dto';
