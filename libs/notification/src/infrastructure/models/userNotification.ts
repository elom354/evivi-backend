import { BaseModel } from '@app/common/models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({
  collection: 'user_notifications',
  timestamps: true,
})
export class UserNotification extends BaseModel {
  @ApiProperty({ type: String, example: '66c39ca0de267891d423a9e8' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  userId: mongoose.Schema.Types.ObjectId | string;

  @ApiProperty({
    type: String,
    example: 'Votre mot de passe a été mis à jour avec succès.',
  })
  @Prop({ type: String, required: true })
  message: string;
}

export const UserNotificationSchema =
  SchemaFactory.createForClass(UserNotification);

export type UserNotificationDocument = HydratedDocument<UserNotification>;
