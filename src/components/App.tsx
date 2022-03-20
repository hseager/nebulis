import React, { useState } from 'react'
import Controls from './Controls'
import VideoInfo from './VideoInfo'
import ytdl from 'ytdl-core'

const App: React.FC = () => {
  return (
    <div className="max-w-2xl m-auto p-12">
      <h2 className="mb-8">n e b u l i s</h2>
      <Controls />
      <VideoInfo />
    </div>
  )
}

export default App
