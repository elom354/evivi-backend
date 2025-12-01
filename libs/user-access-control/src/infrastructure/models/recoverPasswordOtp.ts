import { BaseModel } from '@app/common/models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  collection: 'recover_password_otps',
  timestamps: true,
})
export class RecoverPasswordOtp extends BaseModel {
  @Prop({ type: String, required: true })
  otp: string;

  @Prop({ type: Date, required: true })
  exp: Date;

  @Prop({ type: String, required: true })
  token: string;

  @Prop({ type: String, required: true, index: true })
  email: string;

  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: Boolean, default: false })
  checked: boolean;
}

export const RecoverPasswordOtpSchema =
  SchemaFactory.createForClass(RecoverPasswordOtp);

export type RecoverPasswordOtpDocument = HydratedDocument<RecoverPasswordOtp>;

RecoverPasswordOtpSchema.index({ otp: 1, token: 1, checked: 1 });
