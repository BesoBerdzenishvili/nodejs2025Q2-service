import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Artist } from './entities/artist.entity';
import { CreateArtistDto, UpdateArtistDto } from './dto/artist.dto';

@Injectable()
export class ArtistService {
  private artists: Artist[] = [];

  findAll(): Artist[] {
    return this.artists;
  }

  findOne(id: string): Artist {
    const artist = this.artists.find((a) => a.id === id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  exists(id: string): boolean {
    return this.artists.some((a) => a.id === id);
  }

  create(createArtistDto: CreateArtistDto): Artist {
    const artist: Artist = {
      id: randomUUID(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };
    this.artists.push(artist);
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto): Artist {
    const artist = this.artists.find((a) => a.id === id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    Object.assign(artist, updateArtistDto);
    return artist;
  }

  remove(id: string): void {
    const index = this.artists.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new NotFoundException('Artist not found');
    }
    this.artists.splice(index, 1);
  }
}
