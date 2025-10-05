import { BaseModel } from '@app/common/models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({
  collection: 'role_assignments',
  timestamps: true,
})
export class RoleAssignment extends BaseModel {
  @ApiProperty({ type: String, example: '66c39ca0de267891d423a9e8' })
  _id: mongoose.Schema.Types.ObjectId;

  @ApiProperty({ type: String, example: '66c39ca0de267891d423a9e8' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, index: true })
  userId: mongoose.Schema.Types.ObjectId | string;

  @ApiProperty({ type: String, example: '66c39ca0de267891d423a9e8' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  roleId: mongoose.Schema.Types.ObjectId | string;

  @ApiProperty({ type: String, example: 'user' })
  @Prop({ type: String, required: true })
  roleSlug: string;

  @ApiProperty({ example: {}, default: {} })
  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  data: Record<string, any> = {};
}

export const RoleAssignmentSchema =
  SchemaFactory.createForClass(RoleAssignment);

export type RoleAssignmentDocument = HydratedDocument<RoleAssignment>;
