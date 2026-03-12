import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject, getTasks, createTask, updateTask, deleteTask } from '../api';
import { ArrowLeft, Plus, CheckCircle, Clock, AlertCircle, Trash2, Edit2, Filter, ArrowUpDown } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    due_date: ''
  });

  useEffect(() => {
    fetchProjectAndTasks();
  }, [id, statusFilter, sortBy]);

  const fetchProjectAndTasks = async () => {
    try {
      setLoading(true);
      const [projRes, tasksRes] = await Promise.all([
        getProject(id),
        getTasks(id, { status: statusFilter, sort: sortBy })
      ]);
      setProject(projRes.data.data);
      setTasks(tasksRes.data.data);
    } catch (err) {
      console.error(err);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await updateTask(editingTask._id, taskForm);
      } else {
        await createTask(id, taskForm);
      }
      setShowTaskModal(false);
      setEditingTask(null);
      setTaskForm({ title: '', description: '', status: 'todo', priority: 'medium', due_date: '' });
      fetchProjectAndTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : ''
    });
    setShowTaskModal(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Delete this task?')) {
      try {
        await deleteTask(taskId);
        fetchProjectAndTasks();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'done': return <CheckCircle className="text-success" size={18} />;
      case 'in-progress': return <Clock className="text-primary" size={18} />;
      default: return <AlertCircle className="text-muted" size={18} />;
    }
  };

  if (loading && !project) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <button className="btn btn-outline mb-4" onClick={() => navigate('/')}>
        <ArrowLeft size={18} /> Back to Projects
      </button>

      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 style={{fontSize: '2.5rem', fontWeight: 'bold'}}>{project?.name}</h1>
          <p className="text-muted">{project?.description}</p>
        </div>
        <button className="btn btn-primary" onClick={() => {
          setEditingTask(null);
          setTaskForm({ title: '', description: '', status: 'todo', priority: 'medium', due_date: '' });
          setShowTaskModal(true);
        }}>
          <Plus size={20} /> Add Task
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-muted" />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{marginBottom: 0, width: 'auto'}}
          >
            <option value="">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown size={18} className="text-muted" />
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={{marginBottom: 0, width: 'auto'}}
          >
            <option value="">Sort By</option>
            <option value="due_date">Due Date</option>
          </select>
        </div>
      </div>

      <div className="grid">
        {tasks.map(task => (
          <div key={task._id} className="glass-card">
            <div className="flex justify-between items-start mb-3">
              <span className={`badge badge-${task.status}`}>
                {task.status.replace('-', ' ')}
              </span>
              <div className="flex gap-2">
                <button className="btn btn-outline" style={{padding: '0.3rem'}} onClick={() => handleEdit(task)}>
                  <Edit2 size={14} />
                </button>
                <button className="btn btn-outline" style={{padding: '0.3rem', color: 'var(--danger)'}} onClick={() => handleDeleteTask(task._id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            
            <h3 className="mb-2" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              {getStatusIcon(task.status)}
              {task.title}
            </h3>
            <p className="text-muted mb-4" style={{fontSize: '0.9rem'}}>
              {task.description || 'No description.'}
            </p>
            
            <div className="flex justify-between items-center" style={{fontSize: '0.75rem'}}>
              <span className={`badge badge-${task.priority}`}>
                {task.priority}
              </span>
              <span className="text-muted">
                {task.due_date ? `Due: ${new Date(task.due_date).toLocaleDateString()}` : 'No due date'}
              </span>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="glass-card" style={{gridColumn: '1 / -1', textAlign: 'center', padding: '3rem'}}>
            <p className="text-muted">No tasks found. Start by adding one!</p>
          </div>
        )}
      </div>

      {showTaskModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{maxWidth: '600px'}}>
            <h2 className="mb-4">{editingTask ? 'Edit Task' : 'Add Task'}</h2>
            <form onSubmit={handleTaskSubmit}>
              <label>Task Title</label>
              <input 
                type="text" required
                value={taskForm.title}
                onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
              />
              <label>Description</label>
              <textarea 
                rows="3"
                value={taskForm.description}
                onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
              />
              <div className="flex gap-4">
                <div style={{flex: 1}}>
                  <label>Status</label>
                  <select 
                    value={taskForm.status}
                    onChange={(e) => setTaskForm({...taskForm, status: e.target.value})}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div style={{flex: 1}}>
                  <label>Priority</label>
                  <select 
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <label>Due Date</label>
              <input 
                type="date"
                value={taskForm.due_date}
                onChange={(e) => setTaskForm({...taskForm, due_date: e.target.value})}
              />
              <div className="flex justify-between gap-4 mt-4">
                <button type="button" className="btn btn-outline" style={{flex: 1}} onClick={() => setShowTaskModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{flex: 1}}>
                  {editingTask ? 'Update Task' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
