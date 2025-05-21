export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string; 
          title: string;
          description: string | null;
          due_date: string | null;
          assigned_to: string; 
          created_by: string; 
          is_complete: boolean;
          created_at: string;
        };
        Insert: {
          id?: string; 
          title: string;
          description?: string | null;
          due_date?: string | null;
          assigned_to: string; 
          created_by: string; 
          is_complete?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          due_date?: string | null;
          assigned_to?: string;
          created_by?: string;
          is_complete?: boolean;
          created_at?: string;
        };
      };
      users: {
        Row: {
          id: string; 
          email: string;
        };
        Insert: {
          id: string; 
          email: string;
        };
        Update: {
          id?: string;
          email?: string;
        };
      };
      task_notifications: {
        Row: {
          id: string; 
          user_id: string; 
          task_id: string; 
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          task_id: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          task_id?: string;
          message?: string;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}
