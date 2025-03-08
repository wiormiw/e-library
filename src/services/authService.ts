import api from './api'

interface RegisterRequest {
  email: string
  password: string
  fullName: string
  address: string
  phoneNumber: string
}

interface RegisterResponse {
  id: string
  email: string
  rentingStatus: boolean
}

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  token: string
}

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>('/auth/register', data)
  return response.data
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', data)
  return response.data
}