import { supabase } from './initSupabase';
import { Task, FilterType } from '@/types';
export async function fetchTasks(filter: FilterType, userId: string): Promise<Task[]> {
  let query = supabase.from('tasks').select('*');

  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  switch (filter) {
    case 'assigned_to_me':
      query = query.eq('assigned_to', userId);
      break;

    case 'created_by_me':
      query = query.eq('created_by', userId);
      break;

    case 'overdue':
      query = query
        .eq('assigned_to', userId)
        .lt('due_date', startOfDay.toISOString())
        .eq('is_complete', false);
      break;

    case 'due_today':
      query = query
        .eq('assigned_to', userId)
        .gte('due_date', startOfDay.toISOString())
        .lte('due_date', endOfDay.toISOString());
      break;

    default:
      break;
  }

  const { data, error } = await query.order('due_date', { ascending: true });

  if (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }

  return data as Task[];
}
export async function addTask(task: Partial<Task>) {
  const { data, error } = await supabase.from('tasks').insert([task])

  if (error) {
    console.error('Error adding task:', error)
    throw error
  }

  return data
}
export async function toggleComplete(id: string, isComplete: boolean) {
  const { data, error } = await supabase
    .from('tasks')
    .update({ is_complete: isComplete })
    .eq('id', id)

  if (error) {
    console.error('Error toggling complete:', error)
    throw error
  }

  return data
}
export async function deleteTask(id: string) {
  const { data, error } = await supabase.from('tasks').delete().eq('id', id)

  if (error) {
    console.error('Error deleting task:', error)
    throw error
  }

  return data
}

