import React, { useState, useEffect } from 'react'
import RequestType from '../types/RequestType'
import Song from '../types/Song'
import Error from './Error'

const { api } = window

type LibraryProps = {
  libraryFolder: string
  error: Error | undefined
  setError: Function
}

const Library = ({ libraryFolder, error, setError }: LibraryProps) => {
  const [library, setLibrary] = useState<Array<Song>>([])

  useEffect(() => {
    api
      .send(RequestType.GetLibrary, libraryFolder)
      .then((songs: Song[]) => {
        setLibrary(songs)
        console.log(songs)
      })
      .catch(setError)
  }, [])

  return (
    <>
      {error && <Error error={error} />}
      <div className="bg-slate-800 p-4 mb-8">
        <h2>Library</h2>
        {library && (
          <table>
            <tbody>
              {library.map((song, i) => (
                <tr key={i}>
                  <td>{song.filename}</td>
                  <td>{song.title}</td>
                  <td>{song.artist}</td>
                  <td>{song.album}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}

export default Library
