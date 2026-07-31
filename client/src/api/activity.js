import api from './axios'

export const getActivity = () => api.get('/activity/get').then(res => res.data)
