import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { validate } from 'uuid';
import { Artist } from './entities/artist.entity';
import { InMemoryDB } from 'src/db/dbInMemory';
@Injectable()
export class ArtistsService {
  create(createArtistDto: CreateArtistDto) {
    if (createArtistDto.name && createArtistDto.grammy) {
      const newArtist = new Artist(createArtistDto);
      InMemoryDB.artists.push(newArtist);
      return newArtist;
    } else {
      return null;
    }
  }

  findAll() {
    return InMemoryDB.artists;
  }

  findOne(id: string) {
    const artist = InMemoryDB.artists.find((element) => element.id === id);
    if (!validate(id)) {
      throw new BadRequestException();
    }
    if (!artist) {
      throw new NotFoundException();
    }
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const index = InMemoryDB.artists.findIndex((p) => p.id === id);
    if (index >= 0) {
      const upArtist = {
        id,
        name: updateArtistDto.name
          ? updateArtistDto.name
          : InMemoryDB.artists[index].name,
        grammy:
          typeof updateArtistDto.grammy === 'boolean'
            ? updateArtistDto.grammy
            : InMemoryDB.artists[index].grammy,
      };
      InMemoryDB.artists[index] = upArtist;
      return upArtist;
    } else {
      return null;
    }
  }

  remove(id: string) {
    const artist = this.findOne(id);
    InMemoryDB.setArtistIdtoNull(artist.id);
    InMemoryDB.artists = InMemoryDB.artists.filter(
      (artist) => artist.id !== id,
    );
    return artist;
  }
}
