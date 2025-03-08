export interface Book {
    id: string
    title: string
    quantity: number
    availableQuantity: number
    coverUrl: string
    genreIds: string[]
  }
  
  export interface Genre {
    id: string
    name: string
  }
  
  export interface PaginatedBooks {
    content: Book[]
    pageable: {
      pageNumber: number
      pageSize: number
      sort: { sorted: boolean; empty: boolean; unsorted: boolean }
      offset: number
      paged: boolean
      unpaged: boolean
    }
    totalPages: number
    totalElements: number
    last: boolean
    size: number
    number: number
    sort: { sorted: boolean; empty: boolean; unsorted: boolean }
    numberOfElements: number
    first: boolean
    empty: boolean
  }