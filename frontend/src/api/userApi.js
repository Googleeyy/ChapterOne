import axios from 'axios'

const USER_SERVICE = import.meta.env.VITE_USER_SERVICE_URL || ''

const userApi = axios.create({ baseURL: USER_SERVICE })

export const registerUser = (data) =>
  userApi.post('/api/users/register', data).then(r => r.data)

export const loginUser = (data) =>
  userApi.post('/api/users/login', data).then(r => r.data)

export const getProfile = (token) =>
  userApi.get('/api/users/profile', {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.data)

export const updateProfile = (data, token) =>
  userApi.put('/api/users/profile', data, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.data)
