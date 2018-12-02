import axios from '@/libs/api.request'
import { getToken } from '@/libs/util'

export const errorReq = () => {
  return axios.request({
    url: 'error_url',
    method: 'post'
  })
}

export const saveErrorLogger = info => {
  return axios.request({
    url: 'save_error_logger',
    data: info,
    method: 'post'
  })
}

export const getDataList = (path, params) => {
  params.append('token', getToken())
  return axios.request({
    url: path,
    method: 'get',
    params: params
  })
}

export const getDataView = (path, params) => {
  params.append('token', getToken())
  return axios.request({
    url: path,
    method: 'get',
    params: params
  })
}

export const postDataForm = (path, data) => {
  let params = new URLSearchParams()
  params.append('token', getToken())
  return axios.request({
    url: path,
    data: data,
    method: 'post',
    params: params
  })
}

export const putDataForm = (path, data) => {
  let params = new URLSearchParams()
  params.append('token', getToken())
  return axios.request({
    url: path,
    data: data,
    method: 'put',
    params: params
  })
}

export const deleteData = (path, params) => {
  params.append('token', getToken())
  return axios.request({
    url: path,
    params: params,
    method: 'delete'
  })
}

export const recoverData = (path, params) => {
  params.append('token', getToken())
  return axios.request({
    url: path,
    method: 'patch',
    params: params
  })
}
