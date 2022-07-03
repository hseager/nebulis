import React, { useEffect, useState } from 'react'
import ResponseType from '../types/ResponseType'
import Status from '../types/Status'

const { api } = window

type StatusBarProps = {
  status: Status
  setStatus: Function
}

const StatusBar = ({ status, setStatus }: StatusBarProps) => {
  const [downloadProgress, setDownloadProgress] = useState<number>(0)
  const [conversionProgress, setConversionProgress] = useState<number>(0)
  const [progress, setProgress] = useState<number>(0)

  const progressClass = (): string => {
    if (status === Status.Downloading) {
      return 'bg-emerald-700'
    } else if (status === Status.Converting) {
      return 'bg-sky-700'
    } else {
      return ''
    }
  }

  useEffect(() => {
    api.receive(ResponseType.DownloadProgress, (progress: number) => setDownloadProgress(progress))
    api.receive(ResponseType.ConversionProgress, (progress: number) => setConversionProgress(progress))
  }, [])

  useEffect(() => {
    if (downloadProgress > 0 && downloadProgress < 100) {
      setProgress(downloadProgress)
    } else if (downloadProgress >= 100) {
      setProgress(0)
      setDownloadProgress(0)
      setStatus(Status.Converting)
    }
  }, [downloadProgress])

  useEffect(() => {
    if (conversionProgress > 0 && conversionProgress < 100) {
      setProgress(conversionProgress)
    } else if (conversionProgress >= 100) {
      setProgress(0)
      setConversionProgress(0)
      setStatus(Status.Ready)
    }
  }, [conversionProgress])

  return (
    <div className="bg-slate-600 p-1 text-center text-xs relative">
      <div className="relative z-10">
        {status === Status.GettingVideoInfo && <h4>Getting video info...</h4>}
        {status === Status.Downloading && <h4>Downloading...</h4>}
        {status === Status.Converting && <h4>Converting...</h4>}
      </div>
      <div
        className={`absolute h-full top-0 left-0 z-0 transition-width ease-linear ${progressClass()}`}
        style={{ width: progress + '%' }}
      ></div>
    </div>
  )
}

export default StatusBar
