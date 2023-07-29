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
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Controller({ path: 'track' })
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Post()
  create(@Body() createTrackDto: CreateTrackDto) {
    if (!createTrackDto.name || !createTrackDto.duration) {
      throw new BadRequestException(
        'Bad request. body does not contain required fields',
      );
    }
    return this.tracksService.create(createTrackDto);
  }

  @Get()
  findAll() {
    return this.tracksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tracksService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
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
    const track = this.tracksService.update(id, updateTrackDto);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Bad request. trackId is invalid (not uuid)',
      );
    }
    const track = this.tracksService.remove(id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
  }
}
