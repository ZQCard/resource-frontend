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

export const getVideosList = (type, page, pageSize) => {
  let params = {
    type: type,
    page: page,
    pageSize: pageSize
  }
  return axios.request({
    url: 'videos',
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
