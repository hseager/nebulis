import React, { useEffect, useState } from 'react'
import usePreferences from '../hooks/usePreferences'
import LocalStorageKey from '../types/LocalStorageKey'
import ResponseType from '../types/ResponseType'
import Controls from './Controls'
import VideoInfo from './VideoInfo'

const { api } = window

const App: React.FC = () => {
  const { libraryFolder, setLibraryFolder } = usePreferences()
  const [youTubeUrl, setYouTubeUrl] = useState('https://www.youtube.com/watch?v=LwQpWb4y5Fc')

  useEffect(() => {
    api.receive(ResponseType.UpdateLibraryFolder, (folder: string) => {
      setLibraryFolder(folder)
      localStorage.setItem(LocalStorageKey.LibraryFolder, folder)
    })
  }, [])

  return (
    <div className="max-w-2xl m-auto p-12">
      <h2 className="mb-8">n e b u l i s</h2>
      <Controls youTubeUrl={youTubeUrl} setYouTubeUrl={setYouTubeUrl} libraryFolder={libraryFolder} />
      <VideoInfo youTubeUrl={youTubeUrl} libraryFolder={libraryFolder} />
    </div>
  )
}

export default App
