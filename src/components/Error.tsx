import React from 'react'

type ErrorProps = {
  error: Error
}

const Error = ({ error }: ErrorProps) => {
  return (
    <div className="p-4 bg-pink-800">
      <h2>{error.message}</h2>
    </div>
  )
}

export default Error
