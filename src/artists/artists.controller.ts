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
  constructor(private readonly artistService: ArtistsService) {}

  @Post()
  async create(@Body() createArtistDto: CreateArtistDto) {
    if (!createArtistDto.name || !createArtistDto.grammy) {
      throw new BadRequestException(
        'Bad request. body does not contain required fields',
      );
    }
    return await this.artistService.create(createArtistDto);
  }

  @Get()
  async findAll() {
    return await this.artistService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id')
    id: string,
  ) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Bad request. artistId is invalid (not uuid)',
      );
    }
    const artist = await this.artistService.findOne(id);

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  @Put(':id')
  async update(
    @Param('id')
    id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
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
    const artist = await this.artistService.update(id, updateArtistDto);

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Bad request. artistId is invalid (not uuid)',
      );
    }
    const artist = await this.artistService.remove(id);

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }
}
