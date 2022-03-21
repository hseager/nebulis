import React from 'react'
import RequestType from '../types/RequestType'

const { api } = window

type ControlProps = {
  youTubeUrl: string
  setYouTubeUrl: Function
  libraryFolder: string
}

const Controls = ({ youTubeUrl, setYouTubeUrl, libraryFolder }: ControlProps) => {
  const updateLibraryFolder = () => api.send(RequestType.UpdateLibraryFolder)
  const getVideoInfo = () => api.send(RequestType.GetVideoInfo, youTubeUrl)

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
