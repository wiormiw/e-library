import { ref } from 'vue'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'vue-router'

interface JwtPayload {
  sub: string
  id: string
  roles: string[]
  iat: number
  exp: number
}

export function useAuth() {
  const userRoles = ref<string[]>([])
  const userId = ref<string | null>(null)
  const router = useRouter()

  // Check if a token exists in localStorage on app load
  const token = localStorage.getItem('token')
  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token)
      userRoles.value = decoded.roles
      userId.value = decoded.id
    } catch (error) {
      console.error('Invalid token:', error)
      localStorage.removeItem('token')
    }
  }

  const setAuthData = (token: string) => {
    localStorage.setItem('token', token)
    const decoded = jwtDecode<JwtPayload>(token)
    userRoles.value = decoded.roles
    userId.value = decoded.id
  }

  const clearAuthData = () => {
    localStorage.removeItem('token')
    userRoles.value = []
    userId.value = null
    router.push('/login')
  }

  const hasRole = (role: string) => {
    return userRoles.value.includes(role)
  }

  const hasAnyRole = (roles: string[]) => {
    return roles.some((role) => userRoles.value.includes(role))
  }

  return { userId, userRoles, setAuthData, clearAuthData, hasRole, hasAnyRole }
}