import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, createProject, deleteProject } from '../api';
import { Plus, Trash2, Folder, ChevronLeft, ChevronRight } from 'lucide-react';

const ProjectList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchProjects();
  }, [page]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await getProjects(page);
      setProjects(res.data.data);
      setTotalPages(Math.ceil(res.data.total / 10));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createProject(newProject);
      setShowModal(false);
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project and all its tasks?')) {
      try {
        await deleteProject(id);
        fetchProjects();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 style={{fontSize: '2rem', fontWeight: 'bold'}}>Projects</h1>
          <p className="text-muted">Manage your team projects and tasks</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} /> Create Project
        </button>
      </div>

      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <>
          <div className="grid">
            {projects.map((project) => (
              <div 
                key={project._id} 
                className="glass-card" 
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/projects/${project._id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <Folder className="text-primary" size={24} />
                    <h3 style={{color: 'var(--text-main)'}}>{project.name}</h3>
                  </div>
                  <button 
                    className="btn btn-outline" 
                    style={{padding: '0.4rem', color: 'var(--danger)', zIndex: 10, position: 'relative'}}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(e, project._id);
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="text-muted" style={{fontSize: '0.9rem'}}>
                  {project.description || 'No description provided.'}
                </p>
                <div style={{marginTop: '1.5rem', fontSize: '0.8rem'}} className="text-muted">
                  Created: {new Date(project.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button 
              className="btn btn-outline" 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              <ChevronLeft size={20} /> Prev
            </button>
            <span>Page {page} of {totalPages}</span>
            <button 
              className="btn btn-outline" 
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next <ChevronRight size={20} />
            </button>
          </div>
        </>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="mb-4">Create New Project</h2>
            <form onSubmit={handleCreate}>
              <label>Project Name</label>
              <input 
                type="text" 
                required 
                value={newProject.name}
                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                placeholder="e.g. Website Overhaul"
              />
              <label>Description</label>
              <textarea 
                rows="3"
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                placeholder="Briefly describe the project goals..."
              />
              <div className="flex justify-between gap-4">
                <button type="button" className="btn btn-outline" style={{flex: 1}} onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{flex: 1}}>
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
