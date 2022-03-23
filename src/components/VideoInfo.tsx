import React from 'react'
import { videoInfo } from 'ytdl-core'
import RequestType from '../types/RequestType'
import { convertSecondstoMintues } from '../utils/DateTime'

const { api } = window

type VideoInfoProps = {
  videoInfo: videoInfo | undefined
  youTubeUrl: string
  libraryFolder: string
  setError: Function
}

const VideoInfo = ({ videoInfo, youTubeUrl, libraryFolder, setError }: VideoInfoProps) => {
  const download = () => {
    if (videoInfo) {
      api
        .send(RequestType.Download, {
          youTubeUrl,
          libraryFolder,
          videoId: videoInfo.videoDetails.videoId,
        })
        .then(() => console.log('Done!!!'))
        .catch(setError)
    }
  }

  return (
    <>
      {videoInfo && (
        <div className="bg-slate-800 p-4 mb-8">
          <h2>video info</h2>
          <ul className="my-4">
            <li>Title: {videoInfo.videoDetails.title}</li>
            <li>Author: {videoInfo.videoDetails.author.name}</li>
            <li>Length: {convertSecondstoMintues(videoInfo.videoDetails.lengthSeconds)}</li>
            <img src={videoInfo.videoDetails.thumbnails[0].url} />
          </ul>
          <button className="bg-indigo-900 px-2 py-1" onClick={download}>
            download
          </button>
        </div>
      )}
    </>
  )
}

export default VideoInfo
