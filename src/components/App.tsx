import React, { useEffect, useState } from 'react'
import usePreferences from '../hooks/usePreferences'
import LocalStorageKey from '../types/LocalStorageKey'
import ResponseType from '../types/ResponseType'
import Controls from './Controls'
import VideoInfo from './VideoInfo'
import Error from './Error'

const { api } = window

const App: React.FC = () => {
  const { libraryFolder, setLibraryFolder } = usePreferences()
  const [youTubeUrl, setYouTubeUrl] = useState('https://www.youtube.com/watch?v=LwQpWb4y5Fc')
  const [error, setError] = useState()

  useEffect(() => {
    api.receive(ResponseType.UpdateLibraryFolder, (folder: string) => {
      setLibraryFolder(folder)
      localStorage.setItem(LocalStorageKey.LibraryFolder, folder)
    })
  }, [])

  return (
    <div className="max-w-2xl m-auto p-12">
      <h2 className="mb-8">n e b u l i s</h2>
      {error && <Error error={error} />}
      <Controls youTubeUrl={youTubeUrl} setYouTubeUrl={setYouTubeUrl} libraryFolder={libraryFolder} setError={setError} />
      <VideoInfo youTubeUrl={youTubeUrl} libraryFolder={libraryFolder} setError={setError} />
    </div>
  )
}

export default App
