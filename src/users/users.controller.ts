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
  ForbiddenException,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { validate as uuidValidate } from 'uuid';
const FORBIDDEN_STATUS = 403;

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
  findOne(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Bad request. userId is invalid (not uuid)',
      );
    }
    const user = this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Put(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Bad request. userId is invalid (not uuid)',
      );
    }
    if (!updatePasswordDto.oldPassword || !updatePasswordDto.newPassword) {
      throw new BadRequestException(
        'Bad request. Body does not contain required fields.',
      );
    }
    const user = await this.usersService.updatePassword(id, updatePasswordDto);
    if (user === FORBIDDEN_STATUS) {
      throw new ForbiddenException('oldPassword is wrong');
    }
    if (user === null) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Bad request. userId is invalid (not uuid)',
      );
    }
    const user = this.usersService.remove(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  }
}
