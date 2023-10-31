import { post } from './RestClient'
import mapInterfaceData from './mapInterfaceData'

const interfaceData = {
  id: 'ProgramId',
  schoolId: 'schoolId',
  type: 'type',
  name: 'name',
  section: 'section',
  status: 'status',
  image: 'image',
  gradeLevel: 'gradeLevel',
  mergeParameterWithValue: {
    title: 'name'
  },
  mergeParameterWithDefaultValue: {
    icon: 'calendar',
    route: '/classes/:id'
  }
}

export const getAll = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  const result = await post(
    `${process.env.REACT_APP_API_URL}/cohort/search`,
    {
      "limit": "",
      "page": 0,
      "filters": {}
    },
    {
      ...params,
      headers
    }
  )
  if (result.data) {
    if (params.coreData === 'getCoreData') {
      return result.data.data
    }
    const data = result.data.data.map((e) => mapInterfaceData(e, interfaceData))
    return data.sort(function (a, b) {
      return a.name - b.name
    })
  } else {
    return []
  }
}
