import { BaseModel } from '@app/common/models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({
  collection: 'roles',
  timestamps: true,
})
export class Role extends BaseModel {
  @ApiProperty({ type: String, example: 'User' })
  @Prop({ type: String, required: true })
  label: string;

  @ApiProperty({ type: String, example: 'user' })
  @Prop({ type: String, required: true, unique: true })
  slug: string;

  @ApiProperty({ type: String, example: "Rôle d'un utilisateur" })
  @Prop({ type: String, required: true })
  description: string;

  @ApiProperty({ example: {}, default: {} })
  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  metadata: Record<string, any> = {};
}

export const RoleSchema = SchemaFactory.createForClass(Role);

export type RoleDocument = HydratedDocument<Role>;
