import { v4 as uuidv4 } from 'uuid';
import { CreateTrackDto } from '../dto/create-track.dto';
export class Track {
  id: string = uuidv4();
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;

  constructor(data: CreateTrackDto) {
    this.name = data.name;
    this.artistId = data.artistId;
    this.albumId = data.albumId;
    this.duration = data.duration;
  }
}
