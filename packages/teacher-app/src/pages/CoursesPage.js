import React from 'react'
const CourseList = React.lazy(() => import("mylearning/CourseList"));

function CoursesPage() {
  return (
    <div><CourseList /></div>
  )
}

export default CoursesPage