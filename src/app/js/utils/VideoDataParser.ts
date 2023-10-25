const charsToSplit = ['-', '~']

export const parseVideoTitle = (videoTitle: string) => {
  let title = ''
  charsToSplit.forEach((char) => {
    if (videoTitle.indexOf(char) > 0) {
      title = videoTitle.split(char)[1]?.trim()
    }
  })
  return title
}

export const parseVideoArtist = (videoTitle: string) => {
  let artist = ''
  charsToSplit.forEach((char) => {
    if (videoTitle.indexOf(char) > 0) {
      artist = videoTitle.split(char)[0]?.trim()
    }
  })
  return artist
}
