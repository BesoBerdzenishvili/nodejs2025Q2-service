import { Module, forwardRef } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { FavoritesModule } from '../favorites/favorites.module';
import { Track } from './entities/track.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    forwardRef(() => FavoritesModule),
    TypeOrmModule.forFeature([Track]),
  ],
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
})
export class TrackModule {}
