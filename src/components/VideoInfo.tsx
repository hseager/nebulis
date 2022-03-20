import React, { useState, useEffect } from 'react'
import { videoInfo } from 'ytdl-core'
import RequestType from '../types/RequestType'
import ResponseType from '../types/ResponseType'
import { convertSecondstoMintues } from '../utils/DateTime'

const { api } = window

type VideoInfoProps = {
  youTubeUrl: string
  downloadFolder: string
}

const VideoInfo = ({ youTubeUrl, downloadFolder }: VideoInfoProps) => {
  const [videoInfo, setVideoInfo] = useState<videoInfo>()

  useEffect(() => {
    api.receive(ResponseType.GetVideoInfo, (videoInfo: videoInfo) => {
      setVideoInfo(videoInfo)
    })
  }, [videoInfo])

  const getVideoInfo = () => {
    if (videoInfo)
      api.send(RequestType.DownloadVideo, {
        youTubeUrl,
        downloadFolder,
        videoId: videoInfo.videoDetails.videoId,
      })
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
          <button className="bg-indigo-900 px-2 py-1" onClick={getVideoInfo}>
            download
          </button>
        </div>
      )}
    </>
  )
}

export default VideoInfo
