import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { validate } from 'uuid';
import { Track } from './entities/track.entity';
import { InMemoryDB } from 'src/db/dbInMemory';

@Injectable()
export class TracksService {
  create(createTrackDto: CreateTrackDto) {
    const newTrack = new Track(createTrackDto);
    InMemoryDB.tracks.push(newTrack);
    return newTrack;
  }

  findAll(): Track[] {
    return InMemoryDB.tracks;
  }

  findOne(id: string) {
    const track = InMemoryDB.tracks.find((element) => element.id === id);

    if (!validate(id)) {
      throw new BadRequestException();
    }

    if (!track) {
      throw new NotFoundException();
    }

    return track || null;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const index = InMemoryDB.tracks.findIndex((p) => p.id === id);
    if (index >= 0) {
      const upTrack = {
        id,
        name: updateTrackDto.name || InMemoryDB.tracks[index].name,
        albumId: updateTrackDto.albumId || InMemoryDB.tracks[index].albumId,
        artistId: updateTrackDto.artistId || InMemoryDB.tracks[index].artistId,
        duration: updateTrackDto.duration || +InMemoryDB.tracks[index].duration,
      };
      InMemoryDB.tracks[index] = upTrack;
      return upTrack;
    } else {
      return null;
    }
  }

  remove(id: string) {
    const trackToDelete = this.findOne(id);
    InMemoryDB.tracks = InMemoryDB.tracks.filter((el) => el.id !== id);
    return trackToDelete;
  }
}
