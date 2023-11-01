import React from 'react'
const Observation = React.lazy(() => import("observation/Observation"));

function Test() {
  return (
    <div><Observation/></div>
  )
}

export default Test