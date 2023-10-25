import React from 'react'
import { Settings as PreferencesIcon } from 'react-feather'
import { Download as DownloadIcon } from 'react-feather'
import { List as ListIcon } from 'react-feather'
import { PageType } from '../types/types'

type ToolBarPreferences = {
  setPage: Function
}

const Toolbar = ({ setPage }: ToolBarPreferences) => {
  return (
    <div className="flex flex-row-reverse">
      <span onClick={() => setPage(PageType.Preferences)} className="cursor-pointer p-2">
        <PreferencesIcon size={16} />
      </span>
      <span onClick={() => setPage(PageType.Download)} className="cursor-pointer p-2">
        <DownloadIcon size={16} />
      </span>
    </div>
  )
}

export default Toolbar
