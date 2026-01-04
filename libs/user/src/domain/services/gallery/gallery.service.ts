import { ErrorResult } from '@app/common/utils';
import { LeanedDocument } from '@app/core/providers/base.mongo.repository';
import { Gallery } from '@app/user/infrastructure/models';
import { GalleryRepository } from '@app/user/infrastructure/repositories';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class GalleryService {
  constructor(private readonly galleryRepository: GalleryRepository) {}

  async create(userId: Types.ObjectId): Promise<LeanedDocument<Gallery>> {
    const exists = await this.galleryRepository.getOne({
      user: userId,
    });

    if (exists) {
      throw new ErrorResult({
        code: 409_020,
        clean_message: 'Galerie déjà existante',
        message: `Une galerie existe déjà pour l'utilisateur [${userId.toHexString()}]`,
      });
    }

    return this.galleryRepository.create({
      user: userId,
      profile: null,
      mediaUrls: [],
    });
  }

  async getByUserId(userId: Types.ObjectId): Promise<LeanedDocument<Gallery>> {
    const gallery = await this.galleryRepository.getOne({
      user: userId,
    });

    if (!gallery) {
      throw new ErrorResult({
        code: 404_021,
        clean_message: 'Galerie introuvable',
        message: `Aucune galerie trouvée pour l'utilisateur [${userId.toHexString()}]`,
      });
    }

    return gallery;
  }

  async updateProfile(
    userId: Types.ObjectId,
    profileUrl: string,
  ): Promise<LeanedDocument<Gallery>> {
    const gallery = await this.getByUserId(userId);

    const updated = await this.galleryRepository.updateById(
      gallery._id.toString(),
      { profile: profileUrl },
    );

    if (!updated) {
      throw new ErrorResult({
        code: 500_021,
        clean_message: 'Échec de mise à jour',
        message: 'Impossible de mettre à jour la photo de profil',
      });
    }

    return updated;
  }

  async addMedia(
    userId: Types.ObjectId,
    urls: string[],
  ): Promise<LeanedDocument<Gallery>> {
    const gallery = await this.getByUserId(userId);

    const updated = await this.galleryRepository.updateById(
      gallery._id.toString(),
      { $push: { mediaUrls: { $each: urls } } },
    );

    if (!updated) {
      throw new ErrorResult({
        code: 500_022,
        clean_message: 'Échec ajout médias',
        message: 'Impossible d’ajouter les médias à la galerie',
      });
    }

    return updated;
  }

  async removeMedia(
    userId: Types.ObjectId,
    url: string,
  ): Promise<LeanedDocument<Gallery>> {
    const gallery = await this.getByUserId(userId);

    const updated = await this.galleryRepository.updateById(
      gallery._id.toString(),
      { $pull: { mediaUrls: url } },
    );

    if (!updated) {
      throw new ErrorResult({
        code: 500_023,
        clean_message: 'Échec suppression média',
        message: 'Impossible de supprimer le média de la galerie',
      });
    }

    return updated;
  }

  async deleteByUserId(
    userId: Types.ObjectId,
  ): Promise<LeanedDocument<Gallery>> {
    const gallery = await this.getByUserId(userId);

    const deleted = await this.galleryRepository.deleteById(
      gallery._id.toString(),
    );

    if (!deleted) {
      throw new ErrorResult({
        code: 500_024,
        clean_message: 'Suppression échouée',
        message: 'Impossible de supprimer la galerie',
      });
    }

    return deleted;
  }
}
