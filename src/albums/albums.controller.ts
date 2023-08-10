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

@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  async create(@Body() createAlbumDto: CreateAlbumDto) {
    if (!createAlbumDto.name || !createAlbumDto.year) {
      throw new BadRequestException(
        'Bad request. body does not contain required fields',
      );
    }
    return await this.albumsService.create(createAlbumDto);
  }

  @Get()
  async findAll() {
    return await this.albumsService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id')
    id: string,
  ) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Bad request. albumId is invalid (not uuid)',
      );
    }
    const album = await this.albumsService.findOne(id);

    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
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
    const album = await this.albumsService.update(id, updateAlbumDto);

    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Bad request. albumId is invalid (not uuid)',
      );
    }
    const album = await this.albumsService.remove(id);

    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }
}
