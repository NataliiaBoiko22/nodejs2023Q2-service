import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track)
    private tracksService: Repository<Track>,
  ) {}

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const track = this.tracksService.create(createTrackDto);

    return await this.tracksService.save(track);
  }

  async findAll(): Promise<Array<Track>> {
    return await this.tracksService.find();
  }

  async findOne(id: string): Promise<Track> {
    return await this.tracksService.findOneBy({ id });
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    const track = await this.tracksService.findOneBy({ id });

    if (!track) {
      return null;
    }

    await this.tracksService.update({ id }, updateTrackDto);

    return await this.tracksService.findOneBy({ id });
  }

  async remove(id: string): Promise<DeleteResult> {
    const track = await this.tracksService.findOneBy({ id });

    if (!track) {
      return null;
    }

    return await this.tracksService.delete({ id });
  }
}
