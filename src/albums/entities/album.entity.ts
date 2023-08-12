import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Artist } from 'src/artists/entities/artist.entity';
import { IAlbum } from '../../interfaces/interfase';

@Entity('albums')
export class Album implements IAlbum {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  year: number;

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

  constructor(album: Partial<Album>) {
    Object.assign(this, album);
  }
}
