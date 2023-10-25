import { app } from 'electron'
import { Preference } from '../types/types'

export class PreferenceService {
  static getPreference = (preference: Preference) => {
    return new Promise((resolve, reject) => {
      try {
        switch (preference) {
          case Preference.LibraryFolder:
            resolve(app.getPath('downloads'))
            break
        }
      } catch (error) {
        reject(error)
      }
    })
  }
}
