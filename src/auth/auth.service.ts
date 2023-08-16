import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { ITokenAnswer } from 'src/interfaces/interfase';
import { compare } from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async getRefreshToken(jwtPayload: JwtPayload) {
    const options = {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
    };
    return this.jwtService.sign(jwtPayload, options);
  }

  private validateUser = async (
    login: string,
    password: string,
  ): Promise<User | null> => {
    const user = await this.usersService.findByLogin(login);

    if (!user) {
      return null;
    }

    const isPasswordMatched = await compare(password, user.password);

    return isPasswordMatched ? user : null;
  };

  async signup(createAuthDto: CreateAuthDto): Promise<User | null> {
    return await this.usersService.create(createAuthDto);
  }

  async login(createAuthDto: CreateAuthDto): Promise<ITokenAnswer | null> {
    const user = await this.validateUser(
      createAuthDto.login,
      createAuthDto.password,
    );
    if (!user) {
      return null;
    }

    const jwtPayload: JwtPayload = {
      login: user.login,
      sub: user.id,
    };

    return {
      accessToken: this.jwtService.sign(jwtPayload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      }),
      refreshToken: await this.getRefreshToken(jwtPayload),
    };
  }
}
