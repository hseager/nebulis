import React, { useEffect, useState } from 'react'
import usePreferences from '../hooks/usePreferences'
import LocalStorageKey from '../types/LocalStorageKey'
import ResponseType from '../types/ResponseType'
import Controls from './Controls'
import VideoInfo from './VideoInfo'

const { api } = window

const App: React.FC = () => {
  const { downloadFolder, setDownloadFolder } = usePreferences()
  const [youTubeUrl, setYouTubeUrl] = useState('https://www.youtube.com/watch?v=LwQpWb4y5Fc')

  useEffect(() => {
    api.receive(ResponseType.UpdateDownloadFolder, (folder: string) => {
      setDownloadFolder(folder)
      localStorage.setItem(LocalStorageKey.DownloadFolder, folder)
    })
  }, [])

  return (
    <div className="max-w-2xl m-auto p-12">
      <h2 className="mb-8">n e b u l i s</h2>
      <Controls youTubeUrl={youTubeUrl} setYouTubeUrl={setYouTubeUrl} downloadFolder={downloadFolder} />
      <VideoInfo youTubeUrl={youTubeUrl} downloadFolder={downloadFolder} />
    </div>
  )
}

export default App
