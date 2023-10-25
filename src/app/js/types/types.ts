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
  GetLibraryData = 'get-library-data',
}

export enum Preference {
  LibraryFolder = 'libraryFolder',
}

export enum PageType {
  Download = 'download',
  Library = 'library',
  Preferences = 'preferences',
}

export type MetaData = {
  title: string
  artist: string
  album: string
  albumArtist: string
  genre: Array<string>
}

export type DownloadVideoRequest = { youTubeUrl: string; libraryFolder: string; bitrate: string; filename: string; metaData: MetaData }

export enum LocalStorageKey {
  LibraryData = 'libraryData',
  LibraryFolder = 'libraryFolder',
  Bitrate = 'bitrate',
  SplitArtistTitleChars = 'splitArtistTitleChars',
}
