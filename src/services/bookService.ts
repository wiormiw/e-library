import api from './api'
import { Book, Genre, PaginatedBooks } from '../types/book'
import { ImageUploadResponse } from 'types/user'

export const getBooks = async (search: string = '', page: number = 0, size: number = 20): Promise<PaginatedBooks> => {
  const response = await api.get<PaginatedBooks>(`/books/get-all?search=${search}&page=${page}&size=${size}`)
  return response.data
}

export const getGenres = async (): Promise<Genre[]> => {
  const response = await api.get<Genre[]>('/books/get-all/genres')
  return response.data
}

export const getBookById = async (bookId: string): Promise<Book> => {
  const response = await api.get<Book>(`/books/detail/${bookId}`)
  return response.data
}

export const createBook = async (book: Omit<Book, 'id'>): Promise<Book> => {
  const response = await api.post<Book>('/books', book)
  return response.data
}

export const updateBook = async (bookId: string, book: Omit<Book, 'id'>): Promise<Book> => {
  const response = await api.put<Book>(`/books/${bookId}`, book)
  return response.data
}

export const deleteBook = async (bookId: string): Promise<void> => {
  await api.delete(`/books/${bookId}`)
}

export const getBookCount = async (): Promise<number> => {
  const response = await api.get<number>('/books/count')
  return response.data
}

export const updateBookCover = async (userId: string, image: File): Promise<ImageUploadResponse> => {
    const formData = new FormData()
    formData.append('image', image)
    const response = await api.put<ImageUploadResponse>(`/books/${userId}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  }