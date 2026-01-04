import { BaseModel } from '@app/common/models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument, Types } from 'mongoose';

@Schema({
  collection: 'galleries',
  timestamps: true,
})
export class Gallery extends BaseModel {
  @ApiProperty({
    type: String,
    description: 'Owner user id',
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  user: Types.ObjectId;

  @ApiProperty({
    type: String,
    example: 'https://cdn.app.com/images/1.jpg',
  })
  @Prop({ type: String, default: null })
  profile: string | null;   

  @ApiProperty({
    type: [String],
    example: [
      'https://cdn.app.com/images/1.jpg',
      'https://cdn.app.com/images/2.jpg',
    ],
  })
  @Prop({ type: [String], default: [] })
  mediaUrls: string[];
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);
export type GalleryDocument = HydratedDocument<Gallery>;
