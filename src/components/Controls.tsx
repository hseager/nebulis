import React, { useState, useEffect } from 'react'
import usePreferences from '../hooks/usePreferences'
import RequestType from '../types/RequestType'
import ResponseType from '../types/ResponseType'
import LocalStorageKey from '../types/LocalStorageKey'

const { api } = window

const Controls: React.FC = () => {
  const { downloadFolderPreference } = usePreferences()

  const [downloadFolder, setDownloadFolder] = useState(downloadFolderPreference)

  const [youtubeUrl, setYoutubeUrl] = useState('https://www.youtube.com/watch?v=LwQpWb4y5Fc')

  useEffect(() => {
    api.receive(ResponseType.UpdateDownloadFolder, (folder: any) => {
      setDownloadFolder(folder)
      localStorage.setItem(LocalStorageKey.DownloadFolder, folder)
    })
  }, [downloadFolder])

  return (
    <>
      <div>
        <label>Library Folder</label>
        <input name="directory" type="text" value={downloadFolder} readOnly />
        <button onClick={() => api.send(RequestType.UpdateDownloadFolder)}>Change</button>
      </div>
      <div>
        <label>Youtube URL</label>
        <input type="text" value={youtubeUrl} />
        <button>Search</button>
      </div>
    </>
  )
}

export default Controls
