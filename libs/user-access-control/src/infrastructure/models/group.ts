import { BaseModel } from '@app/common/models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({
  collection: 'groups',
  timestamps: true,
})
export class Group extends BaseModel {
  @ApiProperty({ type: String, example: 'Admins' })
  @Prop({ type: String, required: true })
  label: string;

  @ApiProperty({ type: String, example: 'admins' })
  @Prop({ type: String, required: true, unique: true })
  slug: string;

  @ApiProperty({ type: String, example: "Groupe d'administrateurs" })
  @Prop({ type: String, required: true })
  description: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    example: ['66c39ca0de267891d423a9e8'],
    default: [],
  })
  @Prop({ type: [mongoose.Schema.Types.ObjectId], default: [] })
  roles: (mongoose.Schema.Types.ObjectId | string)[];

  @ApiProperty({ example: {}, default: {} })
  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  metadata: Record<string, any> = {};
}

export const GroupSchema = SchemaFactory.createForClass(Group);

export type GroupDocument = HydratedDocument<Group>;
