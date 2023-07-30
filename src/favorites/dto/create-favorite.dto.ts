import { Type } from 'class-transformer';
import { IsArray } from 'class-validator';
export class CreateFavoriteDto {
  @IsArray()
  @Type(() => String)
  artists: string[];

  @IsArray()
  @Type(() => String)
  albums: string[];

  @IsArray()
  @Type(() => String)
  tracks: string[];
}
