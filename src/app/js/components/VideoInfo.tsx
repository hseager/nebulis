import React, { useState, useEffect } from 'react'
import { videoInfo } from '@distube/ytdl-core'
import { convertSecondstoMintues } from '../utils/DateTime'
import { DownloadCloud as DownloadIcon } from 'react-feather'
import FileInfo from './FileInfo'
import { parseVideoArtist, parseVideoTitle } from '../utils/VideoDataParser'
import { DownloadVideoRequest, RequestType, Status } from '../types/types'
import filenamify from 'filenamify/browser'

const { api } = window

type VideoInfoProps = {
  videoInfo: videoInfo
  setVideoInfo: Function
  youTubeUrl: string
  libraryFolder: string
  setError: Function
  bitrate: string
  setStatus: Function
  splitArtistTitleChars: string
  includeArtistInFolderPath: boolean
  includeAlbumInFolderPath: boolean
}

const VideoInfo = ({
  videoInfo,
  setVideoInfo,
  youTubeUrl,
  libraryFolder,
  bitrate,
  setError,
  setStatus,
  splitArtistTitleChars,
  includeArtistInFolderPath,
  includeAlbumInFolderPath,
}: VideoInfoProps) => {
  const { title: videoTitle, author, lengthSeconds, thumbnails, uploadDate, viewCount, likes } = videoInfo.videoDetails

  const [filename, setFilename] = useState(videoTitle)
  const [title, setTitle] = useState(videoInfo ? parseVideoTitle(splitArtistTitleChars, videoTitle) : '')
  const [artist, setArtist] = useState(videoInfo ? parseVideoArtist(splitArtistTitleChars, videoTitle) : '')
  const [album, setAlbum] = useState('')
  const [albumArtist, setAlbumArtist] = useState('')
  const [genre, setGenre] = useState('')
  const [trackNumber, setTrackNumber] = useState('')
  const [preserveMetadata, setPreserveMetadata] = useState(false)

  useEffect(() => {
    if (!preserveMetadata) {
      setFilename(videoTitle)
      setTitle(parseVideoTitle(splitArtistTitleChars, videoTitle))
      setArtist(parseVideoArtist(splitArtistTitleChars, videoTitle))
    }
  }, [videoInfo])

  useEffect(() => {
    setFilename(filenamify(filename, { replacement: '' }))
  }, [filename])

  const download = () => {
    if (!filename) return setError(new Error('Please enter a filename'))

    setError('')
    setStatus(Status.Downloading)

    const downloadRequestData: DownloadVideoRequest = {
      youTubeUrl,
      bitrate,
      filename,
      metaData: {
        title,
        artist,
        album,
        albumArtist,
        genre,
        trackNumber,
      },
      directorySettings: {
        libraryFolder,
        includeArtistInFolderPath,
        includeAlbumInFolderPath,
      },
    }

    api
      .send(RequestType.DownloadVideo, downloadRequestData)
      .then(() => {
        if (!preserveMetadata) setVideoInfo(undefined)
      })
      .catch((error) => setError(error))
      .finally(() => setStatus(Status.Ready))
  }

  return (
    <>
      <div className="bg-slate-700 p-4 mt-4">
        <div className="flex justify-between items-center">
          <ul>
            <li>
              <strong>Title:</strong> {videoTitle}
            </li>
            <li>
              <strong>Author:</strong> {author.name}
            </li>
            <li>
              <strong>Length:</strong> {convertSecondstoMintues(lengthSeconds)}
            </li>
            <li>
              <strong>Uploaded on:</strong> {new Date(uploadDate).toLocaleDateString()}
            </li>
            <li>
              <strong>Views:</strong> {viewCount} / <strong>Likes:</strong> {likes}
            </li>
          </ul>
          <img src={thumbnails[0].url} />
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
          trackNumber={trackNumber}
          setTrackNumber={setTrackNumber}
        />
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center">
            <label htmlFor="preserve-metadata">Preserve metadata</label>
            <input
              type="checkbox"
              id="preserve-metadata"
              name="preserve-metadata"
              className="ml-2"
              checked={preserveMetadata}
              onChange={(e) => setPreserveMetadata(!!e.target.checked)}
            />
          </div>
          <button className="bg-indigo-700 px-8 h-9" onClick={download}>
            <DownloadIcon size={18} />
          </button>
        </div>
      </div>
    </>
  )
}

export default VideoInfo
