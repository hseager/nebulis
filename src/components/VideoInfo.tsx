import React, { useState, useEffect } from 'react'
import { videoInfo } from 'ytdl-core'
import RequestType from '../types/RequestType'
import ResponseType from '../types/ResponseType'
import { convertSecondstoMintues } from '../utils/DateTime'

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
        .send(RequestType.Download, {
          youTubeUrl,
          libraryFolder,
          videoId: videoInfo.videoDetails.videoId,
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
        <div className="bg-slate-800 p-4 mb-8">
          <h2>Video Info</h2>
          <div className="flex justify-between">
            <ul className="my-4">
              <li>Title: {videoInfo.videoDetails.title}</li>
              <li>Author: {videoInfo.videoDetails.author.name}</li>
              <li>Length: {convertSecondstoMintues(videoInfo.videoDetails.lengthSeconds)}</li>
            </ul>
            <img src={videoInfo.videoDetails.thumbnails[0].url} />
          </div>
          <form className="my-4 flex flex-wrap">
            <div className="my-2 basis-1/2">
              <label className="block">Filename</label>
              <input
                className="w-11/12 bg-slate-200 text-slate-800 px-2 py-1 outline-none"
                type="text"
                name="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
              />
            </div>
            <div className="my-2 basis-1/2">
              <label className="block">Title</label>
              <input
                className="w-11/12 bg-slate-200 text-slate-800 px-2 py-1 outline-none"
                type="text"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="my-2 basis-1/2">
              <label className="block">Artist</label>
              <input
                className="w-11/12 bg-slate-200 text-slate-800 px-2 py-1 outline-none"
                type="text"
                name="artist"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
              />
            </div>
            <div className="my-2 basis-1/2">
              <label className="block">Album</label>
              <input
                className="w-11/12 bg-slate-200 text-slate-800 px-2 py-1 outline-none"
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
          <button className="bg-indigo-900 px-2 py-1" onClick={download}>
            download
          </button>
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
