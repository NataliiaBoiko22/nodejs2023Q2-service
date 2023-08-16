export interface IUser {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}
export interface ITrack {
  id: string;
  name: string;
  duration: number;
  artistId: string | null;
  albumId: string | null;
}
export interface IAlbum {
  id: string;
  name: string;
  year: number;
  artistId: string | null;
}
export interface IArtist {
  id: string;
  name: string;
  grammy: boolean;
}
export interface IFavorites {
  albums: Array<IAlbum>;
  artists: Array<IArtist>;
  tracks: Array<ITrack>;
}

export interface ICreateJwTToken {
  id: string;
  login: string;
  isRefresh?: boolean;
}
export interface ITokenAnswer {
  accessToken: string;
  refreshToken: string;
}
export interface IJWTData {
  id: string;
  login: string;
  iat: number;
  exp: number;
  isRefresh?: boolean;
}

export interface ILoginUserData {
  login: string;
  password: string;
}
