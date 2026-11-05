export default function TaskItem({ task, onToggle, onDelete }) {
  const isCompleted = task.status === 'COMPLETED';

  // Color coding for priorities
  const priorityColors = {
    HIGH: 'bg-red-100 text-red-700',
    MEDIUM: 'bg-yellow-100 text-yellow-700',
    LOW: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className={`flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border transition-all ${isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onToggle(task.id, task.status)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-blue-500'}`}
        >
          {isCompleted && '✓'}
        </button>
        <div>
          <h3 className={`font-medium ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
            {task.title}
          </h3>
          
          {/* Priority Badge */}
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${priorityColors[task.priority] || 'bg-gray-100 text-gray-600'}`}>
              {task.priority}
            </span>
          </div>
        </div>
      </div>
      
      <button 
        onClick={() => onDelete(task.id)} 
        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
      >
        Delete
      </button>
    </div>
  );
}