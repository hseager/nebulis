// This class tells typescript that window.api is valid
declare global {
  interface Window {
    api?: any
  }
}

class WindowApi {}
export default WindowApi
