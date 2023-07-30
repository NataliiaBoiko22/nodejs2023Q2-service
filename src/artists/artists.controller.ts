import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { validate as uuidValidate } from 'uuid';

@Controller({ path: 'artist' })
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Post()
  create(@Body() createArtistDto: CreateArtistDto) {
    if (!createArtistDto.name || !createArtistDto.grammy) {
      throw new BadRequestException(
        'Bad request. body does not contain required fields',
      );
    }
    return this.artistsService.create(createArtistDto);
  }

  @Get()
  findAll() {
    return this.artistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artistsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateArtistDto: UpdateArtistDto) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Bad request. artistId is invalid (not uuid)',
      );
    }
    if (
      !updateArtistDto ||
      !updateArtistDto.name ||
      updateArtistDto.grammy === undefined ||
      typeof updateArtistDto.grammy !== 'boolean'
    ) {
      throw new BadRequestException(
        'Bad request. body does not contain required fields',
      );
    }

    const artist = this.artistsService.update(id, updateArtistDto);
    if (artist === null) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Bad request. artistId is invalid (not uuid)',
      );
    }
    const artist = this.artistsService.remove(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }
}
