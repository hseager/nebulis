import LocalStorageKey from '../types/LocalStorageKey'
import RequestType from '../types/RequestType'
import Preference from '../types/Preference'

const { api } = window

const usePreferences = () => {
  return {
    downloadFolderPreference: () => {
      let downloadFolder
      if (localStorage.getItem(LocalStorageKey.DownloadFolder)) downloadFolder = localStorage.getItem(LocalStorageKey.DownloadFolder)
      if (!downloadFolder) downloadFolder = api.send(RequestType.GetPreference, Preference.DownloadFolder)

      return downloadFolder
    },
  }
}

export default usePreferences
