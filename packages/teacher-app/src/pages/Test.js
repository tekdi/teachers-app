import React from 'react'
const TestPage = React.lazy(() => import("assessment/TestPage"));

function Test() {
  return (
    <div><TestPage/></div>
  )
}

export default Test