import { IsNotEmpty, IsString } from 'class-validator';
import { ILoginUserData } from '../../interfaces/interfase';

export class CreateAuthDto implements ILoginUserData {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
