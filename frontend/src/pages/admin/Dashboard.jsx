import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Edit2, UploadCloud, Users, LogOut, BarChart3 } from 'lucide-react';
import { adminVideoService } from '../../services/videoService';
import api from '../../services/api'; 
import VideoTable from '../../components/admin/VideoTable';
import Modal from '../../components/ui/Modal';
import EditVideoForm from '../../components/admin/EditVideoForm';
import AddVideoForm from '../../components/admin/AddVideoForm';
import AssignVideoModal from '../../components/admin/AssignVideoModal';
import LearnerMetricsModal from '../../components/admin/LearnerMetricsModal';

export default function Dashboard() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [editingVideo, setEditingVideo] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [assigningVideo, setAssigningVideo] = useState(null);
  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => { 
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await adminVideoService.getAll();
      setVideos(res.data);
    } catch (err) {
      console.error('Failed to fetch videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // NEW: Cascading Delete Handler
  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video? This will permanently wipe all associated learner progress.")) return;
    
    try {
      await adminVideoService.delete(videoId);
      setVideos(prev => prev.filter(v => v._id !== videoId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete video. Please check permissions or try again.");
    }
  };

  // UPDATED: Now passes thumbnailUrl to the backend
  const handleAddVideo = async (formData, mode) => {
    setIsAddModalOpen(false);
    const tempId = `processing_${Date.now()}`;
    
    // Add temp item to UI instantly for optimistic UX
    const processingVideo = { 
      _id: tempId, 
      title: formData.title || (mode === 'local' ? formData.file.name : 'URL Download'), 
      description: formData.description || 'Description unavailable.', 
      thumbnailUrl: formData.thumbnailUrl || '', // Wire up UI temp state
      createdAt: new Date().toISOString(), 
      isPublished: false, 
      isProcessing: true, 
      progress: 0 
    };
    setVideos(prev => [processingVideo, ...prev]);

    try {
      let res;
      if (mode === 'local') {
        const payload = new FormData();
        payload.append('file', formData.file); 
        payload.append('title', formData.title || formData.file.name); 
        payload.append('description', formData.description);
        payload.append('thumbnailUrl', formData.thumbnailUrl || ''); // Wire up payload

        res = await api.post('/admin/videos/upload/local', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (p) => setVideos(prev => prev.map(v => v._id === tempId ? { ...v, progress: Math.round((p.loaded * 100) / p.total) } : v))
        });
      } else {
        setVideos(prev => prev.map(v => v._id === tempId ? { ...v, progress: 50 } : v));
        res = await api.post('/admin/videos/upload/url', { 
          url: formData.url, 
          title: formData.title || 'URL Download', 
          description: formData.description,
          thumbnailUrl: formData.thumbnailUrl || '' // Wire up JSON body
        });
      }
      // Replace processing stub with real DB object
      setVideos(prev => prev.map(v => v._id === tempId ? res.data : v));
    } catch (error) {
      alert("Failed to process video."); 
      setVideos(prev => prev.filter(v => v._id !== tempId));
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try { 
      setVideos(videos.map(v => v._id === id ? { ...v, isPublished: !currentStatus } : v)); 
      await adminVideoService.togglePublish(id, !currentStatus); 
    } catch { 
      fetchVideos();
    }
  };

  // UPDATED: Edits now accept thumbnailUrl changes
  const handleUpdateVideo = async (formData) => {
    setIsUpdating(true);
    try { 
      const res = await adminVideoService.update(editingVideo._id, formData); 
      setVideos(videos.map(v => v._id === editingVideo._id ? res.data : v)); 
      setEditingVideo(null); 
    } finally { 
      setIsUpdating(false); 
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-white to-slate-100 p-8 font-sans">
      
      <div className="max-w-7xl mx-auto mb-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Film className="w-5 h-5 text-white" />
            </div>
            Video Management
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Manage learning modules, checkpoints, and publishing.</p>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 text-sm font-semibold rounded-xl shadow-sm transition-all group"
        >
          <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-500 transition-colors" />
          Sign Out
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        <VideoTable 
          videos={videos} 
          loading={loading} 
          onTogglePublish={handleTogglePublish} 
          onEdit={setEditingVideo} 
          onAddVideo={() => setIsAddModalOpen(true)}
          onAssign={setAssigningVideo}
          onViewMetrics={() => setIsMetricsModalOpen(true)} 
          onDelete={handleDeleteVideo} // <-- NEW DELETE PROP MAPPED HERE
        />
      </div>

      {/* Modals */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Video Module" icon={UploadCloud}>
        <AddVideoForm onSubmit={handleAddVideo} onCancel={() => setIsAddModalOpen(false)} />
      </Modal>

      <Modal isOpen={!!editingVideo} onClose={() => setEditingVideo(null)} title="Modify Module Metadata" icon={Edit2}>
        {editingVideo && <EditVideoForm video={editingVideo} isUpdating={isUpdating} onSubmit={handleUpdateVideo} onCancel={() => setEditingVideo(null)} />}
      </Modal>

      <Modal isOpen={!!assigningVideo} onClose={() => setAssigningVideo(null)} title="Assign to Learners" icon={Users}>
        {assigningVideo && <AssignVideoModal video={assigningVideo} onClose={() => { setAssigningVideo(null); fetchVideos(); }} />}
      </Modal>

      <Modal isOpen={isMetricsModalOpen} onClose={() => setIsMetricsModalOpen(false)} title="Learner Analytics Dashboard" icon={BarChart3}>
        {isMetricsModalOpen && <LearnerMetricsModal onClose={() => setIsMetricsModalOpen(false)} />}
      </Modal>

    </div>
  );
}