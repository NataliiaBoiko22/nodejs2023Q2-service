import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { User } from './entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create({
      login: createUserDto.login,
      password: await hash(
        createUserDto.password,
        Number(process.env.CRYPT_SALT),
      ),
    });

    return await this.userRepository.save(user);
  }

  async findAll(): Promise<Array<User>> {
    return await this.userRepository.find();
  }

  async findByLogin(login: string): Promise<User> {
    return await this.userRepository.findOneBy({ login });
  }

  async findOne(id: string): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  async update(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User | string> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      return null;
    }
    if (!(await compare(updatePasswordDto.oldPassword, user.password))) {
      throw new ForbiddenException('oldPassword is wrong');
    }
    const userUpdated = {
      password: await hash(
        updatePasswordDto.newPassword,
        Number(process.env.CRYPT_SALT),
      ),
    };

    await this.userRepository.update({ id }, userUpdated);

    return await this.userRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<DeleteResult> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      return null;
    }

    return await this.userRepository.delete({ id });
  }
}
