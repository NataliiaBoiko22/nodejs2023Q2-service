import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { validate } from 'uuid';
import { InMemoryDB } from 'src/db/dbInMemory';
@Injectable()
export class AlbumsService {
  create(createAlbumDto: CreateAlbumDto) {
    const newAlbum = new Album(createAlbumDto);
    InMemoryDB.albums.push(newAlbum);
    return newAlbum;
  }

  findAll(): Album[] {
    return InMemoryDB.albums;
  }

  findOne(id: string) {
    const album = InMemoryDB.albums.find((element) => element.id === id);
    if (!validate(id)) {
      throw new BadRequestException();
    }
    if (!album) {
      throw new NotFoundException();
    }
    return album || null;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
    const index = InMemoryDB.albums.findIndex((p) => p.id === id);
    if (index >= 0) {
      const updAlbum = {
        id,
        name: updateAlbumDto.name || InMemoryDB.albums[index].name,
        year: updateAlbumDto.year || +InMemoryDB.albums[index].year,
        artistId: updateAlbumDto.artistId || InMemoryDB.albums[index].artistId,
      };
      InMemoryDB.albums[index] = updAlbum;
      return updAlbum;
    } else {
      return null;
    }
  }

  remove(id: string) {
    const album = this.findOne(id);
    InMemoryDB.setAlbumIdtoNull(album.id);
    InMemoryDB.albums = InMemoryDB.albums.filter((el) => el.id !== id);
    return true;
  }
}
