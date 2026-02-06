import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Track } from './entities/track.entity';
import { CreateTrackDto, UpdateTrackDto } from './dto/track.dto';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
  ) {}

  async findAll(): Promise<Track[]> {
    return this.tracksRepository.find();
  }

  async findOne(id: string): Promise<Track> {
    const track = await this.tracksRepository.findOne({ where: { id } });
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.tracksRepository.count({ where: { id } });
    return count > 0;
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const track = this.tracksRepository.create({
      id: randomUUID(),
      name: createTrackDto.name,
      artistId: createTrackDto.artistId,
      albumId: createTrackDto.albumId,
      duration: createTrackDto.duration,
    });
    return this.tracksRepository.save(track);
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    const track = await this.tracksRepository.findOne({ where: { id } });
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    Object.assign(track, updateTrackDto);
    return this.tracksRepository.save(track);
  }

  async remove(id: string): Promise<void> {
    const result = await this.tracksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Track not found');
    }
  }

  async nullifyArtistReferences(artistId: string): Promise<void> {
    await this.tracksRepository.update({ artistId }, { artistId: null });
  }

  async nullifyAlbumReferences(albumId: string): Promise<void> {
    await this.tracksRepository.update({ albumId }, { albumId: null });
  }
}
