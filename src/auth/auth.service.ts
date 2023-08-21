import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { IToken } from 'src/interfaces/interfase';
import { compare } from 'bcrypt';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { IJwTToken } from 'src/interfaces/interfase';
import { IJWTData } from 'src/interfaces/interfase';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private async validateUser(
    login: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.usersService.findByLogin(login);

    if (!user || !(await compare(password, user.password))) {
      return null;
    }

    return user;
  }

  private generateToken = async (
    data: IJwTToken,
    options?: JwtSignOptions,
  ): Promise<string> => {
    return this.jwtService.sign(data, options);
  };

  private createTokens = async (data: IJwTToken): Promise<IToken> => {
    const user = { id: data.id, login: data.login };
    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken(user),
      this.generateToken(
        { ...user, isRefresh: true },
        { expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME },
      ),
    ]);

    return { accessToken, refreshToken };
  };

  async signup(createUserDto: CreateUserDto): Promise<User | null> {
    return await this.usersService.create(createUserDto);
  }

  async login(createUserDto: CreateUserDto): Promise<IToken | null> {
    const user = await this.validateUser(
      createUserDto.login,
      createUserDto.password,
    );
    return user
      ? await this.createTokens({ id: user.id, login: user.login })
      : null;
  }

  async refresh(updateAuthDto: UpdateAuthDto): Promise<IToken | null> {
    try {
      const jwtData: IJWTData = await this.jwtService.verifyAsync(
        updateAuthDto.refreshToken,
        { maxAge: process.env.TOKEN_REFRESH_EXPIRE_TIME },
      );
      const { id, login, isRefresh = false } = jwtData;
      const user = await this.usersService.findByLogin(login);

      if (user && user.id === id && isRefresh) {
        return await this.createTokens({ id: user.id, login: user.login });
      }

      return null;
    } catch (e) {
      return null;
    }
  }
}
