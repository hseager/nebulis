import React from 'react'
import SearchBar from './SearchBar'
import VideoInfo from './VideoInfo'
import Error from './Error'
import StatusBar from './StatusBar'
import { videoInfo } from '@distube/ytdl-core'
import { Status } from '../types/types'

type DownloadPageProps = {
  youTubeUrl: string
  setYouTubeUrl: Function
  videoInfo: videoInfo | undefined
  setVideoInfo: Function
  libraryFolder: string
  bitrate: string
  error: Error | undefined
  setError: Function
  status: Status
  setStatus: Function
  splitArtistTitleChars: string
  includeArtistInFolderPath: boolean
  includeAlbumInFolderPath: boolean
}

const DownloadPage = ({
  youTubeUrl,
  setYouTubeUrl,
  videoInfo,
  setVideoInfo,
  libraryFolder,
  bitrate,
  error,
  setError,
  status,
  setStatus,
  splitArtistTitleChars,
  includeArtistInFolderPath,
  includeAlbumInFolderPath,
}: DownloadPageProps) => {
  return (
    <>
      {error && <Error error={error} />}
      <SearchBar
        youTubeUrl={youTubeUrl}
        setYouTubeUrl={setYouTubeUrl}
        setVideoInfo={setVideoInfo}
        setError={setError}
        setStatus={setStatus}
      />
      {status !== Status.Ready && <StatusBar setStatus={setStatus} status={status} />}
      {videoInfo && (
        <VideoInfo
          videoInfo={videoInfo}
          setVideoInfo={setVideoInfo}
          youTubeUrl={youTubeUrl}
          libraryFolder={libraryFolder}
          bitrate={bitrate}
          setError={setError}
          setStatus={setStatus}
          splitArtistTitleChars={splitArtistTitleChars}
          includeArtistInFolderPath={includeArtistInFolderPath}
          includeAlbumInFolderPath={includeAlbumInFolderPath}
        />
      )}
    </>
  )
}

export default DownloadPage
