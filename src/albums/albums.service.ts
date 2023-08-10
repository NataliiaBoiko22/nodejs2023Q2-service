import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ArtistsService } from '../artists/artists.service';
@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private albumService: Repository<Album>,
    private artistService: ArtistsService,
  ) {}

  private checkAndMakeCorrectIdArtist = async (
    options: CreateAlbumDto | UpdateAlbumDto,
  ): Promise<void> => {
    const artist = await this.artistService.findOne(options.artistId);

    if (!artist) {
      options.artistId = null;
    }
  };

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    if (createAlbumDto.artistId) {
      await this.checkAndMakeCorrectIdArtist(createAlbumDto);
    }

    const album = await this.albumService.create(createAlbumDto);

    return await this.albumService.save(album);
  }

  async findAll(): Promise<Array<Album>> {
    return await this.albumService.find();
  }

  async findOne(id: string): Promise<Album | null> {
    return await this.albumService.findOneBy({ id });
  }

  async update(
    id: string,
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album | null> {
    if (updateAlbumDto.artistId) {
      await this.checkAndMakeCorrectIdArtist(updateAlbumDto);
    }

    const album = await this.albumService.findOneBy({ id });

    if (!album) {
      return null;
    }

    await this.albumService.update({ id }, updateAlbumDto);

    return await this.albumService.findOneBy({ id });
  }

  async remove(id: string): Promise<DeleteResult> {
    const album = await this.albumService.findOneBy({ id });

    if (!album) {
      return null;
    }

    return await this.albumService.delete({ id });
  }
}
