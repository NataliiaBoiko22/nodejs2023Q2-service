import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private artistService: Repository<Artist>,
  ) {}
  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const artist = this.artistService.create(createArtistDto);

    return await this.artistService.save(artist);
  }

  async findAll(): Promise<Array<Artist>> {
    return await this.artistService.find();
  }

  async findOne(id: string): Promise<Artist | null> {
    return await this.artistService.findOneBy({ id });
  }

  async update(
    id: string,
    updateArtistDto: UpdateArtistDto,
  ): Promise<Artist | null> {
    const artist = await this.artistService.findOneBy({ id });

    if (!artist) {
      return null;
    }

    await this.artistService.update({ id }, updateArtistDto);

    return await this.artistService.findOneBy({ id });
  }

  async remove(id: string): Promise<DeleteResult> {
    const artist = await this.artistService.findOneBy({ id });

    if (!artist) {
      return null;
    }

    return await this.artistService.delete({ id });
  }
}
