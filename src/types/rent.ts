export interface Rent {
    id: string
    bookName: string
    rentedBy: string
    startDate: string
    endDate?: string
    deadline: string
    rentStatus: 'ACTIVE' | 'OVERDUE' | 'COMPLETED' | 'COMPLETED_OVERDUE'
  }
  
  export interface AdminRent {
    id: string
    userId: string
    bookId: string
    status: 'ACTIVE' | 'OVERDUE' | 'COMPLETED' | 'COMPLETED_OVERDUE'
  }