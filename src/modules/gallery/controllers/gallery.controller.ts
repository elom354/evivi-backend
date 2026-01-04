import { CurrentUser } from '@app/auth/domain';
import { LogLevel } from '@app/core/types';
import { JournalService } from '@app/journal/domain/services/journal.service';
import { GalleryService } from '@app/user/domain/services/gallery/gallery.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { ApiEmptyDataResponse, ApiErrorResponse } from '../../core/http';
import {
  AddMediaDto,
  GalleryResponseDto,
  RemoveMediaDto,
  UpdateProfileDto,
} from '../dtos';

@ApiTags('Gallery - User Gallery')
@Controller('gallery')
export class GalleryController {
  constructor(
    private readonly galleryService: GalleryService,
    private readonly journalService: JournalService,
  ) {}

  @ApiOperation({
    summary: "Récupérer la galerie de l'utilisateur connecté",
  })
  @ApiResponse({ status: HttpStatus.OK, type: GalleryResponseDto })
  @ApiResponse({ status: '4XX', type: ApiErrorResponse })
  @ApiResponse({ status: '5XX', type: ApiErrorResponse })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getMyGallery(
    @CurrentUser('_id') userId: string,
  ): Promise<GalleryResponseDto> {
    try {
      const gallery = await this.galleryService.getByUserId(
        new Types.ObjectId(userId),
      );
      return new GalleryResponseDto(gallery);
    } catch (error) {
      this.log('error', '', error);
      throw error;
    }
  }

  @ApiOperation({
    summary: "Mettre à jour la photo de profil de l'utilisateur connecté",
  })
  @ApiResponse({ status: HttpStatus.OK, type: GalleryResponseDto })
  @ApiResponse({ status: '4XX', type: ApiErrorResponse })
  @ApiResponse({ status: '5XX', type: ApiErrorResponse })
  @HttpCode(HttpStatus.OK)
  @Patch('profile')
  async updateProfile(
    @CurrentUser('_id') userId: string,
    @Body() dto: UpdateProfileDto,
  ): Promise<GalleryResponseDto> {
    try {
      const gallery = await this.galleryService.updateProfile(
        new Types.ObjectId(userId),
        dto.profileUrl,
      );
      return new GalleryResponseDto(gallery);
    } catch (error) {
      this.log('error', '', error);
      throw error;
    }
  }

  @ApiOperation({
    summary: "Ajouter des médias à la galerie de l'utilisateur connecté",
  })
  @ApiResponse({ status: HttpStatus.OK, type: GalleryResponseDto })
  @ApiResponse({ status: '4XX', type: ApiErrorResponse })
  @ApiResponse({ status: '5XX', type: ApiErrorResponse })
  @HttpCode(HttpStatus.OK)
  @Post('media')
  async addMedia(
    @CurrentUser('_id') userId: string,
    @Body() dto: AddMediaDto,
  ): Promise<GalleryResponseDto> {
    try {
      const gallery = await this.galleryService.addMedia(
        new Types.ObjectId(userId),
        dto.urls,
      );
      return new GalleryResponseDto(gallery);
    } catch (error) {
      this.log('error', '', error);
      throw error;
    }
  }

  @ApiOperation({
    summary: "Supprimer un média de la galerie de l'utilisateur connecté",
  })
  @ApiResponse({ status: HttpStatus.OK, type: GalleryResponseDto })
  @ApiResponse({ status: '4XX', type: ApiErrorResponse })
  @ApiResponse({ status: '5XX', type: ApiErrorResponse })
  @HttpCode(HttpStatus.OK)
  @Delete('media')
  async removeMedia(
    @CurrentUser('_id') userId: string,
    @Body() dto: RemoveMediaDto,
  ): Promise<GalleryResponseDto> {
    try {
      const gallery = await this.galleryService.removeMedia(
        new Types.ObjectId(userId),
        dto.url,
      );
      return new GalleryResponseDto(gallery);
    } catch (error) {
      this.log('error', '', error);
      throw error;
    }
  }

  @ApiOperation({
    summary: "Supprimer la galerie de l'utilisateur connecté",
  })
  @ApiResponse({ status: HttpStatus.OK, type: ApiEmptyDataResponse })
  @ApiResponse({ status: '4XX', type: ApiErrorResponse })
  @ApiResponse({ status: '5XX', type: ApiErrorResponse })
  @HttpCode(HttpStatus.OK)
  @Delete()
  async deleteMyGallery(@CurrentUser('_id') userId: string): Promise<null> {
    try {
      await this.galleryService.deleteByUserId(new Types.ObjectId(userId));
      return null;
    } catch (error) {
      this.log('error', '', error);
      throw error;
    }
  }

  private log(level: LogLevel, message?: string, data?: Record<string, any>) {
    this.journalService.save(
      'ApiGalleryModule',
      this.constructor.name,
      level,
      message || 'Controller error',
      data,
    );
  }
}
