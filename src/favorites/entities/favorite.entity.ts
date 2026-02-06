import { Album } from '../../album/entities/album.entity';
import { Track } from '../../track/entities/track.entity';
import { Artist } from '../../artist/entities/artist.entity';
import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity('favorites')
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => Artist)
  @JoinTable()
  artists: Artist[];

  @ManyToMany(() => Album)
  @JoinTable()
  albums: Album[];

  @ManyToMany(() => Track)
  @JoinTable()
  tracks: Track[];
}

export interface Favorites {
  artists: string[];
  albums: string[];
  tracks: string[];
}

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
