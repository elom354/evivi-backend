import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@app/core/config';
import axios, { AxiosInstance } from 'axios';

export interface SendSmsOptions {
  to: string | string[];
  message: string;
}

export interface AfrikSmsResponse {
  status: string;
  message: string;
  data?: {
    recipients: string[];
    messageId: string;
    cost: number;
  };
}

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly isEnabled: boolean;
  private readonly apiKey: string;
  private readonly senderName: string;
  private readonly httpClient: AxiosInstance;
  private readonly baseUrl = 'https://afriksms.com/api/v1';

  constructor(private readonly config: ConfigService<AppConfig, true>) {
    this.isEnabled = this.config.get('LIB_NOTIFICATION_SMS_ENABLED', {
      infer: true,
    });
    this.apiKey = this.config.get('LIB_NOTIFICATION_SMS_AFRIKSMS_API_KEY', {
      infer: true,
    });
    this.senderName = this.config.get(
      'LIB_NOTIFICATION_SMS_AFRIKSMS_SENDER_NAME',
      {
        infer: true,
      },
    );

    this.httpClient = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!this.isEnabled) {
      this.logger.warn('SMS Notification is disabled');
    }
  }

  /**
   * Envoie un SMS via AfrikSMS
   * @param options Options d'envoi (destinataire(s) et message)
   * @returns Response de l'API AfrikSMS
   */
  async send(options: SendSmsOptions): Promise<AfrikSmsResponse> {
    if (!this.isEnabled) {
      this.logger.warn('SMS sending skipped - SMS is disabled');
      return {
        status: 'disabled',
        message: 'SMS service is disabled',
      };
    }

    try {
      // Normaliser les numéros de téléphone
      const recipients = Array.isArray(options.to)
        ? options.to
        : [options.to];

      // Préparer les données selon la doc AfrikSMS
      const payload = {
        api_key: this.apiKey,
        sender: this.senderName,
        recipients: recipients,
        message: options.message,
      };

      this.logger.debug(
        `Sending SMS to ${recipients.join(', ')} via AfrikSMS`,
      );

      // Appel API AfrikSMS - Endpoint /sms/send
      const response = await this.httpClient.post<AfrikSmsResponse>(
        '/sms/send',
        payload,
      );

      if (response.data.status === 'success') {
        this.logger.log(
          `SMS sent successfully to ${recipients.join(', ')} - Message ID: ${response.data.data?.messageId}`,
        );
      } else {
        this.logger.error(
          `SMS send failed: ${response.data.message}`,
          response.data,
        );
      }

      return response.data;
    } catch (error: any) {
      this.logger.error('Failed to send SMS via AfrikSMS', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      if (error.response) {
        throw new Error(
          `AfrikSMS API Error: ${error.response.data?.message || error.message}`,
        );
      }

      throw error;
    }
  }

  /**
   * Vérifie le solde du compte AfrikSMS
   * @returns Informations sur le solde
   */
  async checkBalance(): Promise<{
    status: string;
    balance: number;
    currency: string;
  }> {
    if (!this.isEnabled) {
      throw new Error('SMS service is disabled');
    }

    try {
      const response = await this.httpClient.post('/account/balance', {
        api_key: this.apiKey,
      });

      this.logger.debug('AfrikSMS balance checked', response.data);

      return response.data;
    } catch (error: any) {
      this.logger.error('Failed to check AfrikSMS balance', {
        error: error.message,
        response: error.response?.data,
      });
      throw error;
    }
  }

  /**
   * Récupère l'historique des SMS envoyés
   * @param limit Nombre de SMS à récupérer (par défaut 50)
   * @returns Liste des SMS envoyés
   */
  async getHistory(limit: number = 50): Promise<any> {
    if (!this.isEnabled) {
      throw new Error('SMS service is disabled');
    }

    try {
      const response = await this.httpClient.post('/sms/history', {
        api_key: this.apiKey,
        limit,
      });

      return response.data;
    } catch (error: any) {
      this.logger.error('Failed to get SMS history', {
        error: error.message,
        response: error.response?.data,
      });
      throw error;
    }
  }

  /**
   * Vérifie le statut d'un SMS envoyé
   * @param messageId ID du message
   * @returns Statut du message
   */
  async getMessageStatus(messageId: string): Promise<any> {
    if (!this.isEnabled) {
      throw new Error('SMS service is disabled');
    }

    try {
      const response = await this.httpClient.post('/sms/status', {
        api_key: this.apiKey,
        message_id: messageId,
      });

      return response.data;
    } catch (error: any) {
      this.logger.error('Failed to get message status', {
        error: error.message,
        response: error.response?.data,
      });
      throw error;
    }
  }

  /**
   * Formate un numéro de téléphone pour AfrikSMS
   * AfrikSMS accepte les formats internationaux (avec +) ou sans
   * @param phone Numéro de téléphone
   * @returns Numéro formaté
   */
  private formatPhoneNumber(phone: string): string {
    // Nettoyer les espaces
    let cleaned = phone.replace(/\s/g, '');

    // Si le numéro commence par 00, le remplacer par +
    if (cleaned.startsWith('00')) {
      cleaned = '+' + cleaned.substring(2);
    }

    // S'assurer qu'il commence par +
    if (!cleaned.startsWith('+')) {
      // Assumer que c'est un numéro local et ajouter l'indicatif par défaut
      this.logger.warn(
        `Phone number ${phone} doesn't start with +, may need country code`,
      );
    }

    return cleaned;
  }

  /**
   * Envoie un SMS à plusieurs destinataires (alias pour send avec tableau)
   * @param recipients Liste des numéros
   * @param message Message à envoyer
   */
  async sendBulk(
    recipients: string[],
    message: string,
  ): Promise<AfrikSmsResponse> {
    return this.send({
      to: recipients,
      message,
    });
  }
}
