import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAuthDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
