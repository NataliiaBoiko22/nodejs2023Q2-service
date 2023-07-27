import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { v4, validate } from 'uuid';
import { Track } from './entities/track.entity';

@Injectable()
export class TracksService {
  private trackDB: Track[] = [];
  create(createTrackDto: CreateTrackDto) {
    const newTrack = new Track();

    newTrack.id = v4();
    newTrack.name = createTrackDto.name;
    newTrack.artistId = createTrackDto.artistId;
    newTrack.albumId = createTrackDto.albumId;
    newTrack.duration = createTrackDto.duration;

    this.trackDB.push(newTrack);

    return newTrack;
  }

  findAll(): Track[] {
    return this.trackDB;
  }

  findOne(id: string) {
    const track = this.trackDB.find((element) => element.id === id);

    if (!validate(id)) {
      throw new BadRequestException();
    }

    if (!track) {
      throw new NotFoundException();
    }

    return track || null;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const index = this.trackDB.findIndex((p) => p.id === id);
    if (index >= 0) {
      const upTrack = {
        id,
        name: updateTrackDto.name || this.trackDB[index].name,
        albumId: updateTrackDto.albumId || this.trackDB[index].albumId,
        artistId: updateTrackDto.artistId || this.trackDB[index].artistId,
        duration: updateTrackDto.duration || +this.trackDB[index].duration,
      };
      this.trackDB[index] = upTrack;
      return upTrack;
    } else {
      return null;
    }
  }

  // remove(id: string, updateTrackDto: UpdateTrackDto) {
  //   const tracks = this.findAll();
  //   let count = 0;
  //   tracks.forEach((track) => {
  //     if (id === track.artistId || id === track.albumId) {
  //       this.update(track.id, updateTrackDto);
  //       count++;
  //     }
  //   });

  //   return count;
  // }
  remove(id: string) {
    const trackToDelete = this.findOne(id);

    this.trackDB = this.trackDB.filter((el) => el.id !== id);

    if (!validate(id)) {
      throw new BadRequestException();
    }

    if (!trackToDelete) {
      throw new NotFoundException();
    }

    return trackToDelete || null;
  }
}
