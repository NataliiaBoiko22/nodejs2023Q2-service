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

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
      },
    });
    return {
      ...user,
    };
    // const newUser = new User(createUserDto);
    // InMemoryDB.users.push(newUser);
    // const { id, login, version, createdAt, updatedAt } = newUser;
    // return { id, login, version, createdAt, updatedAt };
  }

  async findAll() {
    return this.prisma.user.findMany();
    // if (InMemoryDB.users.length === 0) {
    //   return [];
    // }
    // return InMemoryDB.users;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    return user || null;
    // const user: User | undefined = InMemoryDB.users.find(
    //   (user: User) => user.id === id,
    // );

    // if (user) {
    //   return user;
    // } else {
    //   return null;
    // }
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const userToUpdate = await this.prisma.user.findUnique({ where: { id } });

    Object.assign(userToUpdate, {
      password: updatePasswordDto.newPassword,
      version: userToUpdate.version + 1,
      updatedAt: Date.now(),
    });

    await this.prisma.user.update({
      where: { id },
      data: userToUpdate,
    });
    if (userToUpdate.password !== updatePasswordDto.oldPassword) {
      return FORBIDDEN_STATUS;
    }
    return userToUpdate;

    // const index = InMemoryDB.users.findIndex((p) => p.id === id);
    // if (index >= 0) {
    //   const user = InMemoryDB.users[index];

    //   if (updatePasswordDto.oldPassword === user.password) {
    //     const upUserWithoutpass = {
    //       id,
    //       login: user.login,
    //       version: +user.version + 1,
    //       createdAt: user.createdAt,
    //       updatedAt: +Date.now(),
    //     };
    //     InMemoryDB.users[index] = {
    //       ...upUserWithoutpass,
    //       password: updatePasswordDto.newPassword,
    //     };
    //     return upUserWithoutpass;
    //   } else {
    //     return FORBIDDEN_STATUS;
    //   }
    // } else {
    //   return null;
    // }
  }

  async remove(id: string) {
    const userToDelete = await this.prisma.user.findUnique({ where: { id } });

    await this.prisma.user.delete({ where: { id } });

    return userToDelete;
  }
  //   const user = this.findOne(id);

  //   if (user) {
  //     InMemoryDB.users = InMemoryDB.users.filter((u: User) => u.id !== id);
  //     return true;
  //   } else {
  //     return null;
  //   }
  // }
}
