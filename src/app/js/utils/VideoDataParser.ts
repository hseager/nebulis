export const parseVideoTitle = (chars: string, videoTitle: string) => {
  let title = ''
  chars.split('').forEach((char) => {
    if (videoTitle.indexOf(char) > 0) {
      title = videoTitle.split(char)[1]?.trim()
    }
  })
  return title
}

export const parseVideoArtist = (chars: string, videoTitle: string) => {
  let artist = ''
  chars.split('').forEach((char) => {
    if (videoTitle.indexOf(char) > 0) {
      artist = videoTitle.split(char)[0]?.trim()
    }
  })
  return artist
}
