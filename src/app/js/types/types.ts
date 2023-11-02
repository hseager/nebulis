export type API = {
  send: (channel: RequestType, data?: unknown) => Promise<any>
  receive: (channel: ResponseType, func: Function) => void
  cleanup: (channel: ResponseType) => void
}

export enum Status {
  Ready = 'ready',
  GettingVideoInfo = 'getting-video-info',
  Downloading = 'downloading',
  Converting = 'converting',
}

export type Song = {
  filename: string
  title: string | number
  artist: string | number
  album: string | number
}

export enum ResponseType {
  DownloadProgress = 'download-progress',
  ConversionProgress = 'conversion-progress',
}

export enum RequestType {
  UpdateLibraryFolder = 'update-library-folder-request',
  GetPreference = 'get-preference-request',
  GetVideoInfo = 'get-video-info-request',
  DownloadVideo = 'download-video-request',
}

export enum Preference {
  LibraryFolder = 'libraryFolder',
}

export enum PageType {
  Download = 'download',
  Preferences = 'preferences',
}

export type MetaData = {
  title: string
  artist: string
  album: string
  albumArtist: string
  genre: string
  trackNumber: string
}

export type DirectorySettings = {
  libraryFolder: string
  includeArtistInFolderPath?: boolean
  includeAlbumInFolderPath?: boolean
}

export type DownloadVideoRequest = {
  youTubeUrl: string
  bitrate: string
  filename: string
  metaData: MetaData
  directorySettings: DirectorySettings
}

export enum LocalStorageKey {
  LibraryFolder = 'libraryFolder',
  Bitrate = 'bitrate',
  SplitArtistTitleChars = 'splitArtistTitleChars',
  IncludeArtistInFolderPath = 'includeArtistInFolderPath',
  IncludeAlbumInFolderPath = 'includeAlbumInFolderPath',
}
