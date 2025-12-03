import { ErrorResult } from '@app/common/utils';
import { AppConfig } from '@app/core/config';
import { OTP_METHOD, User } from '@app/user/infrastructure/models';
import { UserRepository } from '@app/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private readonly otpExpiresInMin: number;
  private readonly whitelistOtp: string;

  constructor(
    private readonly config: ConfigService<AppConfig, true>,
    private readonly userRepository: UserRepository,
  ) {
    this.otpExpiresInMin = this.config.get('LIB_USER_OTP_EXPIRES_IN_MIN', {
      infer: true,
    });
    this.whitelistOtp = this.config.get('LIB_USER_WHITELIST_OTP', {
      infer: true,
    });
  }

  /**
   * Génère un code OTP aléatoire de 6 chiffres
   */
  generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Crée et sauvegarde un OTP pour un utilisateur
   */
  async createOtp(
    userId: string,
    method: OTP_METHOD,
  ): Promise<{ code: string; expiresAt: Date }> {
    const code = this.generateOtpCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.otpExpiresInMin);

    await this.userRepository.updateById(userId, {
      otpCode: code,
      otpExpiresAt: expiresAt as any,
      otpMethod: method,
      otpAttempts: 0,
    } as Partial<User>);

    return { code, expiresAt };
  }

  /**
   * Vérifie un code OTP
   */
  async verifyOtp(userId: string, code: string): Promise<boolean> {
    const user = await this.userRepository.getById(userId);

    if (!user) {
      throw new ErrorResult({
        code: 404_016,
        clean_message: 'Le compte est introuvable',
        message: `Le compte [${userId}] est introuvable`,
      });
    }

    // Vérifier si l'OTP est dans la whitelist (pour dev/test)
    if (code === this.whitelistOtp) {
      await this.clearOtp(userId);
      return true;
    }

    // Vérifier si l'OTP existe
    if (!user.otpCode || !user.otpExpiresAt) {
      throw new ErrorResult({
        code: 400_070,
        clean_message: 'Aucun code OTP actif',
        message: 'Aucun code OTP actif pour cet utilisateur',
      });
    }

    // Vérifier l'expiration - Convertir en timestamp pour comparaison
    const now = Date.now();
    const expiresAtTimestamp =
      user.otpExpiresAt instanceof Date
        ? user.otpExpiresAt.getTime()
        : new Date(user.otpExpiresAt as any).getTime();

    if (now > expiresAtTimestamp) {
      throw new ErrorResult({
        code: 400_071,
        clean_message: 'Le code OTP a expiré',
        message: 'Le code OTP a expiré. Veuillez en demander un nouveau',
      });
    }

    // Vérifier le nombre de tentatives
    const attempts = user.otpAttempts || 0;
    if (attempts >= 5) {
      throw new ErrorResult({
        code: 400_072,
        clean_message: 'Trop de tentatives',
        message:
          'Nombre maximum de tentatives atteint. Veuillez demander un nouveau code',
      });
    }

    // Vérifier le code
    if (user.otpCode !== code) {
      await this.userRepository.updateById(userId, {
        otpAttempts: attempts + 1,
      } as Partial<User>);

      throw new ErrorResult({
        code: 400_073,
        clean_message: 'Code OTP incorrect',
        message: `Code OTP incorrect. ${4 - attempts} tentative(s) restante(s)`,
      });
    }

    // OTP valide, nettoyer
    await this.clearOtp(userId);
    return true;
  }

  /**
   * Nettoie l'OTP d'un utilisateur
   */
  async clearOtp(userId: string): Promise<void> {
    await this.userRepository.updateById(userId, {
      otpCode: null as any,
      otpExpiresAt: null as any,
      otpAttempts: 0,
    } as Partial<User>);
  }

  /**
   * Renvoie un OTP (avec limitation de temps)
   */
  async resendOtp(userId: string): Promise<{ code: string; expiresAt: Date }> {
    const user = await this.userRepository.getById(userId);

    if (!user) {
      throw new ErrorResult({
        code: 404_016,
        clean_message: 'Le compte est introuvable',
        message: `Le compte [${userId}] est introuvable`,
      });
    }

    // Vérifier si on peut renvoyer (pas trop tôt)
    if (user.otpExpiresAt) {
      const now = Date.now();

      // Convertir otpExpiresAt en timestamp
      const expiresAtTimestamp =
        user.otpExpiresAt instanceof Date
          ? user.otpExpiresAt.getTime()
          : new Date(user.otpExpiresAt as any).getTime();

      // Calculer quand l'OTP a été créé
      const otpCreatedAtTimestamp =
        expiresAtTimestamp - this.otpExpiresInMin * 60 * 1000;

      // Temps écoulé depuis la création de l'OTP
      const timeSinceLastOtp = now - otpCreatedAtTimestamp;
      const minTimeBetweenOtp = 60 * 1000; // 1 minute

      if (timeSinceLastOtp < minTimeBetweenOtp) {
        const waitSeconds = Math.ceil(
          (minTimeBetweenOtp - timeSinceLastOtp) / 1000,
        );
        throw new ErrorResult({
          code: 429_001,
          clean_message: 'Veuillez patienter avant de renvoyer un code',
          message: `Veuillez attendre ${waitSeconds} seconde(s) avant de demander un nouveau code`,
        });
      }
    }

    return this.createOtp(userId, user.otpMethod || OTP_METHOD.EMAIL);
  }
}
