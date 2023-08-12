import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { validate as uuidValidate } from 'uuid';
import { StatusCodes } from 'http-status-codes';
@Controller({ path: 'user' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto.login || !createUserDto.password) {
      throw new BadRequestException(
        'Bad request. Body does not contain required fields.',
      );
    }
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @HttpCode(StatusCodes.OK)
  async findOne(
    @Param('id')
    id: string,
  ) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Bad request. userId is invalid (not uuid)',
      );
    }
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
  @Put(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body() { oldPassword, newPassword }: UpdatePasswordDto,
  ) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Bad request. userId is invalid (not uuid)',
      );
    }
    if (!oldPassword || !newPassword) {
      throw new BadRequestException(
        'Bad request. Body does not contain required fields.',
      );
    }
    const user = await this.usersService.update(id, {
      oldPassword,
      newPassword,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(
    @Param('id')
    id: string,
  ) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Bad request. userId is invalid (not uuid)',
      );
    }
    const user = await this.usersService.remove(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
