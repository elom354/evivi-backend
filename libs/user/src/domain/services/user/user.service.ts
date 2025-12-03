import { ErrorResult, validatePassword } from '@app/common/utils';
import { AppConfig } from '@app/core/config';
import { LeanedDocument } from '@app/core/providers/base.mongo.repository';
import { PasswordService } from '@app/core/services/password.service';
import { OtpService } from '@app/core/services/sms/otp.service';
import { NotifyService } from '@app/notification/infrastructure/services/notify.service';
import { OTP_METHOD, User, USER_STATUS } from '@app/user/infrastructure/models';
import { UserRepository } from '@app/user/infrastructure/repositories';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type CreateUserOptions = Record<string, any> & {
  isAdmin?: boolean;
  otpMethod?: OTP_METHOD;
};

export type PublicUser = Omit<
  LeanedDocument<User>,
  'password' | 'passwordSalt' | 'otpCode'
>;

@Injectable()
export class UserService {
  private readonly canValidatePassword: boolean = false;
  private readonly defaultPassword: string;

  constructor(
    private readonly config: ConfigService<AppConfig, true>,
    private readonly notifyService: NotifyService,
    private readonly otpService: OtpService,
    private readonly userRepository: UserRepository,
  ) {
    this.canValidatePassword = this.config.get(
      'LIB_USER_PASSWORD_VALIDATION_ENABLED',
      { infer: true },
    );
    this.defaultPassword = this.config.get('LIB_USER_DEFAULT_PASSWORD', {
      infer: true,
    });
  }

  /** Create a new user */
  async create(
    input: Partial<User>,
    options: CreateUserOptions = {},
  ): Promise<LeanedDocument<User>> {
    const { isAdmin = false, otpMethod = OTP_METHOD.EMAIL } = options;

    if (this.canValidatePassword && input.password) {
      const passwordValidationResult = validatePassword(input.password);
      if (passwordValidationResult !== true) {
        throw new ErrorResult([
          {
            code: 400_061,
            clean_message: "Le mot de passe n'est pas sécurisé",
            message: "Le champ [password] n'est pas sécurisé",
          },
          ...passwordValidationResult.map((el) => ({
            code: el.code,
            clean_message: el.message,
            message: "Le champ [password] n'est pas sécurisé",
          })),
        ]);
      }
    }

    const existingEmail = await this.userRepository.getActiveByEmail(
      input.email!,
    );
    if (existingEmail) {
      throw new ErrorResult({
        code: 409_010,
        clean_message: "L'adresse e-mail est déjà utilisée",
        message: `L'adresse e-mail [${input.email}] est déjà utilisée`,
      });
    }

    const existingPhone = await this.userRepository.getActiveByPhone(
      input.phone!,
    );
    if (existingPhone) {
      throw new ErrorResult({
        code: 409_011,
        clean_message: 'Le numéro de téléphone est déjà utilisé',
        message: `Le numéro de téléphone [${input.phone}] est déjà utilisé`,
      });
    }

    const password = input.password || this.defaultPassword;
    const { salt, hashedPassword } = await this.hashPassword(password);

    const user = await this.userRepository.create({
      firstname: input.firstname!,
      lastname: input.lastname!,
      gender: input.gender!,
      email: input.email!,
      phone: input.phone!,
      phoneCountryCode: input.phoneCountryCode,
      password: hashedPassword,
      passwordSalt: salt,
      isAdmin: isAdmin ?? false,
      status: USER_STATUS.INACTIVE,
      emailVerified: false,
      phoneVerified: false,
    });

    const { code } = await this.otpService.createOtp(
      user._id.toString(),
      otpMethod,
    );

    const recipient = otpMethod === OTP_METHOD.EMAIL ? user.email : user.phone;
    await this.notifyService.sendOtp(
      otpMethod,
      recipient,
      code,
      user._id.toString(),
    );

    return user;
  }

  /**
   * Vérifie l'OTP et active le compte
   */
  async verifyOtp(userId: string, code: string): Promise<LeanedDocument<User>> {
    const isValid = await this.otpService.verifyOtp(userId, code);

    if (!isValid) {
      throw new ErrorResult({
        code: 400_073,
        clean_message: 'Code OTP invalide',
        message: 'Le code OTP fourni est invalide',
      });
    }

    const user = await this.userRepository.getById(userId);

    if (!user) {
      throw new ErrorResult({
        code: 404_016,
        clean_message: 'Le compte est introuvable',
        message: `Le compte [${userId}] est introuvable`,
      });
    }

    const updateData: any = {
      status: USER_STATUS.ACTIVE,
    };

    if (user.otpMethod === OTP_METHOD.EMAIL) {
      updateData.emailVerified = true;
      updateData.emailVerifiedAt = new Date();
    } else if (user.otpMethod === OTP_METHOD.SMS) {
      updateData.phoneVerified = true;
      updateData.phoneVerifiedAt = new Date();
    }

    const updatedUser = await this.userRepository.updateById(
      userId,
      updateData,
    );

    if (!updatedUser) {
      throw new ErrorResult({
        code: 500_001,
        clean_message: 'Erreur lors de la mise à jour',
        message: 'Impossible de mettre à jour le compte',
      });
    }

    return updatedUser; 
  }

  /**
   * Renvoie un OTP
   */
  async resendOtp(userId: string): Promise<void> {
    const user = await this.userRepository.getById(userId);

    if (!user) {
      throw new ErrorResult({
        code: 404_016,
        clean_message: 'Le compte est introuvable',
        message: `Le compte [${userId}] est introuvable`,
      });
    }

    if (user.status === USER_STATUS.ACTIVE) {
      throw new ErrorResult({
        code: 400_074,
        clean_message: 'Compte déjà vérifié',
        message: 'Ce compte est déjà vérifié',
      });
    }

    const { code } = await this.otpService.resendOtp(userId);

    const recipient =
      user.otpMethod === OTP_METHOD.EMAIL ? user.email : user.phone;
    await this.notifyService.sendOtp(
      user.otpMethod || OTP_METHOD.EMAIL,
      recipient,
      code,
      user._id.toString(),
    );
  }

  async getById(
    id: string,
    isAdmin = false,
    active?: boolean,
  ): Promise<PublicUser> {
    const user = await this.userRepository.getById(id);

    if (!user) {
      throw new ErrorResult({
        code: 404_018,
        clean_message: "L'utilisateur est introuvable",
        message: `L'utilisateur [${id}] est introuvable`,
      });
    }

    if (isAdmin !== undefined && user.isAdmin !== isAdmin) {
      throw new ErrorResult({
        code: 404_018,
        clean_message: "L'utilisateur est introuvable",
        message: `L'utilisateur [${id}] est introuvable`,
      });
    }

    return this.getPublicInfo(user);
  }

  getPublicInfo(user: LeanedDocument<User>): PublicUser {
    const { password, passwordSalt, otpCode, ...userData } = user;
    return userData;
  }

  private hashPassword(password: string) {
    return PasswordService.hashPassword(password);
  }

  private isPasswordMatch(
    salt: string,
    password: string,
    hashedPassword: string,
  ) {
    return PasswordService.isPasswordMatch(salt, password, hashedPassword);
  }
}
