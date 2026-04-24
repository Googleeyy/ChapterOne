import axios from 'axios'

const BOOK_SERVICE = import.meta.env.VITE_BOOK_SERVICE_URL || ''

const bookApi = axios.create({ baseURL: BOOK_SERVICE })

export const getBooks = (genre, search) => {
  const params = {}
  if (genre && genre !== 'All') params.genre = genre
  if (search) params.search = search
  return bookApi.get('/api/books', { params }).then(r => r.data)
}

export const getBookById = (id) =>
  bookApi.get(`/api/books/${id}`).then(r => r.data)

export const createBook = (book, token) =>
  bookApi.post('/api/books', book, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.data)

export const updateBook = (id, book, token) =>
  bookApi.put(`/api/books/${id}`, book, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.data)

export const deleteBook = (id, token) =>
  bookApi.delete(`/api/books/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.data)
