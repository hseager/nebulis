import React from 'react'

type ErrorProps = {
  error: Error
}

const Error = ({ error }: ErrorProps) => {
  return (
    <div className="p-4 bg-pink-800">
      <h2 className="text-base">There was an error!?</h2>
      <p>{error.message}</p>
    </div>
  )
}

export default Error
