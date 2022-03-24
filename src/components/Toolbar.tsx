import React from 'react'
import { Settings as PreferencesIcon } from 'react-feather'

type ToolBarPreferences = {
  preferencesOpen: boolean
  setPreferencesOpen: Function
}

const Toolbar = ({ preferencesOpen, setPreferencesOpen }: ToolBarPreferences) => {
  return (
    <div className="flex flex-row-reverse">
      <span onClick={() => setPreferencesOpen(!preferencesOpen)} className="cursor-pointer p-2">
        <PreferencesIcon size={16} />
      </span>
    </div>
  )
}

export default Toolbar
