import React from 'react'
import SearchBar from './SearchBar'
import VideoInfo from './VideoInfo'
import Error from './Error'
import { videoInfo } from 'ytdl-core'

type DownloadProps = {
  youTubeUrl: string
  setYouTubeUrl: Function
  videoInfo: videoInfo | undefined
  setVideoInfo: Function
  libraryFolder: string
  bitrate: string
  error: Error | undefined
  setError: Function
}

const Download = ({ youTubeUrl, setYouTubeUrl, videoInfo, setVideoInfo, libraryFolder, bitrate, error, setError }: DownloadProps) => {
  return (
    <>
      {error && <Error error={error} />}
      <SearchBar youTubeUrl={youTubeUrl} setYouTubeUrl={setYouTubeUrl} setVideoInfo={setVideoInfo} setError={setError} />
      {videoInfo && (
        <VideoInfo
          videoInfo={videoInfo}
          setVideoInfo={setVideoInfo}
          youTubeUrl={youTubeUrl}
          libraryFolder={libraryFolder}
          bitrate={bitrate}
          setError={setError}
        />
      )}
    </>
  )
}

export default Download
