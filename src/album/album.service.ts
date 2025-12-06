import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Album } from './entities/album.entity';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/album.dto';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private albumsRepository: Repository<Album>,
    private readonly trackService: TrackService,
  ) {}

  async findAll(): Promise<Album[]> {
    return this.albumsRepository.find();
  }

  async findOne(id: string): Promise<Album> {
    const album = await this.albumsRepository.findOne({ where: { id } });
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.albumsRepository.count({ where: { id } });
    return count > 0;
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const album = this.albumsRepository.create({
      id: randomUUID(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId,
    });
    return this.albumsRepository.save(album);
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const album = await this.albumsRepository.findOne({ where: { id } });
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    Object.assign(album, updateAlbumDto);
    return this.albumsRepository.save(album);
  }

  async remove(id: string): Promise<void> {
    const result = await this.albumsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Album not found');
    }
    await this.trackService.nullifyAlbumReferences(id);
  }

  async nullifyArtistReferences(artistId: string): Promise<void> {
    await this.albumsRepository.update({ artistId }, { artistId: null });
  }
}
