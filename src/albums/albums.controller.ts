import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
  HttpCode,
  Put,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { validate as uuidValidate } from 'uuid';

@Controller({ path: 'album' })
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  create(@Body() createAlbumDto: CreateAlbumDto) {
    if (!createAlbumDto.name || !createAlbumDto.year) {
      throw new BadRequestException(
        'Bad request. body does not contain required fields',
      );
    }
    return this.albumsService.create(createAlbumDto);
  }
  @Get()
  findAll() {
    return this.albumsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.albumsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAlbumDto: UpdateAlbumDto) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Bad request. albumId is invalid (not uuid)',
      );
    }
    if (!updateAlbumDto) {
      throw new BadRequestException(
        'Bad request. body does not contain required fields',
      );
    }
    if (updateAlbumDto?.artistId) {
      if (!uuidValidate(updateAlbumDto.artistId)) {
        throw new BadRequestException(
          'Bad request. artistId is invalid (not uuid)',
        );
      }
    }
    const album = this.albumsService.update(id, updateAlbumDto);
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    console.log('album', album);
    return album;
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.albumsService.remove(id);
  }
}
