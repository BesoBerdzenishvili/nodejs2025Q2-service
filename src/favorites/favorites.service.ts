import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { Favorite } from './entities/favorite.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from '../artist/entities/artist.entity';
import { Track } from '../track/entities/track.entity';
import { Album } from '../album/entities/album.entity';
import { User } from '../user/entities/user.entity';

interface Database {
  users: User[];
  tracks: Track[];
  artists: Artist[];
  albums: Album[];
  favorites: {
    artists: Artist[];
    albums: Album[];
    tracks: Track[];
  };
}
type DBFavoriteFields = keyof Database['favorites'];

@Injectable()
export class FavoritesService {
  private repoMap: Record<DBFavoriteFields, Repository<any>> = {
    albums: this.albumsRepository,
    artists: this.artistsRepository,
    tracks: this.tracksRepository,
  };
  constructor(
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
    @InjectRepository(Album)
    private albumsRepository: Repository<Album>,
  ) {}

  async findAll() {
    const favorites = await this.favoritesRepository.find({
      relations: ['artists', 'albums', 'tracks'],
    });

    if (!favorites?.length) {
      return await this.createFavorites();
    }

    return favorites[0];
  }

  async addToFavorites(id: string, field: DBFavoriteFields) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    }

    const entity = await this.repoMap[field].findOneBy({ id });

    if (!entity) {
      throw new HttpException(
        "Entity doesn't exist",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const favorite = await this.findAll();
    const alreadyExists = favorite[field]?.some((entity) => entity.id === id);
    if (alreadyExists) {
      throw new HttpException(
        'Entity already exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    favorite[field] = [...favorite[field], entity];
    return await this.favoritesRepository.save(favorite);
  }

  async createFavorites() {
    const favorites = this.favoritesRepository.create({
      artists: [],
      albums: [],
      tracks: [],
    });
    return await this.favoritesRepository.save(favorites);
  }

  async removeFromFavorites(id: string, field: DBFavoriteFields) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    }
    const entity = await this.repoMap[field].findOneBy({ id });

    if (!entity) {
      throw new HttpException(
        "Entity doesn't exist",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const favorite = await this.favoritesRepository.findOne({
      relations: ['artists', 'albums', 'tracks'],
      where: {
        [field]: {
          id,
        },
      },
    });
    const entityIndex = favorite[field].findIndex((entity) => entity.id === id);
    if (entityIndex === -1) {
      throw new HttpException(
        "Entity doesn't exist",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    favorite[field].splice(entityIndex, 1);
    return await this.favoritesRepository.save(favorite);
  }
}
