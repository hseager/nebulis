import React, { useState } from 'react'
import LocalStorageKey from '../types/LocalStorageKey'
import Controls from './Controls'
import VideoInfo from './VideoInfo'
import Error from './Error'
import RequestType from '../types/RequestType'
import Preference from '../types/Preference'
import { videoInfo } from 'ytdl-core'

const { api } = window

const App: React.FC = () => {
  const [libraryFolder, setLibraryFolder] = useState(localStorage.getItem(LocalStorageKey.LibraryFolder) || '')
  const [youTubeUrl, setYouTubeUrl] = useState('https://www.youtube.com/watch?v=LwQpWb4y5Fc')
  const [videoInfo, setVideoInfo] = useState<videoInfo>()
  const [error, setError] = useState()

  if (!libraryFolder) api.send(RequestType.GetPreference, Preference.LibraryFolder).then(setLibraryFolder).catch(setError)

  return (
    <div className="max-w-2xl m-auto p-12">
      <h2 className="mb-8">n e b u l i s</h2>
      {error && <Error error={error} />}
      <Controls youTubeUrl={youTubeUrl} setYouTubeUrl={setYouTubeUrl} libraryFolder={libraryFolder} setLibraryFolder={setLibraryFolder} setVideoInfo={setVideoInfo} setError={setError} />
      <VideoInfo videoInfo={videoInfo} youTubeUrl={youTubeUrl} libraryFolder={libraryFolder} setError={setError} />
    </div>
  )
}

export default App
