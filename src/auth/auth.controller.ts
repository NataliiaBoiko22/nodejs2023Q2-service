import {
  Controller,
  Post,
  Body,
  HttpCode,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Public } from './guards/public';
@Controller({ path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto) {
    await this.authService.signup(createUserDto);
    return { message: 'User created successfully' };
  }

  @Public()
  @Post('login')
  @HttpCode(201)
  async login(@Body() createAuthDto: CreateAuthDto) {
    const jwt = await this.authService.login(createAuthDto);

    if (!jwt) {
      throw new ForbiddenException('Incorrect login or password');
    }
    return jwt;
  }
}
