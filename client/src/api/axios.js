import axios from 'axios'
import { triggerAuthRequired } from '../lib/authEvents'

const api = axios.create({
  baseURL: 'http://localhost:4000/api'
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = token.startsWith('Bearer ')
      ? token
      : `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      triggerAuthRequired()
    }
    return Promise.reject(error)
  }
)

export default api
