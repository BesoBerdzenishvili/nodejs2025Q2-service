import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Artist } from './entities/artist.entity';
import { CreateArtistDto, UpdateArtistDto } from './dto/artist.dto';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
  ) {}

  async findAll(): Promise<Artist[]> {
    return this.artistsRepository.find();
  }

  async findOne(id: string): Promise<Artist> {
    const artist = await this.artistsRepository.findOne({ where: { id } });
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.artistsRepository.count({ where: { id } });
    return count > 0;
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const artist = this.artistsRepository.create({
      id: randomUUID(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    });
    return this.artistsRepository.save(artist);
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.artistsRepository.findOne({ where: { id } });
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    Object.assign(artist, updateArtistDto);
    return this.artistsRepository.save(artist);
  }

  async remove(id: string): Promise<void> {
    const result = await this.artistsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Artist not found');
    }

    await this.trackService.nullifyArtistReferences(id);
    await this.albumService.nullifyArtistReferences(id);
  }
}
