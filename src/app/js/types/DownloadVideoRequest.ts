import MetaData from './MetaData'

type DownloadVideoRequest = { youTubeUrl: string; libraryFolder: string; bitrate: string; filename: string; metaData: MetaData }

export default DownloadVideoRequest
