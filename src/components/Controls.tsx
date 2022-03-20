import React, { ChangeEventHandler } from 'react'
import RequestType from '../types/RequestType'
import ResponseType from '../types/ResponseType'

const Controls: React.FC = () => {
  const changeDownloadFolder = (event: React.ChangeEvent<HTMLInputElement>) => {
    window.api.send(RequestType.ChangeDownloadFolder, event.target.value)
    window.api.receive(ResponseType.ChangeDownloadFolder, (data: any) => {
      console.log(`received: ${data}`)
    })
  }

  return (
    <>
      <label>Youtube URL</label>
      <input type="text" />
      <button>Search</button>
      <div>
        <label>Folder</label>
        <input name="directory" type="text" onChange={changeDownloadFolder} />
      </div>
    </>
  )
}

export default Controls
