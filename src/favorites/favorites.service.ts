import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { FavoritesResponse } from './entities/favorite.entity';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  async findAll(): Promise<FavoritesResponse> {
    const favorites = await this.favoritesRepository.find();

    const artists = [];
    const albums = [];
    const tracks = [];

    for (const fav of favorites) {
      if (fav.artistId) {
        try {
          const artist = await this.artistService.findOne(fav.artistId);
          artists.push(artist);
        } catch (err) {
          console.log(err);
        }
      }
      if (fav.albumId) {
        try {
          const album = await this.albumService.findOne(fav.albumId);
          albums.push(album);
        } catch (err) {
          console.log(err);
        }
      }
      if (fav.trackId) {
        try {
          const track = await this.trackService.findOne(fav.trackId);
          tracks.push(track);
        } catch (err) {
          console.log(err);
        }
      }
    }

    return { artists, albums, tracks };
  }

  async addArtist(id: string): Promise<void> {
    const exists = await this.artistService.exists(id);
    if (!exists) {
      throw new UnprocessableEntityException('Artist not found');
    }

    const existing = await this.favoritesRepository.findOne({
      where: { artistId: id },
    });
    if (!existing) {
      const favorite = this.favoritesRepository.create({
        id: Math.random().toString(36).substring(2, 15),
        artistId: id,
      });
      await this.favoritesRepository.save(favorite);
    }
  }

  async removeArtist(id: string): Promise<void> {
    const result = await this.favoritesRepository.delete({ artistId: id });
    if (result.affected === 0) {
      throw new NotFoundException('Artist is not in favorites');
    }
  }

  async addAlbum(id: string): Promise<void> {
    const exists = await this.albumService.exists(id);
    if (!exists) {
      throw new UnprocessableEntityException('Album not found');
    }

    const existing = await this.favoritesRepository.findOne({
      where: { albumId: id },
    });
    if (!existing) {
      const favorite = this.favoritesRepository.create({
        id: Math.random().toString(36).substring(2, 15),
        albumId: id,
      });
      await this.favoritesRepository.save(favorite);
    }
  }

  async removeAlbum(id: string): Promise<void> {
    const result = await this.favoritesRepository.delete({ albumId: id });
    if (result.affected === 0) {
      throw new NotFoundException('Album is not in favorites');
    }
  }

  async addTrack(id: string): Promise<void> {
    const exists = await this.trackService.exists(id);
    if (!exists) {
      throw new UnprocessableEntityException('Track not found');
    }

    const existing = await this.favoritesRepository.findOne({
      where: { trackId: id },
    });
    if (!existing) {
      const favorite = this.favoritesRepository.create({
        id: Math.random().toString(36).substring(2, 15),
        trackId: id,
      });
      await this.favoritesRepository.save(favorite);
    }
  }

  async removeTrack(id: string): Promise<void> {
    const result = await this.favoritesRepository.delete({ trackId: id });
    if (result.affected === 0) {
      throw new NotFoundException('Track is not in favorites');
    }
  }

  async removeArtistById(id: string): Promise<void> {
    await this.favoritesRepository.delete({ artistId: id });
  }

  async removeAlbumById(id: string): Promise<void> {
    await this.favoritesRepository.delete({ albumId: id });
  }

  async removeTrackById(id: string): Promise<void> {
    await this.favoritesRepository.delete({ trackId: id });
  }
}
