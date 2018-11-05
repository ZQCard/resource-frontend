import axios from '@/libs/api.request'

export const login = ({ userName, password }) => {
  let params = new URLSearchParams()
  params.append('username', userName)
  params.append('password', password)
  return axios.request({
    url: '/auth',
    data: params,
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: '/user',
    params: {
      token
    },
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}
