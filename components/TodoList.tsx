import React, { useEffect, useState } from 'react'
import { fetchTasks, toggleComplete, deleteTask } from '@/lib/actions'
import AddTask from './AddTask'
import TaskList from './TaskList'
import { Task, FilterType } from '@/types'
import { supabase } from '@/lib/initSupabase'
const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState('')

  
  useEffect(() => {
    const getUserId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUserId(user?.id ?? '')
    }
    getUserId()
  }, [])

  const loadTasks = async () => {
    setLoading(true)
    try {
      const fetched = await fetchTasks(filter, userId)
      setTasks(fetched)
    } catch (error) {
      alert('Failed to fetch tasks: ' + (error as Error).message)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!userId) return
    loadTasks()
  }, [filter, userId])

  // Realtime subscription to tasks
  useEffect(() => {
  if (!userId) return

  const channel = supabase
    .channel(`tasks_updates_for_user_${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'tasks',
        filter: `assigned_to=eq.${userId}`,
      },
      (payload) => {
        alert(`New task assigned: ${payload.new.title}`)
        loadTasks()
      }
    )

  channel.subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [userId])


  const handleToggleComplete = async (id: string, isComplete: boolean) => {
    try {
      await toggleComplete(id, isComplete)
      loadTasks()
    } catch (error) {
      alert('Failed to update task: ' + (error as Error).message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return
    try {
      await deleteTask(id)
      loadTasks()
    } catch (error) {
      alert('Failed to delete task: ' + (error as Error).message)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Todo List</h1>

      <div className="mb-4">
        <label htmlFor="filter" className="mr-2 font-semibold">
          Filter Tasks:
        </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterType)}
          className="border p-1"
        >
          <option value="all">All Tasks</option>
          <option value="assigned_to_me">Tasks Assigned To Me</option>
          <option value="created_by_me">Tasks I Created</option>
          <option value="overdue">Overdue Tasks</option>
          <option value="due_today">Tasks Due Today</option>
        </select>
      </div>

      <AddTask onTaskAdded={loadTasks} />

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <TaskList
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default TodoList
