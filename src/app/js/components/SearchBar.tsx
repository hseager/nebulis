import React from 'react'
import { videoInfo } from '@distube/ytdl-core'
import RequestType from '../types/RequestType'
import Status from '../types/Status'
import { Search as SearchIcon } from 'react-feather'

const { api } = window

type ControlProps = {
  youTubeUrl: string
  setYouTubeUrl: Function
  setVideoInfo: Function
  setError: Function
  setStatus: Function
}

const SearchBar = ({ youTubeUrl, setYouTubeUrl, setVideoInfo, setError, setStatus }: ControlProps) => {
  const getVideoInfo = () => {
    setStatus(Status.GettingVideoInfo)
    api
      .send(RequestType.GetVideoInfo, youTubeUrl)
      .then((videoInfo: videoInfo) => {
        setError('')
        setVideoInfo(videoInfo)
      })
      .catch(setError)
      .finally(() => setStatus(Status.Ready))
  }

  return (
    <div className="bg-slate-700 p-4">
      <label className="block text-slate-300 mb-2">YouTube URL or video ID</label>
      <div className="flex items-center">
        <input
          type="text"
          value={youTubeUrl}
          className="w-full bg-slate-300 text-slate-800 px-4 py-2 outline-none"
          onChange={(event) => setYouTubeUrl(event.target.value)}
        />
        <button className="bg-indigo-700 px-8 h-9" onClick={() => getVideoInfo()}>
          <SearchIcon size={18} />
        </button>
      </div>
    </div>
  )
}

export default SearchBar
