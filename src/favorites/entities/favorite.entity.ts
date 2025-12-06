import { Album } from '../../album/entities/album.entity';
import { Track } from '../../track/entities/track.entity';
import { Artist } from '../../artist/entities/artist.entity';
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('favorites')
export class Favorite {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  artistId: string | null;

  @Column({ type: 'uuid', nullable: true })
  albumId: string | null;

  @Column({ type: 'uuid', nullable: true })
  trackId: string | null;
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
