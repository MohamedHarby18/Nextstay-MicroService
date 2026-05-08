import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach auth headers to every request
client.interceptors.request.use((config) => {
  const { token, userId, role } = useAuthStore.getState()
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
    config.headers['X-User-Id'] = userId
    config.headers['X-User-Role'] = role
  }
  return config
})

// Handle auth errors globally
client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default client
