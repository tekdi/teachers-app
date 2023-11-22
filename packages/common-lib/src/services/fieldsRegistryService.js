import { post, get } from './RestClient'

export const getFields = async (data = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  const result = await post(
    `${process.env.REACT_APP_API_URL}/fields/search`,
    data,
    {
      headers
    }
  )
  if (result.data) {
    return result.data.data;
  } else {
    return []
  }
}
