import React, { useState, useEffect } from 'react'
import { videoInfo } from 'ytdl-core'
import RequestType from '../types/RequestType'
import ResponseType from '../types/ResponseType'
import { convertSecondstoMintues } from '../utils/DateTime'
import { DownloadCloud as DownloadIcon } from 'react-feather'

const { api } = window

type VideoInfoProps = {
  videoInfo: videoInfo | undefined
  setVideoInfo: Function
  youTubeUrl: string
  libraryFolder: string
  setError: Function
  bitrate: string
}

const VideoInfo = ({ videoInfo, setVideoInfo, youTubeUrl, libraryFolder, bitrate, setError }: VideoInfoProps) => {
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [conversionProgress, setConversionProgress] = useState(0)
  const [filename, setFilename] = useState(videoInfo?.videoDetails.title || '')
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [album, setAlbum] = useState('')
  const [genre, setGenre] = useState([''])

  const download = () => {
    if (!filename) return setError(new Error('Please enter a filename'))

    if (videoInfo) {
      setError('')
      setDownloadProgress(1)
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
            genre,
          },
        })
        .then(() => setVideoInfo(null))
        .catch(setError)
    }
  }

  useEffect(() => {
    api.receive(ResponseType.DownloadProgress, (progress: any) => setDownloadProgress(progress))
    api.receive(ResponseType.ConversionProgress, (progress: any) => setConversionProgress(progress))
  }, [])

  return (
    <>
      {videoInfo && (
        <div className="bg-slate-700 p-4 mb-8">
          <div className="flex justify-between">
            <ul className="my-4">
              <li>Title: {videoInfo.videoDetails.title}</li>
              <li>Author: {videoInfo.videoDetails.author.name}</li>
              <li>Length: {convertSecondstoMintues(videoInfo.videoDetails.lengthSeconds)}</li>
            </ul>
            <img src={videoInfo.videoDetails.thumbnails[0].url} />
          </div>
          <form className="my-4 flex flex-wrap">
            <div className="my-2 basis-1/2 pr-8">
              <label className="block text-slate-300 mb-2">Filename</label>
              <input
                className="w-full bg-slate-300 text-slate-800 px-4 py-2 outline-none"
                type="text"
                name="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
              />
            </div>
            <div className="my-2 basis-1/2">
              <label className="block text-slate-300 mb-2">Title</label>
              <input
                className="w-full bg-slate-300 text-slate-800 px-4 py-2 outline-none"
                type="text"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="my-2 basis-1/2 pr-8">
              <label className="block text-slate-300 mb-2">Artist</label>
              <input
                className="w-full bg-slate-300 text-slate-800 px-4 py-2 outline-none"
                type="text"
                name="artist"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
              />
            </div>
            <div className="my-2 basis-1/2">
              <label className="block text-slate-300 mb-2">Album</label>
              <input
                className="w-full bg-slate-300 text-slate-800 px-4 py-2 outline-none"
                type="text"
                name="album"
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
              />
            </div>
            {/* <div className="my-2 basis-1/2">
              <label className="block">Genre</label>
              <select value={genre} onChange={(e) => setGenre([...genre, e.target.value])} className="w-11/12 bg-slate-200 text-slate-800 px-2 py-1 outline-none">
                <option value="rock">Rock</option>
                <option value="drum-and-bass">Drum &amp; Bass</option>
                <option value="grime">Grime</option>
              </select>
            </div> */}
          </form>
          <div className="flex flex-row-reverse">
            <button className="bg-indigo-700 px-8 h-9" onClick={download}>
              <DownloadIcon size={18} />
            </button>
          </div>
          <div>
            {downloadProgress > 0 && <p>Downloading: {downloadProgress}%</p>}
            {conversionProgress > 0 && <p>Converting...</p>}
          </div>
        </div>
      )}
    </>
  )
}

export default VideoInfo
