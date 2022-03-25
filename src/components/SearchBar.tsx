import React from 'react'
import { videoInfo } from 'ytdl-core'
import RequestType from '../types/RequestType'

const { api } = window

type ControlProps = {
  youTubeUrl: string
  setYouTubeUrl: Function
  setVideoInfo: Function
  setError: Function
}

const SearchBar = ({ youTubeUrl, setYouTubeUrl, setVideoInfo, setError }: ControlProps) => {
  const getVideoInfo = () =>
    api
      .send(RequestType.GetVideoInfo, youTubeUrl)
      .then((videoInfo: videoInfo) => {
        console.log(videoInfo)
        setError('')
        setVideoInfo(videoInfo)
      })
      .catch(setError)

  return (
    <div className="bg-slate-800 p-4 mb-8">
      <label className="block">Youtube URL</label>
      <input type="text" value={youTubeUrl} className="w-3/4 bg-slate-200 text-slate-800 px-2 py-1 outline-none" onChange={(event) => setYouTubeUrl(event.target.value)} />
      <button className="bg-indigo-900 px-2 py-1" onClick={() => getVideoInfo()}>
        search
      </button>
    </div>
  )
}

export default SearchBar
