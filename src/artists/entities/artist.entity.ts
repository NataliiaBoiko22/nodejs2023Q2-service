import { v4 as uuidv4 } from 'uuid';
import { CreateArtistDto } from '../dto/create-artist.dto';
export class Artist {
  id = uuidv4();
  name: string;
  grammy: boolean;
  constructor(data: CreateArtistDto) {
    this.name = data.name;
    this.grammy = data.grammy;
  }
}
