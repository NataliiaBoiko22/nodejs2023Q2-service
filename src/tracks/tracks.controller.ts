import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Controller('track')
export class TracksController {
  constructor(private readonly trackService: TracksService) {}

  @Post()
  async create(@Body() createTrackDto: CreateTrackDto) {
    if (!createTrackDto.name || !createTrackDto.duration) {
      throw new BadRequestException(
        'Bad request. body does not contain required fields',
      );
    }
    return this.trackService.create(createTrackDto);
  }

  @Get()
  @HttpCode(StatusCodes.OK)
  async findAll() {
    return this.trackService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Bad request. trackId is invalid (not uuid)',
      );
    }
    const track = await this.trackService.findOne(id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  @Put(':id')
  async update(
    @Param('id')
    id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Bad request. trackId is invalid (not uuid)',
      );
    }
    if (!updateTrackDto.name || !updateTrackDto.duration) {
      throw new BadRequestException(
        'Bad request. body does not contain required fields',
      );
    }
    const track = await this.trackService.update(id, updateTrackDto);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  async remove(
    @Param('id')
    id: string,
  ) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Bad request. trackId is invalid (not uuid)',
      );
    }
    const track = await this.trackService.remove(id);

    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }
}
