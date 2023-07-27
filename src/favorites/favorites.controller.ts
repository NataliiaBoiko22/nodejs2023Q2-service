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
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':type/:id')
  create(
    @Param('type') type: 'track' | 'artist' | 'album',
    @Param('id') id: string,
  ) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid id');
    }
    try {
      return this.favoritesService.create(type, id);
    } catch (error) {
      if (error instanceof UnprocessableEntityException) {
        throw new UnprocessableEntityException(error.message);
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
        message: 'Favorite removed successfully.',
      };
    } else {
      throw new NotFoundException('Favorite not found.');
    }
  }
}
