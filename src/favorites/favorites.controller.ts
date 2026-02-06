import { Controller, Get, Post, Param, Delete, HttpCode } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async findAll() {
    return await this.favoritesService.findAll();
  }

  @Post('track/:id')
  async addTrackToFavorites(@Param('id') id: string) {
    return await this.favoritesService.addToFavorites(id, 'tracks');
  }

  @Post('album/:id')
  async addAlbumToFavorites(@Param('id') id: string) {
    return await this.favoritesService.addToFavorites(id, 'albums');
  }

  @Post('artist/:id')
  async addArtistToFavorites(@Param('id') id: string) {
    return await this.favoritesService.addToFavorites(id, 'artists');
  }

  @Delete('track/:id')
  @HttpCode(204)
  async removeTrackFromFavorites(@Param('id') id: string) {
    return await this.favoritesService.removeFromFavorites(id, 'tracks');
  }

  @Delete('album/:id')
  @HttpCode(204)
  async removeAlbumFromFavorites(@Param('id') id: string) {
    return await this.favoritesService.removeFromFavorites(id, 'albums');
  }

  @Delete('artist/:id')
  @HttpCode(204)
  async removeArtistFromFavorites(@Param('id') id: string) {
    return await this.favoritesService.removeFromFavorites(id, 'artists');
  }
}
