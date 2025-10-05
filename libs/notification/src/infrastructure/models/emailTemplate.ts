import { BaseModel } from '@app/common/models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

@Schema({
  collection: 'email_templates',
  timestamps: true,
})
export class EmailTemplate extends BaseModel {
  @ApiProperty({ type: String, example: "Mail pour OTP d'authentification" })
  @Prop({ type: String, required: true })
  label: string;

  @ApiProperty({
    type: String,
    example: 'Code de vérification pour accéder à CHAT ANONYMOUS',
  })
  @Prop({ type: String, required: true })
  subject: string;

  @ApiProperty({ type: String, example: 'mail-authentication-otp' })
  @Prop({ type: String, required: true, unique: true })
  slug: string;

  @ApiProperty({ type: String, example: "Mail pour OTP d'authentification" })
  @Prop({ type: String, required: true })
  description: string;

  @ApiProperty({
    type: String,
    example:
      '<p>Votre code de vérification pour accéder à CHAT ANONYMOUS est : 000.</p>',
  })
  @Prop({ type: String, required: true })
  template: string;

  @ApiProperty({
    type: String,
    example:
      'Votre code de vérification pour accéder à CHAT ANONYMOUS est : 000.',
  })
  @Prop({ type: String, required: true })
  message: string;
}

export const EmailTemplateSchema = SchemaFactory.createForClass(EmailTemplate);

export type EmailTemplateDocument = HydratedDocument<EmailTemplate>;
