import React from 'react'
const Observation = React.lazy(() => import("observation/Observation"));

function TestPage() {
  return (
    <div><Observation /></div>
  )
}

export default TestPage