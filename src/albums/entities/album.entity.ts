import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto } from '../dto/create-album.dto';
export class Album {
  id = uuidv4();
  name: string;
  year: number;
  artistId: string | null;
  constructor(data: CreateAlbumDto) {
    this.name = data.name;
    this.year = data.year;
    this.artistId = data.artistId;
  }
}
