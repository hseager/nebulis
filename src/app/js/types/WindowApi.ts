import { API } from './types'

// This class tells typescript that window.api is valid
declare global {
  interface Window {
    api: API
  }
}

class WindowApi {}
export default WindowApi
