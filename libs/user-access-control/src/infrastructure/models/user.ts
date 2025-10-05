import { BaseModel } from '@app/common/models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

@Schema({
  collection: 'users',
  timestamps: true,
})
export class User extends BaseModel {
  @ApiProperty({ type: String, example: 'John' })
  @Prop({ type: String, required: true })
  firstname: string;

  @ApiProperty({ type: String, example: 'Doe' })
  @Prop({ type: String, required: true })
  lastname: string;

  @ApiProperty({ type: String, example: 'F' })
  @Prop({ type: String, required: true })
  gender: string;

  @ApiProperty({ type: String, example: 'johndoe@mail.com' })
  @Prop({ type: String, required: true, index: true })
  email: string;

  @ApiProperty({ type: String, example: '+22890112233' })
  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true })
  passwordSalt: string;

  @ApiProperty({ type: Boolean, example: true, default: false })
  @Prop({ type: Boolean, default: false })
  verified: boolean;

  @ApiProperty({ type: Boolean, example: false, default: false })
  @Prop({ type: Boolean, default: false })
  isAdmin: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = HydratedDocument<User>;
