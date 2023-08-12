import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IArtist } from '../../interfaces/interfase';

@Entity('artists')
export class Artist implements IArtist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: false })
  grammy: boolean;

  constructor(artist: Partial<Artist>) {
    Object.assign(this, artist);
  }
}
