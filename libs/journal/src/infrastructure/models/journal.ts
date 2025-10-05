import { BaseModel } from '@app/common/models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({
  collection: 'core_journals',
  timestamps: true,
})
export class Journal extends BaseModel {
  @ApiProperty({
    type: String,
    enum: ['info', 'warn', 'error'],
    example: 'error',
  })
  @Prop({ type: String, required: true })
  level: string;

  @ApiProperty({ type: String, example: 'An error has occured.' })
  @Prop({ type: String, required: true })
  message: string;

  @ApiProperty({ example: {}, default: {} })
  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  data: Record<string, any> = {};
}

export const JournalSchema = SchemaFactory.createForClass(Journal);

export type JournalDocument = HydratedDocument<Journal>;
