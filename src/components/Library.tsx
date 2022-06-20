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
      })
      .catch(setError)
  }, [])

  return (
    <>
      {error && <Error error={error} />}
      <div className="bg-slate-800 p-4 mb-8">
        <h2>Library</h2>
        {(!library || library.length === 0) && <p>Loading...</p>}
        {library && library.length > 0 && (
          <table className="border">
            <thead>
              <tr>
                <th className="border">Filename</th>
                <th className="border">Title</th>
                <th className="border">Artist</th>
                <th className="border">Album</th>
              </tr>
            </thead>
            <tbody>
              {library.map((song, i) => (
                <tr key={i}>
                  <td className="border">{song.filename}</td>
                  <td className="border">{song.title}</td>
                  <td className="border">{song.artist}</td>
                  <td className="border">{song.album}</td>
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
