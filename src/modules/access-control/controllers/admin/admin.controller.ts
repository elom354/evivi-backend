import { ErrorResult, SearchFilter, StringUtils } from '@app/common/utils';
import { SortQuery } from '@app/core/providers/base.mongo.repository';
import { LogLevel } from '@app/core/types';
import { JournalService } from '@app/journal/domain/services/journal.service';
import { UserService } from '@app/user-access-control/domain/services/user.service';
import { User } from '@app/user-access-control/infrastructure/models/user';
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { FilterQuery } from 'mongoose';
import { Admin } from 'src/modules/core/decorators';
import {
  ApiEmptyDataResponse,
  ApiErrorResponse,
  ApiListQuery,
} from 'src/modules/core/http';
import { ListUsersResponse, UpsertUserDto, UserResponse } from '../../dto';

@Admin()
@ApiTags('Admin - Admins')
@Controller('/admin/admins')
export class AdminController {
  private readonly searchFilter: SearchFilter;

  constructor(
    private readonly userService: UserService,
    private readonly journalService: JournalService,
  ) {
    this.searchFilter = new SearchFilter({
      firstname: 'string',
      lastname: 'string',
      gender: 'string',
      email: 'string',
      phone: 'string',
    });
  }

  @ApiOperation({
    summary: 'Lister les administrateurs avec pagination',
  })
  @ApiQuery({ type: ApiListQuery })
  @ApiResponse({ status: HttpStatus.OK, type: ListUsersResponse })
  @ApiResponse({ status: '4XX', type: ApiErrorResponse })
  @ApiResponse({ status: '5XX', type: ApiErrorResponse })
  @HttpCode(HttpStatus.OK)
  @Get('')
  async list(@Req() req: Request) {
    try {
      //
      const { limit, skip, query } = req.filterQuery;
      const filters: FilterQuery<User> = {};

      if (query) {
        if (StringUtils.isMongoId(query)) {
          filters._id = query;
        }
      } else {
        const regex = { $regex: query, $options: 'i' };

        filters.$or = [
          { firstname: regex },
          { lastname: regex },
          { gender: regex },
          { email: regex },
          { phone: regex },
        ];
      }

      const sort: SortQuery<User> = { email: 1 };

      const result = await this.userService.get(
        filters,
        limit,
        skip,
        sort,
        true,
      );

      return result;
    } catch (error) {
      this.log('error', '', error);
      throw error;
    }
  }

  @ApiOperation({
    summary: 'Recherche avancée des administrateurs avec pagination',
  })
  @ApiResponse({ status: HttpStatus.OK, type: ListUsersResponse })
  @ApiResponse({ status: '4XX', type: ApiErrorResponse })
  @ApiResponse({ status: '5XX', type: ApiErrorResponse })
  @HttpCode(HttpStatus.OK)
  @Post('_search')
  async search(@Req() req: Request) {
    try {
      const { limit, skip } = req.filterQuery;
      const { filter = {}, sort = {} } = req.body;

      this.searchFilter.handle(filter, sort);

      const admins = await this.userService.get(
        filter,
        limit,
        skip,
        sort,
        true,
      );
      return admins;
    } catch (error) {
      this.log('error', '', error);
      throw error;
    }
  }

  @ApiOperation({ summary: 'Récupérer un administrateur' })
  @ApiResponse({ status: HttpStatus.OK, type: UserResponse })
  @ApiResponse({ status: '4XX', type: ApiErrorResponse })
  @ApiResponse({ status: '5XX', type: ApiErrorResponse })
  @HttpCode(HttpStatus.OK)
  @Get('id')
  async getById(@Param('id') id: string) {
    try {
      const result = await this.userService.getById(id, true, true);

      return result;
    } catch (error) {
      this.log('error', '', error);
      throw error;
    }
  }

  @ApiOperation({ summary: 'Créer un administrateur' })
  @ApiBody({ type: UpsertUserDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: UserResponse })
  @ApiResponse({ status: '4XX', type: ApiErrorResponse })
  @ApiResponse({ status: '5XX', type: ApiErrorResponse })
  @HttpCode(HttpStatus.CREATED)
  @Post('/create')
  async createAdmin(@Req() req: Request) {
    try {
      const input = new UpsertUserDto(req.body);

      const result = await this.userService.create(
        { ...input },
        { isAdmin: true },
      );

      return this.userService.getPublicInfo(result);
    } catch (error) {
      this.log('error', '', error);
      throw error;
    }
  }

  @ApiOperation({
    summary: "Mettre à jour les informations d'un administrateur",
  })
  @ApiBody({ type: UpsertUserDto })
  @ApiResponse({ status: HttpStatus.OK, type: UserResponse })
  @ApiResponse({ status: '4XX', type: ApiErrorResponse })
  @ApiResponse({ status: '5XX', type: ApiErrorResponse })
  @HttpCode(HttpStatus.OK)
  @Patch()
  async updateAdmin(@Param('id') id: string, @Req() req: Request) {
    try {
      //
      const input = new UpsertUserDto(req.body);

      const result = await this.userService.update(id, { ...input }, true);

      return this.userService.getPublicInfo(result);
    } catch (error) {
      this.log('error', '', error);
      throw error;
    }
  }

  @ApiOperation({
    summary: 'Activer ou désactiver un compte administrateur',
  })
  @ApiQuery({ name: 'state', enum: ['on', 'off'], example: 'on' })
  @ApiResponse({ status: HttpStatus.OK, type: ApiEmptyDataResponse })
  @ApiResponse({ status: '4XX', type: ApiErrorResponse })
  @ApiResponse({ status: '5XX', type: ApiErrorResponse })
  @HttpCode(HttpStatus.OK)
  @Patch(':id/toggle-state')
  async toggleState(@Param('id') id: string, @Query('state') state?: string) {
    try {
      if (!['on', 'off'].includes(state || '')) {
        throw new ErrorResult({
          code: 400_020,
          clean_message: "L'état est invalide",
          message:
            "Le paramètre de requête [state] doit avoir pour valeur 'on' ou 'off'",
        });
      }

      if (state === 'on') {
        await this.userService.activate(id, true);
      } else {
        await this.userService.deactivate(id, true);
      }

      return null;
    } catch (error) {
      this.log('error', '', error);
      throw error;
    }
  }

  @ApiOperation({ summary: 'Supprimer un administrateur' })
  @ApiResponse({ status: HttpStatus.OK, type: ApiEmptyDataResponse })
  @ApiResponse({ status: '4XX', type: ApiErrorResponse })
  @ApiResponse({ status: '5XX', type: ApiErrorResponse })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      await this.userService.delete(id, true);
      return null;
    } catch (error) {
      this.log('error', '', error);
      throw error;
    }
  }

  private log(level: LogLevel, message?: string, data?: Record<string, any>) {
    this.journalService.save(
      'ApiUserAccessControlModule',
      this.constructor.name,
      level,
      message || 'Controller error',
      data,
    );
  }
}
