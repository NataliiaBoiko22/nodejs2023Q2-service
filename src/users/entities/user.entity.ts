import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { IUser } from '../../interfaces/interfase';

const dateTimeTransformer = {
  from: (date: Date) => date.getTime(),
  to: (date: Date) => date,
};
@Entity('users')
export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @VersionColumn()
  version: number;

  @CreateDateColumn({
    transformer: dateTimeTransformer,
  })
  createdAt: number;

  @UpdateDateColumn({
    transformer: dateTimeTransformer,
  })
  updatedAt: number;

  @Exclude()
  @Column()
  password: string;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
