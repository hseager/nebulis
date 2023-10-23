import React, { Dispatch, SetStateAction } from 'react'

type FileInfoProps = {
  filename: string
  setFilename: Dispatch<SetStateAction<string>>
  title: string
  setTitle: Dispatch<SetStateAction<string>>
  artist: string
  setArtist: Dispatch<SetStateAction<string>>
  album: string
  setAlbum: Dispatch<SetStateAction<string>>
  albumArtist: string
  setAlbumArtist: Dispatch<SetStateAction<string>>
}

const FileInfo = ({
  filename,
  setFilename,
  title,
  setTitle,
  artist,
  setArtist,
  album,
  setAlbum,
  albumArtist,
  setAlbumArtist,
}: FileInfoProps) => {
  return (
    <form className="flex flex-wrap">
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
      <div className="my-2 basis-1/2 pr-8">
        <label className="block text-slate-300 mb-2">Album Artist</label>
        <input
          className="w-full bg-slate-300 text-slate-800 px-4 py-2 outline-none"
          type="text"
          name="album"
          value={albumArtist}
          onChange={(e) => setAlbumArtist(e.target.value)}
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
  )
}

export default FileInfo
