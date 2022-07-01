import React from 'react'
import LocalStorageKey from '../types/LocalStorageKey'
import RequestType from '../types/RequestType'
import { Edit2 as EditIcon } from 'react-feather'

const { api } = window

type PreferencesProps = {
  libraryFolder: string
  setLibraryFolder: Function
  bitrate: string
  setBitrate: Function
  setError: Function
}

const Preferences = ({ libraryFolder, setLibraryFolder, bitrate, setBitrate, setError }: PreferencesProps) => {
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

  return (
    <div className="bg-slate-800 p-4 mb-8">
      <div className="mb-4">
        <label className="block">Library Folder</label>
        <div className="flex items-center">
          <input
            name="directory"
            type="text"
            className="w-full h-7 bg-slate-200 text-slate-800 px-2 py-1 outline-none"
            value={libraryFolder}
            readOnly
          />
          <button onClick={() => updateLibraryFolder()} className="h-7 bg-indigo-900 px-2 py-1">
            <EditIcon size={16} />
          </button>
        </div>
      </div>
      <div>
        <label className="block">Bitrate</label>
        <select value={bitrate} onChange={updateBitrate} className="w-full bg-slate-200 text-slate-800 px-2 py-1 outline-none">
          <option value="65">65 kbps (Low Quality)</option>
          <option value="130">130 kbps (Radio Quality)</option>
          <option value="160">160 kbps (CD Quality)</option>
          <option value="192">192 kbps (High Quality)</option>
          <option value="320">320 kbps (Full Quality)</option>
        </select>
      </div>
    </div>
  )
}

export default Preferences
