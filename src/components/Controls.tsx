import React from 'react'
import { videoInfo } from 'ytdl-core'
import LocalStorageKey from '../types/LocalStorageKey'
import RequestType from '../types/RequestType'

const { api } = window

type ControlProps = {
  youTubeUrl: string
  setYouTubeUrl: Function
  libraryFolder: string
  setLibraryFolder: Function
  setVideoInfo: Function
  setError: Function
}

const Controls = ({ youTubeUrl, setYouTubeUrl, libraryFolder, setLibraryFolder, setVideoInfo, setError }: ControlProps) => {
  const updateLibraryFolder = () =>
    api
      .send(RequestType.UpdateLibraryFolder)
      .then((path: string) => {
        setLibraryFolder(path)
        localStorage.setItem(LocalStorageKey.LibraryFolder, path)
      })
      .catch(setError)

  const getVideoInfo = () =>
    api
      .send(RequestType.GetVideoInfo, youTubeUrl)
      .then((videoInfo: videoInfo) => {
        setError('')
        setVideoInfo(videoInfo)
      })
      .catch(setError)

  return (
    <div className="bg-slate-800 p-4 mb-8">
      <div className="mb-4">
        <label className="block">Library Folder</label>
        <input name="directory" type="text" className="w-3/4 bg-slate-200 text-slate-800 px-2 py-1 outline-none" value={libraryFolder} readOnly />
        <button onClick={() => updateLibraryFolder()} className="bg-indigo-900 px-2 py-1">
          change
        </button>
      </div>
      <div>
        <label className="block">Youtube URL</label>
        <input type="text" value={youTubeUrl} className="w-3/4 bg-slate-200 text-slate-800 px-2 py-1 outline-none" onChange={(event) => setYouTubeUrl(event.target.value)} />
        <button className="bg-indigo-900 px-2 py-1" onClick={() => getVideoInfo()}>
          search
        </button>
      </div>
    </div>
  )
}

export default Controls
