import api from './api'
import { Rent, AdminRent } from '../types/rent'

export const getCurrentRent = async (): Promise<Rent | null> => {
  const response = await api.get<Rent>('/rent/user')
  return response.data
}

export const getUserRentHistory = async (): Promise<Rent[]> => {
  const response = await api.get<Rent[]>('/rent/user/history')
  return response.data
}

export const rentBook = async (bookId: string): Promise<AdminRent> => {
  const response = await api.put<AdminRent>(`/rent/${bookId}`)
  return response.data
}

export const returnBook = async (rentId: string): Promise<Rent> => {
  const response = await api.put<Rent>(`/rent/${rentId}/return`)
  return response.data
}

export const getAllActiveRents = async (): Promise<AdminRent[]> => {
  const response = await api.get<AdminRent[]>('/rent/all-rents')
  return response.data
}

export const getAllRentHistory = async (): Promise<Rent[]> => {
  const response = await api.get<Rent[]>('/rent/all-rents/history')
  return response.data
}

export const getRecentRentHistory = async (limit: number = 2): Promise<Rent[]> => {
  const response = await api.get<Rent[]>(`/rent/all-rents/recent-history?limit=${limit}`)
  return response.data
}

export const getActiveRentCount = async (): Promise<number> => {
  const response = await api.get<number>('/rent/all-rents/active-count')
  return response.data
}