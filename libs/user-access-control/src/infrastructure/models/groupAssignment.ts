import { BaseModel } from '@app/common/models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({
  collection: 'group_assignments',
  timestamps: true,
})
export class GroupAssignment extends BaseModel {
  @ApiProperty({ type: String, example: '66c39ca0de267891d423a9e8' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, index: true })
  userId: mongoose.Schema.Types.ObjectId | string;

  @ApiProperty({ type: String, example: '66c39ca0de267891d423a9e8' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  groupId: mongoose.Schema.Types.ObjectId | string;

  @ApiProperty({ type: String, example: 'admins' })
  @Prop({ type: String, required: true })
  groupSlug: string;

  @ApiProperty({ example: {}, default: {} })
  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  data: Record<string, any> = {};
}

export const GroupAssignmentSchema =
  SchemaFactory.createForClass(GroupAssignment);

export type GroupAssignmentDocument = HydratedDocument<GroupAssignment>;
