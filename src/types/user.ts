export interface UserProfile {
    fullName: string
    address: string
    profileUrl: string | null
    phoneNumber: string
  }
  
  export interface User {
    id: string
    email: string
    rentingStatus: boolean
    profile?: UserProfile
  }
  
  export interface PaginatedResponse<T> {
    content: T[]
    pageable: {
      pageNumber: number
      pageSize: number
      sort: {
        sorted: boolean
        empty: boolean
        unsorted: boolean
      }
      offset: number
      paged: boolean
      unpaged: boolean
    }
    totalPages: number
    totalElements: number
    last: boolean
    size: number
    number: number
    sort: {
      sorted: boolean
      empty: boolean
      unsorted: boolean
    }
    numberOfElements: number
    first: boolean
    empty: boolean
  }
  
  export interface ImageUploadResponse {
    imageUrl: string
  }
  
  export interface UpdateProfileRequest {
    password?: string
    fullName: string
    address: string
    phoneNumber: string
  }