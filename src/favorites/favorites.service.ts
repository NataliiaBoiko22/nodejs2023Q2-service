import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from '../albums/entities/album.entity';
import { Artist } from '../artists/entities/artist.entity';
import { Track } from '../tracks/entities/track.entity';
import { Favorite } from './entities/favorite.entity';
import { AlbumsService } from '../albums/albums.service';
import { ArtistsService } from '../artists/artists.service';
import { TracksService } from '../tracks/tracks.service';
@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    private albumService: AlbumsService,
    private artistService: ArtistsService,
    private trackService: TracksService,
  ) {}

  private filterArray = async (
    idToExclude: string,
    sourceArray: Array<Album | Artist | Track>,
  ): Promise<Array<Album | Artist | Track>> => {
    const filteredArray = sourceArray
      .slice()
      .filter((item) => item.id !== idToExclude);
    return filteredArray;
  };

  private isIdInArray = async (
    id: string,
    array: Array<Album | Artist | Track>,
  ): Promise<boolean> => {
    for (const item of array) {
      if (item.id === id) {
        return true;
      }
    }
    return false;
  };

  async findAll(): Promise<Favorite> {
    const favorites = await this.favoriteRepository.find({
      relations: {
        artists: true,
        albums: true,
        tracks: true,
      },
    });

    return favorites.length === 0
      ? await this.favoriteRepository.save({
          albums: [],
          artists: [],
          tracks: [],
        })
      : favorites[0];
  }

  async createAlbum(id: string): Promise<Album | null> {
    const album = await this.albumService.findOne(id);

    if (!album) {
      return null;
    }

    const favorites = await this.findAll();
    const isAlbumInFavorites = await this.isIdInArray(id, favorites.albums);

    if (!isAlbumInFavorites) {
      favorites.albums.push(album);
      await this.favoriteRepository.save(favorites);
    }

    return album;
  }

  async removeAlbum(id: string): Promise<boolean | null> {
    const favorites = await this.findAll();
    const isAlbumInFavorites = await this.isIdInArray(id, favorites.albums);

    if (!isAlbumInFavorites) {
      return null;
    }

    favorites.albums = (await this.filterArray(
      id,
      favorites.albums,
    )) as Array<Album>;
    await this.favoriteRepository.save(favorites);

    return true;
  }

  async createArtist(id: string): Promise<Artist | null> {
    const artist = await this.artistService.findOne(id);

    if (!artist) {
      return null;
    }

    const favorites = await this.findAll();
    const isArtistInFavorites = await this.isIdInArray(id, favorites.artists);

    if (!isArtistInFavorites) {
      favorites.artists.push(artist);
      await this.favoriteRepository.save(favorites);
    }

    return artist;
  }

  async removeArtist(id: string): Promise<boolean | null> {
    const favorites = await this.findAll();
    const isArtistInFavorites = await this.isIdInArray(id, favorites.artists);

    if (!isArtistInFavorites) {
      return null;
    }

    favorites.artists = (await this.filterArray(
      id,
      favorites.artists,
    )) as Array<Artist>;
    await this.favoriteRepository.save(favorites);

    return true;
  }

  async createTrack(id: string): Promise<Track | null> {
    const track = await this.trackService.findOne(id);

    if (!track) {
      return null;
    }

    const favorites = await this.findAll();
    const isTrackInFavorites = await this.isIdInArray(id, favorites.tracks);

    if (!isTrackInFavorites) {
      favorites.tracks.push(track);
      await this.favoriteRepository.save(favorites);
    }

    return track;
  }

  async removeTrack(id: string): Promise<boolean | null> {
    const favorites = await this.findAll();
    const isTrackInFavorites = await this.isIdInArray(id, favorites.tracks);

    if (!isTrackInFavorites) {
      return null;
    }

    favorites.tracks = (await this.filterArray(
      id,
      favorites.tracks,
    )) as Array<Track>;
    await this.favoriteRepository.save(favorites);

    return true;
  }
}
