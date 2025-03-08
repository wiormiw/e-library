import axios, { AxiosInstance } from 'axios'
import { useAuth } from '../composables/useAuth'

const api: AxiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8080',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { clearAuthData } = useAuth()
      clearAuthData()
    }
    const message = error.response?.data?.message || 'An unexpected error occurred.'
    return Promise.reject(new Error(message))
  }
)

export default api