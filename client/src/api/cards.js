import api from './axios'

export const getCards = () => api.get('/cards/get').then(res => res.data)

export const createCard = data => api.post('/cards/create', data).then(res => res.data)

export const updateCard = ({ id, data }) =>
  api.patch(`/cards/update/${id}`, data).then(res => res.data)

export const deleteCard = id => api.delete(`/cards/delete/${id}`).then(res => res.data)
