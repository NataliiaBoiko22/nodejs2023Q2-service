import {
  Controller,
  Post,
  Body,
  HttpCode,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Public } from './guards/public';
import { UpdateAuthDto } from './dto/update-auth.dto';
@Controller({ path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(201)
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Public()
  @Post('login')
  @HttpCode(201)
  async login(@Body() createUserDto: CreateUserDto) {
    const login = await this.authService.login(createUserDto);

    if (!login) {
      throw new ForbiddenException('No user with such login, password.');
    }
    return login;
  }
  @Public()
  @Post('refresh')
  async refresh(@Body() updateAuthDto: UpdateAuthDto) {
    const newToken = this.authService.refresh(updateAuthDto);
    if (!newToken) {
      throw new ForbiddenException('Refresh token is invalid or expired');
    }
    return newToken;
  }
}
