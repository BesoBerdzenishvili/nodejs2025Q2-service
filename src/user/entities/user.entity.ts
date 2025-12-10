import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

const timeToNumber = {
  to: (value: number | null) => value,
  from: (value: Date | null) => (value ? value.getTime() : null),
};

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  login: string;
  @Column()
  password: string;
  @VersionColumn()
  version: number;
  @CreateDateColumn({ type: 'timestamp', transformer: timeToNumber })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp', transformer: timeToNumber })
  updatedAt: Date;
}

export interface CreateUserDto {
  login: string;
  password: string;
}

export interface UpdatePasswordDto {
  oldPassword: string;
  newPassword: string;
}
