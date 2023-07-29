import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';
import { CreateTrackDto } from './create-track.dto';

export class UpdateTrackDto extends PartialType(CreateTrackDto) {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  artistId: string | null;

  @IsString()
  @IsOptional()
  albumId: string | null;

  @IsNumber()
  @IsNotEmpty()
  duration: number;
}
