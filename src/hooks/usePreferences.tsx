import { useState } from 'react'
import LocalStorageKey from '../types/LocalStorageKey'
import RequestType from '../types/RequestType'
import Preference from '../types/Preference'

const { api } = window

const usePreferences = () => {
  const [downloadFolder, setDownloadFolder] = useState(localStorage.getItem(LocalStorageKey.DownloadFolder) || '')
  if (!downloadFolder) api.send(RequestType.GetPreference, Preference.DownloadFolder)

  return {
    downloadFolder,
    setDownloadFolder,
  }
}

export default usePreferences
