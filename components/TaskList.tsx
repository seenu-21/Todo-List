import React from 'react'
import { Task } from '@/types'

interface TaskListProps {
  tasks: Task[]
  onToggleComplete: (id: string, isComplete: boolean) => void
  onDelete: (id: string) => void
}
const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleComplete, onDelete }) => {
  if (!tasks.length) return <p>No tasks found.</p>

  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id} className="border-b py-2 flex justify-between items-center">
          <div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={task.is_complete}
                onChange={() => onToggleComplete(task.id, !task.is_complete)}
                className="mr-2"
                aria-label={`Mark task "${task.title}" as ${task.is_complete ? 'incomplete' : 'complete'}`}
              />
              <span className={task.is_complete ? 'line-through text-gray-500' : ''}>
                {task.title}
              </span>
            </label>
            {task.description && (
              <p className="text-sm text-gray-600 ml-7">{task.description}</p>
            )}
            {task.due_date && (
              <small className="ml-7 text-sm text-gray-400 block">
                Due: {new Date(task.due_date).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </small>
            )}
          </div>
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-600 hover:text-red-800"
            aria-label={`Delete task "${task.title}"`}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
}

export default TaskList