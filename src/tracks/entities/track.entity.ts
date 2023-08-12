import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Album } from 'src/albums/entities/album.entity';
import { Artist } from 'src/artists/entities/artist.entity';
import { ITrack } from '../../interfaces/interfase';

@Entity('tracks')
export class Track implements ITrack {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  albumId: string | null;

  @ManyToOne(() => Album, (album) => album.id, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({
    name: 'albumId',
    referencedColumnName: 'id',
  })
  album: string | null;

  @Column({ nullable: true })
  artistId: string | null;

  @ManyToOne(() => Artist, (artist) => artist.id, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({
    name: 'artistId',
    referencedColumnName: 'id',
  })
  artist: string | null;

  @Column()
  duration: number;

  constructor(track: Partial<Track>) {
    Object.assign(this, track);
  }
}
