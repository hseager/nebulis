import React, { useState, useEffect } from 'react'
import LocalStorageKey from '../types/LocalStorageKey'
import RequestType from '../types/RequestType'
import Song from '../types/Song'
import Error from './Error'
import { RefreshCw as SyncIcon, Edit2 as EditIcon } from 'react-feather'

const { api } = window

type LibraryProps = {
  libraryFolder: string
  error: Error | undefined
  setError: Function
}

const Library = ({ libraryFolder, error, setError }: LibraryProps) => {
  const [library, setLibrary] = useState<Array<Song>>([])
  const [selectedRow, setSelectedRow] = useState<Number>()

  const syncLibraryData = () => {
    setLibrary([])
    api
      .send(RequestType.GetLibraryData, libraryFolder)
      .then((libraryData: Song[]) => {
        setLibrary(libraryData)
        localStorage.setItem(LocalStorageKey.LibraryData, JSON.stringify(libraryData))
      })
      .catch(setError)
  }

  const handleSelectRow = (row: number) => (selectedRow !== row ? setSelectedRow(row) : setSelectedRow(undefined))

  useEffect(() => {
    const libraryData = localStorage.getItem(LocalStorageKey.LibraryData)
    if (libraryData) {
      setLibrary(JSON.parse(libraryData))
    } else {
      syncLibraryData()
    }
  }, [])

  return (
    <>
      {error && <Error error={error} />}
      <div className="bg-slate-700 p-4 mb-8">
        {(!library || library.length === 0) && <p>Loading...</p>}
        {library && library.length > 0 && (
          <>
            <div className="flex flex-row-reverse mb-4">
              <span onClick={() => syncLibraryData()} className="cursor-pointer px-2">
                <SyncIcon size={16} />
              </span>
            </div>
            <table className="border table-fixed w-full">
              <thead>
                <tr>
                  <th className="border p-2">Filename</th>
                  <th className="border p-2">Artist</th>
                  <th className="border p-2">Title</th>
                  <th className="border p-2">Album</th>
                  <th className="border p-2 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {library.map((song, i) => (
                  <tr key={i} onClick={() => handleSelectRow(i)}>
                    <td className="p-2 border">
                      <span className="block whitespace-nowrap overflow-hidden text-ellipsis">{song.filename}</span>
                    </td>
                    <td className="p-2 border">{song.artist}</td>
                    <td className="p-2 border">{song.title}</td>
                    <td className="p-2 border">{song.album}</td>
                    <td className="p-2 border w-10">
                      <span className="cursor-pointer flex justify-center">
                        <EditIcon size={16} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  )
}

export default Library
