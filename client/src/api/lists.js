import api from './axios'

export const getLists = () => api.get('/lists/get').then(res => res.data)

export const createList = data =>
  api.post('/lists/create', data).then(res => res.data)

export const updateList = ({ id, data }) =>
  api.post(`/lists/update/${id}`, data).then(res => res.data)

export const deleteList = id =>
  api.delete(`/lists/delete/${id}`).then(res => res.data)
