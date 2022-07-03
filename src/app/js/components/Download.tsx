import React from 'react'
import SearchBar from './SearchBar'
import VideoInfo from './VideoInfo'
import Error from './Error'
import StatusBar from './StatusBar'
import { videoInfo } from 'ytdl-core'
import Status from '../types/Status'

type DownloadProps = {
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
}

const Download = ({
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
}: DownloadProps) => {
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
        />
      )}
    </>
  )
}

export default Download
