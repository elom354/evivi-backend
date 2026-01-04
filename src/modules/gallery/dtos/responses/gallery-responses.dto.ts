import { LeanedDocument } from '@app/core/providers/base.mongo.repository';
import { Gallery } from '@app/user/infrastructure/models';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de réponse pour la galerie
 */
export class GalleryResponseDto {
  @ApiProperty({ type: String, example: '507f1f77bcf86cd799439011' })
  _id: string;

  @ApiProperty({ type: String, example: '507f1f77bcf86cd799439011' })
  user: string;

  @ApiProperty({
    type: String,
    example: 'https://cdn.app.com/images/profile.jpg',
    nullable: true,
  })
  profile: string | null;

  @ApiProperty({
    type: [String],
    example: [
      'https://cdn.app.com/images/1.jpg',
      'https://cdn.app.com/images/2.jpg',
    ],
  })
  mediaUrls: string[];

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  constructor(gallery: LeanedDocument<Gallery>) {
    this._id = gallery._id.toString();
    this.user = gallery.user.toString();
    this.profile = gallery.profile;
    this.mediaUrls = gallery.mediaUrls;
    this.createdAt = gallery.createdAt;
    this.updatedAt = gallery.updatedAt;
  }
}

