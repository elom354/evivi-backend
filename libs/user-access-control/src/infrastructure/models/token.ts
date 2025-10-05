import { BaseModel } from '@app/common/models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user';

@Schema({
  collection: 'tokens',
  timestamps: true,
})
export class Token extends BaseModel {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
    index: true,
  })
  userId: mongoose.Schema.Types.ObjectId | string;

  @Prop({ type: String, required: true, index: true })
  accessToken: string;

  @Prop({ type: String, required: true, index: true })
  refreshToken: string;

  @Prop({ type: String, required: true })
  ipAddress: string;

  @Prop({ type: String })
  appType?: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);

export type TokenDocument = HydratedDocument<Token>;
