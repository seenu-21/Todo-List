export interface Database {
  public: {
    Tables: {
      todos: {
        Row: {
          id: number
          inserted_at: string
          is_complete: boolean | null
          task: string | null
          user_id: string
          assigned_to: string | null
          due_date: string | null
          created_by: string
        }
        Insert: {
          id?: number
          inserted_at?: string
          is_complete?: boolean | null
          task?: string | null
          user_id: string
          assigned_to?: string | null
          due_date?: string | null
          created_by: string
        }
        Update: {
          id?: number
          inserted_at?: string
          is_complete?: boolean | null
          task?: string | null
          user_id?: string
          assigned_to?: string | null
          due_date?: string | null
          created_by?: string
        }
      }
      notifications: {
        Row: {
          id: number
          user_id: string
          message: string
          todo_id: number
          read: boolean
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          message: string
          todo_id: number
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          message?: string
          todo_id?: number
          read?: boolean
          created_at?: string
        }
      }
    }
    // ... rest of the schema
  }
}
