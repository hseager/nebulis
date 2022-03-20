import React, { useState, useEffect } from 'react'
import usePreferences from '../hooks/usePreferences'
import RequestType from '../types/RequestType'
import ResponseType from '../types/ResponseType'
import LocalStorageKey from '../types/LocalStorageKey'

const { api } = window

const Controls: React.FC = () => {
  const { downloadFolderPreference } = usePreferences()

  const [youtubeUrl, setYoutubeUrl] = useState('https://www.youtube.com/watch?v=LwQpWb4y5Fc')
  const [downloadFolder, setDownloadFolder] = useState(downloadFolderPreference)

  const updateDownloadFolder = () => api.send(RequestType.UpdateDownloadFolder)
  const getVideoInfo = () => api.send(RequestType.GetVideoInfo, youtubeUrl)

  useEffect(() => {
    api.receive(ResponseType.UpdateDownloadFolder, (folder: any) => {
      setDownloadFolder(folder)
      localStorage.setItem(LocalStorageKey.DownloadFolder, folder)
    })
  }, [downloadFolder])

  return (
    <div className="bg-slate-800 p-4 mb-8">
      <div className="mb-4">
        <label className="block">Library Folder</label>
        <input name="directory" type="text" className="w-3/4 bg-slate-200 text-slate-800 px-2 py-1 outline-none" value={downloadFolder} readOnly />
        <button onClick={() => updateDownloadFolder()} className="bg-indigo-900 px-2 py-1">
          change
        </button>
      </div>
      <div>
        <label className="block">Youtube URL</label>
        <input type="text" value={youtubeUrl} className="w-3/4 bg-slate-200 text-slate-800 px-2 py-1 outline-none" onChange={(event) => setYoutubeUrl(event.target.value)} />
        <button className="bg-indigo-900 px-2 py-1" onClick={() => getVideoInfo()}>
          search
        </button>
      </div>
    </div>
  )
}

export default Controls
