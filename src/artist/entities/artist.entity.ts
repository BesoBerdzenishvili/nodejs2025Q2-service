import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('artists')
export class Artist {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'boolean', default: false })
  grammy: boolean;
}

export interface CreateArtistDto {
  name: string;
  grammy: boolean;
}

export interface UpdateArtistDto {
  name?: string;
  grammy?: boolean;
}
