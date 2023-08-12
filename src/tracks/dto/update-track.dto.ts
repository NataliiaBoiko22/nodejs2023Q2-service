import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class UpdateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsUUID()
  @IsOptional()
  artistId: string;

  @IsUUID()
  @IsOptional()
  albumId: string;
}
