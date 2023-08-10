import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  NotFoundException,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { FavoritesService } from './favorites.service';
@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async findAll() {
    return await this.favoritesService.findAll();
  }

  @Post('album/:id')
  async createAlbum(
    @Param('id')
    id: string,
  ) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Bad request. albumId is invalid (not uuid)',
      );
    }
    const album = await this.favoritesService.createAlbum(id);

    if (!album) {
      throw new UnprocessableEntityException('Album with id does not exist.');
    }
    return album;
  }

  @Delete('album/:id')
  @HttpCode(204)
  async removeAlbum(
    @Param('id')
    id: string,
  ) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Bad request. albumId is invalid (not uuid)',
      );
    }
    const album = await this.favoritesService.removeAlbum(id);

    if (!album) {
      throw new NotFoundException('Album not found.');
    }

    return album;
  }

  @Post('artist/:id')
  async createArtist(
    @Param('id')
    id: string,
  ) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Bad request. artistId is invalid (not uuid)',
      );
    }

    const artist = await this.favoritesService.createArtist(id);

    if (!artist) {
      throw new UnprocessableEntityException('Artist with id does not exist.');
    }
    return artist;
  }

  @Delete('artist/:id')
  @HttpCode(204)
  async removeArtist(
    @Param('id')
    id: string,
  ) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Bad request. artistId is invalid (not uuid)',
      );
    }
    const artist = await this.favoritesService.removeArtist(id);

    if (!artist) {
      throw new NotFoundException('Artist not found.');
    }

    return artist;
  }

  @Post('track/:id')
  async createTrack(
    @Param('id')
    id: string,
  ) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Bad request. trackId is invalid (not uuid)',
      );
    }

    const track = await this.favoritesService.createTrack(id);

    if (!track) {
      throw new UnprocessableEntityException('Track with id does not exist.');
    }
    return track;
  }

  @Delete('track/:id')
  @HttpCode(204)
  async removeTrack(
    @Param('id')
    id: string,
  ) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Bad request. trackId is invalid (not uuid)',
      );
    }
    const track = await this.favoritesService.removeTrack(id);

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }
}
