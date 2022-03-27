import React, { useState } from 'react'
import { videoInfo } from 'ytdl-core'
import RequestType from '../types/RequestType'
import { convertSecondstoMintues } from '../utils/DateTime'

const { api } = window

type VideoInfoProps = {
  videoInfo: videoInfo | undefined
  youTubeUrl: string
  libraryFolder: string
  setError: Function
  bitrate: string
}

const VideoInfo = ({ videoInfo, youTubeUrl, libraryFolder, bitrate, setError }: VideoInfoProps) => {
  const [filename, setFilename] = useState(videoInfo?.videoDetails.title || '')

  const download = () => {
    if (videoInfo) {
      api
        .send(RequestType.Download, {
          youTubeUrl,
          libraryFolder,
          videoId: videoInfo.videoDetails.videoId,
          bitrate,
          filename,
        })
        .then(() => console.log('Done!!!'))
        .catch(setError)
    }
  }

  return (
    <>
      {videoInfo && (
        <div className="bg-slate-800 p-4 mb-8">
          <h2>Video Info</h2>
          <div className="flex justify-between">
            <ul className="my-4">
              <li>Title: {videoInfo.videoDetails.title}</li>
              <li>Author: {videoInfo.videoDetails.author.name}</li>
              <li>Length: {convertSecondstoMintues(videoInfo.videoDetails.lengthSeconds)}</li>
            </ul>
            <img src={videoInfo.videoDetails.thumbnails[0].url} />
          </div>
          <form className="my-4">
            <label className="block">Filename</label>
            <input className="w-3/4 bg-slate-200 text-slate-800 px-2 py-1 outline-none" type="text" name="filename" value={filename} onChange={(e) => setFilename(e.target.value)} />
          </form>
          <button className="bg-indigo-900 px-2 py-1" onClick={download}>
            download
          </button>
        </div>
      )}
    </>
  )
}

export default VideoInfo
