import { BaseModel } from '@app/common/models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  collection: 'login_otps',
  timestamps: true,
})
export class LoginOtp extends BaseModel {
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

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const LoginOtpSchema = SchemaFactory.createForClass(LoginOtp);

export type LoginOtpDocument = HydratedDocument<LoginOtp>;

LoginOtpSchema.index({ otp: 1, token: 1, checked: 1 });
