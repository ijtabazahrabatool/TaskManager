import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getTasks, createTask, updateTaskStatus, deleteTask } from './taskApi';
import TaskItem from './TaskItem';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('MEDIUM'); // <-- New State

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      toast.error('Failed to load tasks');
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      // Pass priority to the API
      await createTask(title, priority); 
      setTitle('');
      setPriority('MEDIUM'); // Reset dropdown to default
      toast.success('Task added');
      loadTasks();
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    await updateTaskStatus(id, newStatus);
    toast.success(`Task marked as ${newStatus.toLowerCase()}`);
    loadTasks();
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    toast.success('Task deleted');
    loadTasks();
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-gray-800">Hello, {user?.name}</h2>
          <button onClick={logout} className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition">
            Logout
          </button>
        </div>

        {/* Create Task Form */}
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-2 mb-8">
          <input 
            value={title} onChange={(e) => setTitle(e.target.value)} 
            placeholder="What needs to be done?" required 
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
          
          {/* New Priority Dropdown */}
          <select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white cursor-pointer"
          >
            <option value="LOW">Low Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="HIGH">High Priority</option>
          </select>

          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-sm transition">
            Add
          </button>
        </form>

        {/* Task List */}
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500">No tasks yet. Create one above!</p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={handleToggle} onDelete={handleDelete} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}