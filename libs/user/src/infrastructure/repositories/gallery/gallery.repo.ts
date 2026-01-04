import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MAIN_DATABASE_CONNECTION_NAME } from '@app/common/constants';
import {
  BaseRepository,
  LeanedDocument,
} from '@app/core/providers/base.mongo.repository';
import { Gallery } from '../../models';

@Injectable()
export class GalleryRepository extends BaseRepository<Gallery> {
  constructor(
    @InjectModel(Gallery.name, MAIN_DATABASE_CONNECTION_NAME)
    readonly model: Model<Gallery>,
  ) {
    super(model);
  }
}
