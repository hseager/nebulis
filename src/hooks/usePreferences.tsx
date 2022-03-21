import { useState } from 'react'
import LocalStorageKey from '../types/LocalStorageKey'
import RequestType from '../types/RequestType'
import Preference from '../types/Preference'

const { api } = window

const usePreferences = () => {
  const [libraryFolder, setLibraryFolder] = useState(localStorage.getItem(LocalStorageKey.LibraryFolder) || '')
  if (!libraryFolder) api.send(RequestType.GetPreference, Preference.LibraryFolder)

  return {
    libraryFolder,
    setLibraryFolder,
  }
}

export default usePreferences
