export interface Task {
  id: string
  title: string
  description?: string
  is_complete: boolean
  due_date?: string // ISO date string
  assigned_to?: string // user id
  created_by: string // user id
  created_at: string
}

export type FilterType = 'all' | 'assigned_to_me' | 'created_by_me' | 'overdue' | 'due_today'
