import React, { useState } from 'react'
import { videoInfo } from '@distube/ytdl-core'
import Toolbar from './Toolbar'
import PreferencesPage from './PreferencesPage'
import DownloadPage from './DownloadPage'
import { LocalStorageKey, PageType, Preference, RequestType, Status } from '../types/types'

const { api } = window

const App: React.FC = () => {
  const defaults = {
    bitrate: '160',
    splitArtistTitleChars: '-~|',
    includeArtistInFolderPath: false,
    includeAlbumInFolderPath: false,
  }

  const [libraryFolder, setLibraryFolder] = useState(localStorage.getItem(LocalStorageKey.LibraryFolder) || '')
  const [youTubeUrl, setYouTubeUrl] = useState('')
  const [videoInfo, setVideoInfo] = useState<videoInfo>()
  const [error, setError] = useState<Error>()
  const [bitrate, setBitrate] = useState(localStorage.getItem(LocalStorageKey.Bitrate) || defaults.bitrate)
  const [page, setPage] = useState(PageType.Download)
  const [status, setStatus] = useState<Status>(Status.Ready)
  const [splitArtistTitleChars, setSplitArtistTitleChars] = useState(
    localStorage.getItem(LocalStorageKey.SplitArtistTitleChars) || defaults.splitArtistTitleChars
  )
  const [includeArtistInFolderPath, setIncludeArtistInFolderPath] = useState(
    localStorage.getItem(LocalStorageKey.IncludeArtistInFolderPath) === 'true' || defaults.includeArtistInFolderPath
  )
  const [includeAlbumInFolderPath, setIncludeAlbumInFolderPath] = useState(
    localStorage.getItem(LocalStorageKey.IncludeAlbumInFolderPath) === 'true' || defaults.includeAlbumInFolderPath
  )

  if (!libraryFolder) api.send(RequestType.GetPreference, Preference.LibraryFolder).then(setLibraryFolder).catch(setError)

  return (
    <div className="max-w-4xl m-auto p-12">
      <h2 className="mb-8">n e b u l i s</h2>
      <Toolbar setPage={setPage} />
      {page === PageType.Download && (
        <DownloadPage
          youTubeUrl={youTubeUrl}
          setYouTubeUrl={setYouTubeUrl}
          videoInfo={videoInfo}
          setVideoInfo={setVideoInfo}
          libraryFolder={libraryFolder}
          bitrate={bitrate}
          error={error}
          setError={setError}
          status={status}
          setStatus={setStatus}
          splitArtistTitleChars={splitArtistTitleChars}
          includeArtistInFolderPath={includeArtistInFolderPath}
          includeAlbumInFolderPath={includeAlbumInFolderPath}
        />
      )}
      {page === PageType.Preferences && (
        <PreferencesPage
          libraryFolder={libraryFolder}
          setLibraryFolder={setLibraryFolder}
          bitrate={bitrate}
          setBitrate={setBitrate}
          setError={setError}
          splitArtistTitleChars={splitArtistTitleChars}
          setSplitArtistTitleChars={setSplitArtistTitleChars}
          includeArtistInFolderPath={includeArtistInFolderPath}
          setIncludeArtistInFolderPath={setIncludeArtistInFolderPath}
          includeAlbumInFolderPath={includeAlbumInFolderPath}
          setIncludeAlbumInFolderPath={setIncludeAlbumInFolderPath}
        />
      )}
    </div>
  )
}

export default App
