import { BaseModel } from '@app/common/models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument, Types } from 'mongoose';

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
  @ApiProperty({ example: 'John Doe' })
  @Prop({ type: String, required: true })
  fullName: string;

  @ApiProperty({ example: 'johnny' })
  @Prop({ type: String })
  pseudo?: string;

  @ApiProperty({ example: '2025-12-01', type: Date })
  @Prop({ type: Date })
  dateOfBirth?: Date;

  @ApiProperty({ example: 'Lomé, Togo' })
  @Prop({ type: String })
  location: string;

  @ApiProperty({ example: 'Software engineer passionate about AI' })
  @Prop({ type: String })
  description: string;

  @ApiProperty({ type: [String], example: ['tech', 'music', 'sport'] })
  @Prop({ type: [String], default: [] })
  interests: string[];

  @ApiProperty({ type: String, description: 'Gallery reference (ObjectId)' })
  @Prop({ type: Types.ObjectId, ref: 'Gallery' })
  galleryId?: Types.ObjectId;

  @ApiProperty({ example: 'M', enum: ['M', 'F'] })
  @Prop({ type: String })
  gender?: string;

  @ApiProperty({ example: 'johndoe@mail.com' })
  @Prop({ type: String, index: true, unique: true, sparse: true })
  email?: string;

  @ApiProperty({ example: '+22890112233' })
  @Prop({ type: String, required: true })
  phone: string;

  @ApiProperty({ example: '+228' })
  @Prop({ type: String })
  phoneCountryCode?: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  password: string;

  @ApiProperty()
  @Prop({ type: String })
  passwordSalt?: string;

  @ApiProperty({ enum: USER_STATUS, default: USER_STATUS.INACTIVE })
  @Prop({ type: String, enum: USER_STATUS, default: USER_STATUS.INACTIVE })
  status: USER_STATUS;

  @ApiProperty({ default: false })
  @Prop({ type: Boolean, default: false })
  emailVerified: boolean;

  @ApiProperty({ type: Date })
  @Prop({ type: Date })
  emailVerifiedAt?: Date;

  @ApiProperty({ default: false })
  @Prop({ type: Boolean, default: false })
  phoneVerified: boolean;

  @ApiProperty({ type: Date })
  @Prop({ type: Date })
  phoneVerifiedAt?: Date;

  @ApiProperty({ default: false })
  @Prop({ type: Boolean, default: false })
  isAdmin: boolean;

  // OTP
  @ApiProperty()
  @Prop({ type: String })
  otpCode?: string;

  @ApiProperty({ type: Date })
  @Prop({ type: Date })
  otpExpiresAt?: Date;

  @ApiProperty({ enum: OTP_METHOD })
  @Prop({ type: String, enum: OTP_METHOD })
  otpMethod?: OTP_METHOD;

  @ApiProperty({ default: 0 })
  @Prop({ type: Number, default: 0 })
  otpAttempts: number;

  @ApiProperty()
  @Prop({ type: String })
  token?: string;

  @ApiProperty()
  @Prop({ type: String })
  image?: string;

  @ApiProperty()
  @Prop({ type: String })
  passwordResetToken?: string;

  @ApiProperty({ type: Date })
  @Prop({ type: Date })
  passwordResetTokenExpiresAt?: Date;

  @ApiProperty({ default: false })
  @Prop({ type: Boolean, default: false })
  twoFactorEnabled: boolean;

  @ApiProperty({ enum: OTP_METHOD })
  @Prop({ type: String, enum: OTP_METHOD })
  twoFactorMethod?: OTP_METHOD;

  @ApiProperty({ type: Date })
  @Prop({ type: Date })
  sessionRevokedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;
