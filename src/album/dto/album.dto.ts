import {
  IsString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  year: number;

  @IsOptional()
  @IsUUID()
  artistId: string | null;
}

export class UpdateAlbumDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @IsOptional()
  year?: number;

  @IsOptional()
  @IsUUID()
  artistId?: string | null;
}
