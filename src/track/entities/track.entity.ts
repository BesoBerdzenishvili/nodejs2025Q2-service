import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('tracks')
export class Track {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'uuid', nullable: true })
  artistId: string | null;

  @Column({ type: 'uuid', nullable: true })
  albumId: string | null;

  @Column({ type: 'int' })
  duration: number;
}

export interface CreateTrackDto {
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;
}

export interface UpdateTrackDto {
  name?: string;
  artistId?: string | null;
  albumId?: string | null;
  duration?: number;
}
