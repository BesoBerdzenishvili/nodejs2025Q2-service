import { IsString, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateArtistDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsNotEmpty()
  grammy: boolean;
}

export class UpdateArtistDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsOptional()
  grammy?: boolean;
}
