import React, { ChangeEventHandler } from 'react'

const Controls: React.FC = () => {
  const changeDownloadFolder = (event: React.ChangeEvent<HTMLInputElement>) => {
    window.api.send('change-directory-request', event.target.value)
    window.api.receive('change-directory-response', (data: any) => {
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
