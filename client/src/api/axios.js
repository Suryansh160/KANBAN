import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:4000/api'
})

api.interceptors.request.use(config => {
  // The login endpoint returns `accessToken`; `token` supports manual entry.
  const token =
    // localStorage.getItem('accessToken') ||
    // localStorage.getItem('token') ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTVmMTdhNmJkMmZlYWE0ZmRhNGQ5YzMiLCJpYXQiOjE3ODQ5OTEyMDYsImV4cCI6MTc4NDk5MjEwNn0.DJssRhV7nmAiBKSVU61aE9nFzrTQtVZfQD8HkD5dPE0'
  if (token) {
    // Accept a raw JWT or a value copied with the "Bearer" prefix.
    config.headers.Authorization = token.startsWith('Bearer ')
      ? token
      : `Bearer ${token}`
  }
  return config
})

export default api
