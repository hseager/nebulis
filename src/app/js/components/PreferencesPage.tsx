import React, { Dispatch, SetStateAction } from 'react'
import { Edit2 as EditIcon } from 'react-feather'
import { LocalStorageKey, RequestType } from '../types/types'

const { api } = window

type PreferencesPageProps = {
  libraryFolder: string
  setLibraryFolder: Dispatch<SetStateAction<string>>
  bitrate: string
  setBitrate: Dispatch<SetStateAction<string>>
  setError: Dispatch<SetStateAction<Error | undefined>>
  splitArtistTitleChars: string
  setSplitArtistTitleChars: Dispatch<SetStateAction<string>>
  includeArtistInFolderPath: boolean
  setIncludeArtistInFolderPath: Dispatch<SetStateAction<boolean>>
  includeAlbumInFolderPath: boolean
  setIncludeAlbumInFolderPath: Dispatch<SetStateAction<boolean>>
}

const PreferencesPage = ({
  libraryFolder,
  setLibraryFolder,
  bitrate,
  setBitrate,
  setError,
  splitArtistTitleChars,
  setSplitArtistTitleChars,
  includeArtistInFolderPath,
  setIncludeArtistInFolderPath,
  includeAlbumInFolderPath,
  setIncludeAlbumInFolderPath,
}: PreferencesPageProps) => {
  const updateLibraryFolder = () =>
    api
      .send(RequestType.UpdateLibraryFolder)
      .then((path: string) => {
        setLibraryFolder(path)
        localStorage.setItem(LocalStorageKey.LibraryFolder, path)
      })
      .catch(setError)

  const updateBitrate = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target
    setBitrate(value)
    localStorage.setItem(LocalStorageKey.Bitrate, value)
  }

  const updateSplitArtistTitleChars = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setSplitArtistTitleChars(value)
    localStorage.setItem(LocalStorageKey.SplitArtistTitleChars, value)
  }

  const updateIncludeArtistInFolderPath = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target
    setIncludeArtistInFolderPath(checked)
    localStorage.setItem(LocalStorageKey.IncludeArtistInFolderPath, checked.toString())
  }

  const updateIncludeAlbumInFolderPath = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target
    setIncludeAlbumInFolderPath(checked)
    localStorage.setItem(LocalStorageKey.IncludeAlbumInFolderPath, checked.toString())
  }

  return (
    <div className="bg-slate-700 p-4 mb-8">
      <div className="mb-4">
        <label className="block text-slate-300 mb-2">Library Folder</label>
        <div className="flex items-center">
          <input
            name="directory"
            type="text"
            className="w-full bg-slate-300 text-slate-800 px-4 py-2 outline-none"
            value={libraryFolder}
            readOnly
          />
          <button onClick={updateLibraryFolder} className="bg-indigo-700 px-8 h-9">
            <EditIcon size={18} />
          </button>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-slate-300 mb-2">Bitrate</label>
        <select value={bitrate} onChange={updateBitrate} className="w-full bg-slate-300 text-slate-800 px-4 py-2 outline-none">
          <option value="65">65 kbps (Low Quality)</option>
          <option value="130">130 kbps (Radio Quality)</option>
          <option value="160">160 kbps (CD Quality)</option>
          <option value="192">192 kbps (High Quality)</option>
          <option value="320">320 kbps (Full Quality)</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-slate-300 mb-2">Split artist/title by characters</label>
        <input
          name="split-title-by"
          type="text"
          className="w-full bg-slate-300 text-slate-800 px-4 py-2 outline-none"
          value={splitArtistTitleChars}
          onChange={updateSplitArtistTitleChars}
        />
      </div>
      <div>
        <label className="block text-slate-300 mb-2">Directory settings</label>
        <p className="mb-2 flex items-center text-xs">
          <input
            id="include-artist"
            name="include-artist-in-folder-path"
            type="checkbox"
            className="mr-2"
            checked={includeArtistInFolderPath}
            onChange={updateIncludeArtistInFolderPath}
          />{' '}
          <label htmlFor="include-artist">Include artist in directory path (/Nirvana/Smells Like Teen Spirit.mp3)</label>
        </p>
        <p className="flex items-center text-xs">
          <input
            id="include-album"
            name="include-album-in-folder-path"
            type="checkbox"
            className="mr-2"
            checked={includeAlbumInFolderPath}
            onChange={updateIncludeAlbumInFolderPath}
          />{' '}
          <label htmlFor="include-album">Include album in directory path (/Nirvana/Nevermind/Smells Like Teen Spirit.mp3)</label>
        </p>
      </div>
    </div>
  )
}

export default PreferencesPage
