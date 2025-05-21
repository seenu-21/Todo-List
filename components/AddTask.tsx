import React, { useState, useEffect } from 'react'
import { addTask } from '@/lib/actions'
import { supabase } from '@/lib/initSupabase'

interface AddTaskProps {
  onTaskAdded: () => void
}
const AddTask: React.FC<AddTaskProps> = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [assignedTo, setAssignedTo] = useState<string | null>(null)
  const [users, setUsers] = useState<{ id: string, email: string }[]>([])
  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('users').select('id, email')
      if (error) {
        console.error('Error fetching users:', error)
      } else {
        setUsers(data || [])
      }
    }

    const fetchCurrentUser = async () => {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser()

      if (user) setUserId(user.id)
      if (error) console.error('Error fetching current user:', error)
    }

    fetchUsers()
    fetchCurrentUser()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !assignedTo) {
      alert('Please provide a title and assign the task.')
      return
    }

    try {
      await addTask({
        title,
        description,
        due_date: dueDate || null, 
        assigned_to: assignedTo,
        created_by: userId,
        is_complete: false,
        created_at: new Date().toISOString()
      })
      setTitle('')
      setDescription('')
      setDueDate('')
      setAssignedTo(null)
      onTaskAdded()
    } catch (error) {
      alert('Error adding task: ' + (error as Error).message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow mb-6">
      <h2 className="mb-2 font-bold text-lg">Add New Task</h2>

      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      <input
        type="date"
        value={dueDate}
        onChange={e => setDueDate(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      <select
        value={assignedTo || ''}
        onChange={e => setAssignedTo(e.target.value)}
        className="border p-2 w-full mb-2"
      >
        <option value="" disabled>
          Assign to user
        </option>
        {users.map(user => (
          <option key={user.id} value={user.id}>
            {user.email}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Task
      </button>
    </form>
  )
}

export default AddTask