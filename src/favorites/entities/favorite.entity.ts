import { Exclude } from 'class-transformer';
import { Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Album } from 'src/albums/entities/album.entity';
import { Artist } from 'src/artists/entities/artist.entity';
import { Track } from 'src/tracks/entities/track.entity';
import { IFavorites } from '../../interfaces/interfase';

@Entity('favorites')
export class Favorite implements IFavorites {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @ManyToMany(() => Album, { eager: true })
  @JoinTable()
  albums: Array<Album>;

  @ManyToMany(() => Artist, { eager: true })
  @JoinTable()
  artists: Array<Artist>;

  @ManyToMany(() => Track, { eager: true })
  @JoinTable()
  tracks: Array<Track>;
}
