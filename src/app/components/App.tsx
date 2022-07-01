import React, { useState } from 'react'
import LocalStorageKey from '../types/LocalStorageKey'
import RequestType from '../types/RequestType'
import Preference from '../types/Preference'
import { videoInfo } from 'ytdl-core'
import Toolbar from './Toolbar'
import Preferences from './Preferences'
import PageType from '../types/PageType'
import Download from './Download'
import Library from './Library'

const { api } = window

const App: React.FC = () => {
  const [libraryFolder, setLibraryFolder] = useState(localStorage.getItem(LocalStorageKey.LibraryFolder) || '')
  const [youTubeUrl, setYouTubeUrl] = useState('https://www.youtube.com/watch?v=LwQpWb4y5Fc')
  const [videoInfo, setVideoInfo] = useState<videoInfo>()
  const [error, setError] = useState()
  const [bitrate, setBitrate] = useState(localStorage.getItem(LocalStorageKey.Bitrate) || '160')
  const [page, setPage] = useState(PageType.Download)

  if (!libraryFolder) api.send(RequestType.GetPreference, Preference.LibraryFolder).then(setLibraryFolder).catch(setError)

  return (
    <div className="max-w-4xl m-auto p-12">
      <h2 className="mb-8">n e b u l i s</h2>
      <Toolbar setPage={setPage} />
      {page === PageType.Download && (
        <Download
          youTubeUrl={youTubeUrl}
          setYouTubeUrl={setYouTubeUrl}
          videoInfo={videoInfo}
          setVideoInfo={setVideoInfo}
          libraryFolder={libraryFolder}
          bitrate={bitrate}
          error={error}
          setError={setError}
        />
      )}
      {page === PageType.Library && <Library libraryFolder={libraryFolder} error={error} setError={setError} />}
      {page === PageType.Preferences && (
        <Preferences
          libraryFolder={libraryFolder}
          setLibraryFolder={setLibraryFolder}
          bitrate={bitrate}
          setBitrate={setBitrate}
          setError={setError}
        />
      )}
    </div>
  )
}

export default App
