export const convertSecondstoMintues = (time: string) => {
  const seconds = parseInt(time)
  return Math.floor(seconds / 60) + ':' + Math.floor(seconds % 60)
}
