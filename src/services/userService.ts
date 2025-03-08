import api from './api'
import { User, PaginatedResponse, ImageUploadResponse, UpdateProfileRequest } from '../types/user'

export const getProfile = async (): Promise<User> => {
  const response = await api.get<User>('/users/profile')
  return response.data
}

export const updateProfile = async (data: UpdateProfileRequest): Promise<User> => {
  const response = await api.put<User>('/users/profile', data)
  return response.data
}

export const uploadProfileImage = async (image: File): Promise<ImageUploadResponse> => {
  const formData = new FormData()
  formData.append('image', image)
  const response = await api.put<ImageUploadResponse>('/users/profile/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const getUsers = async (page: number, size: number, search?: string): Promise<PaginatedResponse<User>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    ...(search && { search }),
  })
  const response = await api.get<PaginatedResponse<User>>(`/users?${params.toString()}`)
  return response.data
}

export const getUserById = async (userId: string): Promise<User> => {
  const response = await api.get<User>(`/users/${userId}`)
  return response.data
}

export const getUserByEmail = async (userEmail: string): Promise<User> => {
  const response = await api.get<User>(`/users/by-email/${userEmail}`)
  return response.data
}

export const getUserCount = async (): Promise<number> => {
  const response = await api.get<number>('/users/count')
  return response.data
}

export const updateUser = async (userId: string, data: UpdateProfileRequest): Promise<User> => {
  const response = await api.put<User>(`/users/${userId}`, data)
  return response.data
}

export const uploadUserImage = async (userId: string, image: File): Promise<ImageUploadResponse> => {
  const formData = new FormData()
  formData.append('image', image)
  const response = await api.put<ImageUploadResponse>(`/users/${userId}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}