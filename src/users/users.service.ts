import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
// import { User } from './interface';
import { v4 as uuidv4 } from 'uuid';
import { User } from './entities/user.entity';
const FORBIDDEN_STATUS = 403;

@Injectable()
export class UsersService {
  private usersDB: User[] = [];

  create(createUserDto: CreateUserDto) {
    const timestamp = new Date().getTime();
    const newUser = new User();
    newUser.id = uuidv4();
    newUser.login = createUserDto.login;
    newUser.password = createUserDto.password;
    newUser.version = 1;
    newUser.createdAt = timestamp;
    newUser.updatedAt = timestamp;

    this.usersDB.push(newUser);
    const { id, login, version, createdAt, updatedAt } = newUser;
    return { id, login, version, createdAt, updatedAt };
    // return newUser;
  }

  findAll() {
    if (this.usersDB.length === 0) {
      return [];
    }

    return this.usersDB.map((user) => ({
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  findOne(id: string) {
    const user: User | undefined = this.usersDB.find(
      (user: User) => user.id === id,
    );

    if (user) {
      return user;
    } else {
      return null;
    }
  }

  updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const index = this.usersDB.findIndex((p) => p.id === id);
    if (index >= 0) {
      const user = this.usersDB[index];

      if (updatePasswordDto.oldPassword === user.password) {
        const upUserWithoutpass = {
          id,
          login: user.login,
          version: +user.version + 1,
          createdAt: user.createdAt,
          updatedAt: +Date.now(),
        };
        this.usersDB[index] = {
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
    const index = this.usersDB.findIndex((user: User) => user.id === id);
    if (index !== -1) {
      this.usersDB.splice(index, 1);
      return true;
    } else {
      return null;
    }
  }
}
