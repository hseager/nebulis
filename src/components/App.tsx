import React, { useState } from 'react'
import usePreferences from '../hooks/usePreferences'
import Controls from './Controls'
import VideoInfo from './VideoInfo'

const App: React.FC = () => {
  const { downloadFolderPreference } = usePreferences()

  const [youTubeUrl, setYouTubeUrl] = useState('https://www.youtube.com/watch?v=LwQpWb4y5Fc')
  const [downloadFolder, setDownloadFolder] = useState(downloadFolderPreference)

  return (
    <div className="max-w-2xl m-auto p-12">
      <h2 className="mb-8">n e b u l i s</h2>
      <Controls youTubeUrl={youTubeUrl} setYouTubeUrl={setYouTubeUrl} downloadFolder={downloadFolder} setDownloadFolder={setDownloadFolder} />
      <VideoInfo youTubeUrl={youTubeUrl} downloadFolder={downloadFolder} />
    </div>
  )
}

export default App
