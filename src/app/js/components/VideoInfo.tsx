import React, { useState, useEffect } from 'react'
import { videoInfo } from '@distube/ytdl-core'
import RequestType from '../types/RequestType'
import { convertSecondstoMintues } from '../utils/DateTime'
import { DownloadCloud as DownloadIcon } from 'react-feather'
import Status from '../types/Status'
import FileInfo from './FileInfo'
import { parseVideoArtist, parseVideoTitle } from '../utils/VideoDataParser'

const { api } = window

type VideoInfoProps = {
  videoInfo: videoInfo | undefined
  setVideoInfo: Function
  youTubeUrl: string
  libraryFolder: string
  setError: Function
  bitrate: string
  setStatus: Function
}

const VideoInfo = ({ videoInfo, setVideoInfo, youTubeUrl, libraryFolder, bitrate, setError, setStatus }: VideoInfoProps) => {
  // const { videoTitle } = videoInfo ? videoInfo.videoDetails.title : '';

  const [filename, setFilename] = useState(videoInfo?.videoDetails.title || '')
  const [title, setTitle] = useState(videoInfo ? parseVideoTitle(videoInfo?.videoDetails.title) : '')
  const [artist, setArtist] = useState(videoInfo ? parseVideoArtist(videoInfo?.videoDetails.title) : '')
  const [album, setAlbum] = useState('')
  const [albumArtist, setAlbumArtist] = useState('')
  const [genre, setGenre] = useState('')

  // Need to fix this up
  useEffect(() => {
    if (videoInfo) {
      setFilename(videoInfo.videoDetails.title)
      setTitle(parseVideoTitle(videoInfo.videoDetails.title))
      setArtist(parseVideoArtist(videoInfo.videoDetails.title))
    }
  }, [videoInfo])

  const download = () => {
    if (!filename) return setError(new Error('Please enter a filename'))

    if (videoInfo) {
      setError('')
      setStatus(Status.Downloading)
      api
        .send(RequestType.DownloadVideo, {
          youTubeUrl,
          libraryFolder,
          bitrate,
          filename,
          metaData: {
            title,
            artist,
            album,
            albumArtist,
            genre,
          },
        })
        .then(() => setVideoInfo(undefined))
        .catch(setError)
        .finally(() => setStatus(Status.Ready))
    }
  }

  return (
    <>
      {videoInfo && (
        <>
          <div className="bg-slate-700 p-4 mt-4">
            <div className="flex justify-between">
              <ul className="my-2 text-base">
                <li className="mb-2">
                  <strong>Title:</strong> {videoInfo.videoDetails.title}
                </li>
                <li className="mb-2">
                  <strong>Author:</strong> {videoInfo.videoDetails.author.name}
                </li>
                <li>
                  <strong>Length:</strong> {convertSecondstoMintues(videoInfo.videoDetails.lengthSeconds)}
                </li>
              </ul>
              <img src={videoInfo.videoDetails.thumbnails[0].url} />
            </div>
          </div>
          <div className="bg-slate-700 p-4 mt-4">
            <FileInfo
              filename={filename}
              setFilename={setFilename}
              title={title}
              setTitle={setTitle}
              artist={artist}
              setArtist={setArtist}
              album={album}
              setAlbum={setAlbum}
              albumArtist={albumArtist}
              setAlbumArtist={setAlbumArtist}
              genre={genre}
              setGenre={setGenre}
            />
            <div className="flex flex-row-reverse">
              <button className="bg-indigo-700 px-8 h-9" onClick={download}>
                <DownloadIcon size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default VideoInfo
