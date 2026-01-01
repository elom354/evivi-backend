import { BaseModel } from '@app/common/models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export enum USER_STATUS {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum OTP_METHOD {
  EMAIL = 'email',
  SMS = 'sms',
}

@Schema({
  collection: 'users',
  timestamps: true,
})
export class User extends BaseModel {
  @ApiProperty({ type: String, example: 'John Doe' })
  @Prop({ type: String, required: true })
  fullName: string;

  @ApiProperty({ type: String, example: 'F' })
  @Prop({ type: String, required: false })
  gender: string;

  @ApiProperty({ type: String, example: 'johndoe@mail.com' })
  @Prop({ type: String, required: false, index: true })
  email: string;

  @ApiProperty({ type: String, example: '+22890112233' })
  @Prop({ type: String, required: true })
  phone: string;

  @ApiProperty({ type: String, example: '+228' })
  @Prop({ type: String })
  phoneCountryCode?: string;

  @ApiProperty({ type: String })
  @Prop({ type: String, required: true })
  password: string;

  @ApiProperty({ type: String })
  @Prop({ type: String })
  passwordSalt?: string;

  @ApiProperty({ type: String, enum: USER_STATUS })
  @Prop({ type: String, enum: USER_STATUS, default: USER_STATUS.INACTIVE })
  status: USER_STATUS;

  @ApiProperty({ type: Boolean, default: false })
  @Prop({ type: Boolean, default: false })
  emailVerified: boolean;

  @ApiProperty({ type: Date })
  @Prop({ type: Date })
  emailVerifiedAt?: Date;

  @ApiProperty({ type: Date })
  @Prop({ type: Date })
  phoneVerifiedAt?: Date;

  @ApiProperty({ type: Boolean, default: false })
  @Prop({ type: Boolean, default: false })
  phoneVerified: boolean;

  @ApiProperty({ type: Boolean, default: false })
  @Prop({ type: Boolean, default: false })
  isAdmin: boolean;

  // OTP fields
  @ApiProperty({ type: String })
  @Prop({ type: String })
  otpCode?: string;

  @ApiProperty({ type: Date })
  @Prop({ type: Date })
  otpExpiresAt?: Date;

  @ApiProperty({ type: String, enum: OTP_METHOD })
  @Prop({ type: String, enum: OTP_METHOD })
  otpMethod?: OTP_METHOD;

  @ApiProperty({ type: Number, default: 0 })
  @Prop({ type: Number, default: 0 })
  otpAttempts: number;

  @ApiProperty({ type: String })
  @Prop({ type: String })
  token?: string;

  @ApiProperty({ type: String })
  @Prop({ type: String })
  image?: string;

  @ApiProperty({ type: Boolean, default: false })
  @Prop({ type: Boolean, default: false })
  isRegisterWithGoogle: boolean;

  @ApiProperty({ type: Boolean, default: false })
  @Prop({ type: Boolean, default: false })
  isRegisterWithFacebook: boolean;

  @ApiProperty({ type: String })
  @Prop({ type: String })
  passwordResetToken?: string;

  @ApiProperty({ type: Date })
  @Prop({ type: Date })
  passwordResetTokenExpiresAt?: Date;

  @ApiProperty({ type: Boolean, default: false })
  @Prop({ type: Boolean, default: false })
  twoFactorEnabled: boolean;

  @ApiProperty({ type: Date })
  @Prop({ type: Date })
  sessionRevokedAt?: Date;

  @ApiProperty({ type: String })
  @Prop({ type: String })
  twoFactorMethod?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;
