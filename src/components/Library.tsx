import React, { useState, useEffect } from 'react'
import RequestType from '../types/RequestType'
import Error from './Error'

const { api } = window

type LibraryProps = {
  libraryFolder: string
  error: Error | undefined
  setError: Function
}

const Library = ({ libraryFolder, error, setError }: LibraryProps) => {
  const [library, setLibrary] = useState([])

  useEffect(() => {
    api.send(RequestType.GetLibrary, libraryFolder).then(setLibrary).catch(setError)
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
                  <td>{song}</td>
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
