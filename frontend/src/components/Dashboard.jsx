import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { 
  Trash2, Edit2, Plus, LogOut, CheckCircle2, 
  Clock, Search, Star, Folder, ChevronRight, 
  MoreHorizontal, FileText, Calendar, Hash, RefreshCcw, XCircle
} from 'lucide-react';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [deletedTasks, setDeletedTasks] = useState([]);
  const [isTrashView, setIsTrashView] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('All');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userInfo'));

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('userInfo');
        navigate('/login');
      }
    }
  };

  const fetchDeletedTasks = async () => {
    try {
      const { data } = await api.get('/tasks/deleted');
      setDeletedTasks(data.data);
    } catch (error) {
      console.error('Error fetching deleted tasks', error);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchTasks();
      fetchDeletedTasks();
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;
    
    const originalTasks = [...tasks];
    
    // Optimistic UI for New Task
    if (!editId) {
      const tempId = Date.now().toString();
      const tempTask = {
        id: tempId,
        title,
        description,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isOptimistic: true
      };
      setTasks([tempTask, ...tasks]);
      resetForm();
      
      try {
        const { data } = await api.post('/tasks', { title, description });
        // Replace temp task with real task
        setTasks(prev => prev.map(t => t.id === tempId ? data.data : t));
        setMessage({ type: 'success', text: 'Note created instantly' });
      } catch (error) {
        setTasks(originalTasks);
        setMessage({ type: 'error', text: 'Failed to save note' });
      }
    } else {
      // Update existing
      try {
        await api.put(`/tasks/${editId}`, { title, description, status });
        setMessage({ type: 'success', text: 'Note updated' });
        fetchTasks();
      } catch (error) {
        setMessage({ type: 'error', text: 'Error saving' });
      }
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('pending');
    setEditId(null);
  };

  const handleDelete = async (id) => {
    try {
      if (isTrashView) {
        await api.delete(`/tasks/${id}/permanent`);
        setMessage({ type: 'success', text: 'Note deleted permanently' });
        fetchDeletedTasks();
      } else {
        await api.delete(`/tasks/${id}`);
        setMessage({ type: 'success', text: 'Note moved to Trash' });
        fetchTasks();
        fetchDeletedTasks();
      }
      if (editId === id) resetForm();
    } catch (error) {
      setMessage({ type: 'error', text: 'Error deleting' });
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleRestore = async (id) => {
    try {
      await api.put(`/tasks/${id}/restore`);
      setMessage({ type: 'success', text: 'Note restored' });
      fetchTasks();
      fetchDeletedTasks();
      if (editId === id) resetForm();
    } catch (error) {
      setMessage({ type: 'error', text: 'Error restoring' });
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleEdit = (task) => {
    setEditId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status || 'pending');
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const displayedTasks = isTrashView ? deletedTasks : tasks;

  const filteredTasks = useMemo(() => {
    return displayedTasks.filter(task => {
      const matchesSearch = (task.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
                          (task.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      
      if (isTrashView) return matchesSearch;

      const matchesFolder = selectedFolder === 'All' || 
                           (selectedFolder === 'Completed' && task.status === 'completed') ||
                           (selectedFolder === 'Pending' && task.status === 'pending') ||
                           (selectedFolder === 'In Progress' && task.status === 'in-progress');
      return matchesSearch && matchesFolder;
    });
  }, [displayedTasks, searchQuery, selectedFolder, isTrashView]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      width: '100vw', 
      background: '#1c1c1e', 
      color: '#fff', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      overflow: 'hidden'
    }}>
      
      {/* Sidebar */}
      <aside style={{ 
        width: '260px', 
        background: '#000', 
        borderRight: '0.5px solid rgba(255,255,255,0.1)', 
        display: 'flex', 
        flexDirection: 'column',
        padding: '20px 0'
      }}>
        <div style={{ padding: '0 20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #a855f7, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>{user?.name}</span>
          </div>
          <button onClick={() => setShowProfileMenu(!showProfileMenu)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
            <MoreHorizontal size={18} />
          </button>
        </div>

        {showProfileMenu && (
          <div style={{ margin: '0 20px 20px', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '0.5px solid rgba(255,255,255,0.1)' }}>
            <p style={{ margin: '0 0 8px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{user?.email}</p>
            <p style={{ margin: '0 0 8px', fontSize: '11px', color: '#ff9f0a', fontWeight: 'bold', textTransform: 'uppercase' }}>{user?.role || 'User'}</p>
            <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#ff453a', fontSize: '13px', fontWeight: '600', cursor: 'pointer', padding: '4px 0' }}>
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        )}

        <nav style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ padding: '0 24px', fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Smart Folders</h3>
            {[
              { name: 'All', icon: <FileText size={16} /> },
              { name: 'Pending', icon: <Clock size={16} /> },
              { name: 'In Progress', icon: <Hash size={16} /> },
              { name: 'Completed', icon: <CheckCircle2 size={16} /> },
            ].map(folder => (
              <button 
                key={folder.name}
                onClick={() => { setIsTrashView(false); setSelectedFolder(folder.name); }}
                style={{ 
                  width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 24px', background: (!isTrashView && selectedFolder === folder.name) ? 'rgba(255,255,255,0.1)' : 'none', border: 'none', color: (!isTrashView && selectedFolder === folder.name) ? '#fff' : 'rgba(255,255,255,0.7)', cursor: 'pointer', textAlign: 'left', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s'
                }}
              >
                <span style={{ color: (!isTrashView && selectedFolder === folder.name) ? '#ff9f0a' : 'inherit' }}>{folder.icon}</span>
                {folder.name}
              </button>
            ))}
          </div>

          <div>
            <h3 style={{ padding: '0 24px', fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Collections</h3>
            <button 
              onClick={() => { setIsTrashView(true); setSelectedFolder('Trash'); }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 24px', background: isTrashView ? 'rgba(255,255,255,0.1)' : 'none', border: 'none', color: isTrashView ? '#fff' : 'rgba(255,255,255,0.7)', cursor: 'pointer', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>
              <Trash2 size={16} color="#ff453a" /> Recently Deleted
            </button>
          </div>
        </nav>
      </aside>

      {/* List Column */}
      <section style={{ 
        width: '320px', 
        background: '#1c1c1e', 
        borderRight: '0.5px solid rgba(255,255,255,0.1)', 
        display: 'flex', 
        flexDirection: 'column'
      }}>
        <div style={{ padding: '20px 20px 10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>{isTrashView ? 'Trash' : selectedFolder}</h2>
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
            <input 
              type="text" 
              placeholder="Search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 36px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
          {filteredTasks.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '40px', color: 'rgba(255,255,255,0.3)' }}>
              <p style={{ fontSize: '14px' }}>No notes found</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div 
                key={task.id}
                onClick={() => handleEdit(task)}
                style={{ 
                  padding: '12px 16px', borderRadius: '12px', background: editId === task.id ? 'rgba(255, 159, 10, 0.2)' : 'none', cursor: 'pointer', marginBottom: '4px', border: editId === task.id ? '1px solid rgba(255, 159, 10, 0.3)' : '1px solid transparent', transition: 'all 0.2s',
                  opacity: task.isOptimistic ? 0.6 : 1
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: editId === task.id ? '#ff9f0a' : '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                    {task.title || 'New Note'}
                  </h4>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{formatDate(task.updatedAt || task.createdAt)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
                    {task.description || 'No additional text'}
                  </p>
                  {task.status === 'completed' && !isTrashView && <CheckCircle2 size={12} color="#32d74b" />}
                  {isTrashView && <Trash2 size={12} color="#ff453a" />}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Editor Column */}
      <main style={{ flex: 1, background: '#1c1c1e', display: 'flex', flexDirection: 'column' }}>
        <header style={{ padding: '16px 24px', borderBottom: '0.5px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => { setIsTrashView(false); resetForm(); }}
            style={{ 
              marginRight: 'auto',
              background: 'linear-gradient(135deg, #ff9f0a, #ff453a)', 
              border: 'none', 
              borderRadius: '8px', 
              color: '#fff', 
              padding: '8px 16px', 
              fontSize: '13px', 
              fontWeight: '700', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              boxShadow: '0 4px 12px rgba(255, 69, 58, 0.3)'
            }}
          >
            <Plus size={16} strokeWidth={3} /> New Note
          </button>

          {editId && isTrashView && (
            <button 
              onClick={() => handleRestore(editId)}
              style={{ background: 'none', border: 'none', color: '#32d74b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '600' }}
            >
              <RefreshCcw size={18} /> Restore
            </button>
          )}

          {editId && (
            <button 
              onClick={() => handleDelete(editId)}
              style={{ background: 'none', border: 'none', color: '#ff453a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '600' }}
            >
              <Trash2 size={18} /> {isTrashView ? 'Delete Permanently' : 'Delete'}
            </button>
          )}
          
          <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }} />
          
          {!isTrashView && (
            <button 
              onClick={handleSubmit}
              style={{ background: 'none', border: 'none', color: '#ff9f0a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '600' }}
            >
              {editId ? 'Done' : 'Save'}
            </button>
          )}
        </header>

        <div style={{ flex: 1, overflowY: 'auto', padding: '40px 60px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontWeight: '600', textTransform: 'uppercase' }}>
                {isTrashView ? 'Currently in Trash' : (editId ? 'Last Modified: ' + formatDate(displayedTasks.find(t => t.id === editId)?.updatedAt) : 'Drafting')}
              </span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
              {editId && !isTrashView && (
                <select 
                  value={status} 
                  onChange={e => setStatus(e.target.value)}
                  style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '6px', color: '#ff9f0a', fontSize: '12px', fontWeight: '700', padding: '4px 8px', outline: 'none' }}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              )}
            </div>

            <input 
              type="text" 
              placeholder="Title"
              value={title}
              disabled={isTrashView}
              onChange={e => setTitle(e.target.value)}
              style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', fontSize: '32px', fontWeight: '800', outline: 'none', marginBottom: '24px', letterSpacing: '-0.5px', opacity: isTrashView ? 0.5 : 1 }}
            />

            <textarea 
              placeholder="Start writing..."
              value={description}
              disabled={isTrashView}
              onChange={e => setDescription(e.target.value)}
              style={{ width: '100%', height: 'calc(100vh - 300px)', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.8)', fontSize: '18px', lineHeight: '1.6', outline: 'none', resize: 'none', opacity: isTrashView ? 0.5 : 1 }}
            />
          </div>
        </div>

        <footer style={{ padding: '12px 24px', borderTop: '0.5px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'center' }}>
          <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>
            {tasks.length} Notes • {deletedTasks.length} in Trash
          </p>
        </footer>
      </main>

      {/* Toast Notification */}
      {message.text && (
        <div style={{
          position: 'fixed', bottom: '80px', right: '40px', zIndex: 1000, padding: '12px 24px', borderRadius: '12px', background: message.type === 'success' ? '#32d74b' : '#ff453a', color: '#fff', fontWeight: '600', fontSize: '14px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', animation: 'slideIn 0.3s ease-out'
        }}>
          {message.text}
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        ::placeholder { color: rgba(255,255,255,0.2); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); borderRadius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
};

export default Dashboard;
