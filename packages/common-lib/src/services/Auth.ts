import axios from 'axios'

export function fetchToken(
  authUrl: string,
  username: string,
  password: string
): Promise<any> {
  const params = new URLSearchParams()
  params.append('client_id', 'hasura')
  params.append('username', username)
  params.append('password', password)
  params.append('grant_type', 'password')
  params.append('client_secret', '2075cb0a-a176-42c7-b5d1-5c5afb9cd317')

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*'
    }
  }

  return axios.post(authUrl, params, config).catch((e) => e)
}
