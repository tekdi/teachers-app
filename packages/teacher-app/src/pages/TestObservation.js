import React from 'react'
const Observation = React.lazy(() => import("observation/Observation"));

function TestObservation() {
  return (
    <div><Observation/></div>
  )
}

export default TestObservation