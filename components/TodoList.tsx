import { Database } from '@/lib/schema';
import { Session, useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import Notifications from './Notifications';

type Todos = Database['public']['Tables']['todos']['Row'] & {
  assignee?: { email: string } | null;
  creator?: { email: string } | null;
};

type FilterType = 'all' | 'assigned' | 'created' | 'overdue' | 'today';

export default function TodoList({ session }: { session: Session }) {
  const supabase = useSupabaseClient<Database>();
  const user = useUser();
  const [todos, setTodos] = useState<Todos[]>([]);
  const [users, setUsers] = useState<{ id: string; email: string }[]>([]);
  const [newTask, setNewTask] = useState({
    text: '',
    assigned_to: '',
    due_date: '',
  });
  const [errorText, setErrorText] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    const fetchData = async () => {
      const { data: todosData, error: todosError } = await supabase
        .from('todos')
        .select('*, assignee:assigned_to(email), creator:created_by(email)')
        .order('due_date', { ascending: true });

      if (todosError) {
        console.error('Error fetching todos:', todosError);
      } else {
        setTodos(todosData || []);
      }

      const { data: userData, error: userError } = await supabase
        .from('user_profiles')
        .select('id, email');

      if (userError) {
        console.error('Error fetching users:', userError);
      } else {
        setUsers(userData || []);
      }
    };

    fetchData();
  }, [supabase]);

  const addTodo = async () => {
    const task = newTask.text.trim();
    if (!task) {
      setErrorText('Task description cannot be empty');
      return;
    }
    setErrorText('');

    const assignedToValue = newTask.assigned_to === '' ? null : newTask.assigned_to;
    const createdByValue = user?.id ?? null;
    const userIdValue = user?.id ?? null;

    const { data: todo, error } = await supabase
      .from('todos')
      .insert({
        task,
        user_id: userIdValue,
        assigned_to: assignedToValue,
        due_date: newTask.due_date || null,
        created_by: createdByValue,
      })
      .select('*, assignee:assigned_to(email), creator:created_by(email)')
      .single();

    if (error) {
      setErrorText(error.message);
    } else if (todo) {
      setTodos([...todos, todo]);
      setNewTask({ text: '', assigned_to: '', due_date: '' });

      if (assignedToValue && assignedToValue !== user?.id) {
        await supabase.from('notifications').insert({
          user_id: assignedToValue,
          message: `New task assigned: ${task}`,
          todo_id: todo.id,
        });
      }
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await supabase.from('todos').delete().eq('id', id);
      setTodos(todos.filter((x) => x.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const dueDateStr = todo.due_date?.split('T')[0];

    switch (filter) {
      case 'assigned':
        return todo.assigned_to === user?.id;
      case 'created':
        return todo.created_by === user?.id;
      case 'overdue':
        return dueDateStr !== undefined && dueDateStr < todayStr;
      case 'today':
        return dueDateStr === todayStr;
      case 'all':
      default:
        return true;
    }
  });

  return (
    <div className="w-full">
      <Notifications userId={user?.id} />

      <div className="flex gap-4 mb-4">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'font-bold' : ''}>
          All Tasks
        </button>
        <button onClick={() => setFilter('assigned')} className={filter === 'assigned' ? 'font-bold' : ''}>
          Assigned to Me
        </button>
        <button onClick={() => setFilter('created')} className={filter === 'created' ? 'font-bold' : ''}>
          My Created Tasks
        </button>
        <button onClick={() => setFilter('overdue')} className={filter === 'overdue' ? 'font-bold' : ''}>
          Overdue
        </button>
        <button onClick={() => setFilter('today')} className={filter === 'today' ? 'font-bold' : ''}>
          Due Today
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTodo();
        }}
        className="flex flex-col gap-2 my-2"
      >
        <input
          className="rounded p-2"
          type="text"
          placeholder="Task description"
          value={newTask.text}
          onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
        />

        <select
          className="rounded p-2"
          value={newTask.assigned_to}
          onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}
        >
          <option value="">Assign to...</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.email}
            </option>
          ))}
        </select>

        <input
          className="rounded p-2"
          type="datetime-local"
          value={newTask.due_date}
          onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
        />

        <button className="btn-black" type="submit">
          Add Task
        </button>
      </form>

      {!!errorText && <div className="text-red-500">{errorText}</div>}

      <div className="bg-white shadow overflow-hidden rounded-md">
        <ul>
          {filteredTodos.map((todo) => (
            <Todo key={todo.id} todo={todo} onDelete={() => deleteTodo(todo.id)} currentUserId={user?.id} />
          ))}
        </ul>
      </div>
    </div>
  );
}

const Todo = ({
  todo,
  onDelete,
  currentUserId,
}: {
  todo: Todos;
  onDelete: () => void;
  currentUserId?: string;
}) => {
  const supabase = useSupabaseClient<Database>();
  const [isCompleted, setIsCompleted] = useState(todo.is_complete);

  const toggle = async () => {
    try {
      const { data } = await supabase
        .from('todos')
        .update({ is_complete: !isCompleted })
        .eq('id', todo.id)
        .single();

      if (data) setIsCompleted(data.is_complete);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <li className="w-full block cursor-pointer hover:bg-gray-100 p-4 border-b">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="font-medium">{todo.task}</div>
          <div className="text-sm text-gray-500">
            {todo.due_date && `Due: ${new Date(todo.due_date).toLocaleString()}`}
          </div>
          {todo.assigned_to && (
            <div className="text-sm">
              Assigned to: {todo.assignee?.email}
              {todo.assigned_to === currentUserId && ' (You)'}
            </div>
          )}
          <div className="text-sm">Created by: {todo.creator?.email}</div>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            checked={isCompleted || false}
            onChange={toggle}
            className="h-4 w-4"
          />
          <button onClick={onDelete} className="text-red-500 hover:text-red-700">
            Delete
          </button>
        </div>
      </div>
    </li>
  );
};

