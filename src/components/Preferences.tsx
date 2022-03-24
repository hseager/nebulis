import React from 'react'
import LocalStorageKey from '../types/LocalStorageKey'
import RequestType from '../types/RequestType'

const { api } = window

type PreferencesProps = {
  libraryFolder: string
  setLibraryFolder: Function
  setError: Function
}

const Preferences = ({ libraryFolder, setLibraryFolder, setError }: PreferencesProps) => {
  const updateLibraryFolder = () =>
    api
      .send(RequestType.UpdateLibraryFolder)
      .then((path: string) => {
        setLibraryFolder(path)
        localStorage.setItem(LocalStorageKey.LibraryFolder, path)
      })
      .catch(setError)

  return (
    <div className="bg-slate-800 p-4 mb-8">
      <div className="mb-4">
        <label className="block">Library Folder</label>
        <input name="directory" type="text" className="w-3/4 bg-slate-200 text-slate-800 px-2 py-1 outline-none" value={libraryFolder} readOnly />
        <button onClick={() => updateLibraryFolder()} className="bg-indigo-900 px-2 py-1">
          change
        </button>
      </div>
      <div>
        <label className="block">Bitrate</label>
        <select className="w-3/4 bg-slate-200 text-slate-800 px-2 py-1 outline-none">
          <option>128</option>
        </select>
      </div>
    </div>
  )
}

export default Preferences
