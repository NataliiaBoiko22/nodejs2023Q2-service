import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  NotFoundException,
  BadRequestException,
  UnprocessableEntityException,
  Res,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { FavoritesService } from './favorites.service';
import { Response } from 'express';
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':type/:id')
  create(
    @Param('type') type: 'track' | 'artist' | 'album',
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        `Bad request. ${type} Id is invalid (not uuid)`,
      );
    }
    try {
      const result = this.favoritesService.create(type, id);
      res.status(201).json({
        message: `${capitalize(type)} added successfully.`,
        data: result,
      });
    } catch (error) {
      if (error instanceof UnprocessableEntityException) {
        throw new UnprocessableEntityException(
          `${capitalize(type)} with id does not exist.`,
        );
      }
    }
  }

  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @Delete(':type/:id')
  @HttpCode(204)
  remove(
    @Param('type') type: 'track' | 'artist' | 'album',
    @Param('id') id: string,
  ) {
    const removed = this.favoritesService.remove(type, id);

    if (removed) {
      return {
        message: `${capitalize(type)} deleted successfully.`,
      };
    } else {
      throw new NotFoundException(`${capitalize(type)} not found.`);
    }
  }
}
