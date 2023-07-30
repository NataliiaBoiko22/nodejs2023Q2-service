import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InMemoryDB } from 'src/db/dbInMemory';

@Injectable()
export class FavoritesService {
  create(type: 'track' | 'artist' | 'album', id: string) {
    switch (type) {
      case 'track':
        return this.addToFavorites(
          InMemoryDB.tracks,
          InMemoryDB.favorites.tracks,
          id,
        );
      case 'artist':
        return this.addToFavorites(
          InMemoryDB.artists,
          InMemoryDB.favorites.artists,
          id,
        );
      case 'album':
        return this.addToFavorites(
          InMemoryDB.albums,
          InMemoryDB.favorites.albums,
          id,
        );
      default:
        break;
    }
  }

  private addToFavorites(source: any[], favorites: string[], id: string) {
    const item = source.find((item) => item.id === id);
    if (item) {
      if (!favorites.includes(id)) {
        favorites.push(id);
      }
      return true;
    } else {
      throw new UnprocessableEntityException('Entity not found.');
    }
  }

  findAll() {
    const result = { artists: [], albums: [], tracks: [] };

    result.tracks = InMemoryDB.tracks.filter((track) =>
      InMemoryDB.favorites.tracks.includes(track.id),
    );

    result.artists = InMemoryDB.artists.filter((artist) =>
      InMemoryDB.favorites.artists.includes(artist.id),
    );

    result.albums = InMemoryDB.albums.filter((album) =>
      InMemoryDB.favorites.albums.includes(album.id),
    );

    return result;
  }

  remove(type: 'track' | 'artist' | 'album', id: string) {
    switch (type) {
      case 'track':
        return this.removeFromFavorites(InMemoryDB.favorites.tracks, id);
      case 'artist':
        return this.removeFromFavorites(InMemoryDB.favorites.artists, id);
      case 'album':
        return this.removeFromFavorites(InMemoryDB.favorites.albums, id);
      default:
        return false;
    }
  }

  private removeFromFavorites(favorites: string[], id: string) {
    const index = favorites.indexOf(id);
    if (index !== -1) {
      favorites.splice(index, 1);
      return true;
    }
    return false;
  }
}
