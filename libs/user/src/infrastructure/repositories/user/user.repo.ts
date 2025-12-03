import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MAIN_DATABASE_CONNECTION_NAME } from '@app/common/constants';
import { BaseRepository, LeanedDocument } from '@app/core/providers/base.mongo.repository';
import { User } from '../../models';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(
    @InjectModel(User.name, MAIN_DATABASE_CONNECTION_NAME)
    readonly model: Model<User>,
  ) {
    super(model);
  }

  async getActiveByEmail(email: string): Promise<LeanedDocument<User> | null> {
    return this.getOne({ email, deleted: false });
  }

  async getActiveByPhone(phone: string): Promise<LeanedDocument<User> | null> {
    return this.getOne({ phone, deleted: false });
  }

}
