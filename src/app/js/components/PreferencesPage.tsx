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
}

const PreferencesPage = ({
  libraryFolder,
  setLibraryFolder,
  bitrate,
  setBitrate,
  setError,
  splitArtistTitleChars,
  setSplitArtistTitleChars,
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
    const bitrate = event.target.value
    setBitrate(bitrate)
    localStorage.setItem(LocalStorageKey.Bitrate, bitrate)
  }

  const updateSplitArtistTitleChars = (event: React.ChangeEvent<HTMLInputElement>) => {
    const chars = event.target.value
    setSplitArtistTitleChars(chars)
    localStorage.setItem(LocalStorageKey.SplitArtistTitleChars, chars)
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
      <div>
        <label className="block text-slate-300 mb-2">Split artist/title by characters</label>
        <input
          name="split-title-by"
          type="text"
          className="w-full bg-slate-300 text-slate-800 px-4 py-2 outline-none"
          value={splitArtistTitleChars}
          onChange={updateSplitArtistTitleChars}
        />
      </div>
    </div>
  )
}

export default PreferencesPage
