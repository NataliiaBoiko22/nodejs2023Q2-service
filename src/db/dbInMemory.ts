import { Injectable } from '@nestjs/common';
import { User, Album, Artist, Track, Favorites } from './interface';

@Injectable()
export class InMemoryDBService {
  albums: Album[] = [];
  artists: Artist[] = [];
  tracks: Track[] = [];
  users: User[] = [];
  favorites: Favorites[];

  private static _instance: InMemoryDBService;

  constructor() {
    if (!InMemoryDBService._instance) {
      InMemoryDBService._instance = this;
    }

    return InMemoryDBService._instance;
  }
  setArtistIdtoNull(artistId: string) {
    this.tracks.forEach((track) => {
      if (track.artistId == artistId) {
        track.artistId = null;
      }
    });
    this.albums.forEach((album) => {
      if (album.artistId == artistId) {
        album.artistId = null;
      }
    });
  }
  setAlbumIdtoNull(albumId: string) {
    this.tracks.forEach((track) => {
      if (track.albumId === albumId) {
        track.albumId = null;
      }
    });
  }
}
export const InMemoryDB = new InMemoryDBService();
