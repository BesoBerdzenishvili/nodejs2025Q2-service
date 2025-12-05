import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('albums')
export class Album {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'uuid', nullable: true })
  artistId: string | null;
}

export interface CreateAlbumDto {
  name: string;
  year: number;
  artistId: string | null;
}

export interface UpdateAlbumDto {
  name?: string;
  year?: number;
  artistId?: string | null;
}
