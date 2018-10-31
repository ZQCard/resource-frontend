import axios from '@/libs/api.request'

export const getTableData = () => {
  return axios.request({
    url: 'get_table_data',
    method: 'get'
  })
}

export const getDragList = () => {
  return axios.request({
    url: 'get_drag_list',
    method: 'get'
  })
}

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
  return axios.request({
    url: path,
    method: 'get',
    params: params
  })
}

export const getDataView = (path, params) => {
  return axios.request({
    url: path,
    method: 'get',
    params: params
  })
}

export const postDataForm = (path, data) => {
  return axios.request({
    url: path,
    data: data,
    method: 'post'
  })
}

export const putDataForm = (path, data) => {
  return axios.request({
    url: path,
    data: data,
    method: 'put'
  })
}

export const deleteData = (path, params) => {
  return axios.request({
    url: path,
    params: params,
    method: 'delete'
  })
}
