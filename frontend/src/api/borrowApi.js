import axios from 'axios'

const BORROW_SERVICE = import.meta.env.VITE_BORROW_SERVICE_URL || ''

const borrowApi = axios.create({ baseURL: BORROW_SERVICE })

export const borrowBook = (userId, bookId) =>
  borrowApi.post('/api/borrows', { userId, bookId }).then(r => r.data)

export const returnBook = (borrowId) =>
  borrowApi.post('/api/borrows/return', { borrowId }).then(r => r.data)

export const getUserHistory = (userId) =>
  borrowApi.get(`/api/borrows/user/${userId}`).then(r => r.data)

export const getUserActiveBorrows = (userId) =>
  borrowApi.get(`/api/borrows/user/${userId}/active`).then(r => r.data)
