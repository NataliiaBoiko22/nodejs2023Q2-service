import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InMemoryDB } from 'src/db/dbInMemory';
const FORBIDDEN_STATUS = 403;
import { PrismaService } from 'src/prisma/prisma.service';
import { v4, validate } from 'uuid';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    const newUser = new User(createUserDto);
    InMemoryDB.users.push(newUser);
    const { id, login, version, createdAt, updatedAt } = newUser;
    return { id, login, version, createdAt, updatedAt };
  }

  async findAll() {
    if (InMemoryDB.users.length === 0) {
      return [];
    }
    return InMemoryDB.users;
  }

  async findOne(id: string) {
    const user: User | undefined = InMemoryDB.users.find(
      (user: User) => user.id === id,
    );

    if (user) {
      return user;
    } else {
      return null;
    }
  }

  updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const index = InMemoryDB.users.findIndex((p) => p.id === id);
    if (index >= 0) {
      const user = InMemoryDB.users[index];

      if (updatePasswordDto.oldPassword === user.password) {
        const upUserWithoutpass = {
          id,
          login: user.login,
          version: +user.version + 1,
          createdAt: user.createdAt,
          updatedAt: +Date.now(),
        };
        InMemoryDB.users[index] = {
          ...upUserWithoutpass,
          password: updatePasswordDto.newPassword,
        };
        return upUserWithoutpass;
      } else {
        return FORBIDDEN_STATUS;
      }
    } else {
      return null;
    }
  }

  remove(id: string) {
    const user = this.findOne(id);

    if (user) {
      InMemoryDB.users = InMemoryDB.users.filter((u: User) => u.id !== id);
      return true;
    } else {
      return null;
    }
  }
}
