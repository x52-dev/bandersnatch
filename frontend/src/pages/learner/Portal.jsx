import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Clock, CheckCircle2, Film, Loader2, Sparkles, LogOut } from 'lucide-react';
import { learnerVideoService } from '../../services/videoService';

export default function LearnerPortal() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const learnerName = localStorage.getItem('name') || 'Learner';

  useEffect(() => {
    learnerVideoService.getAssigned().then(res => {
      setVideos(res.data);
      setLoading(false);
    }).catch(err => console.error(err));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      
      {/* Top Navigation */}
      <nav className="border-b border-slate-800/60 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <PlayCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Lumina<span className="text-indigo-500">Learn</span></span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-slate-400">Welcome back, <span className="text-white">{learnerName}</span></span>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-4 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Your Workspace
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Assigned Coursework</h1>
          <p className="text-slate-400 text-lg">Videos and interactive checkpoints assigned by your administrators.</p>
        </div>

        {videos.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/30">
            <Film className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-300 mb-2">You're all caught up!</h3>
            <p className="text-slate-500">No videos are currently assigned to your account.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video._id} className="group relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 shadow-xl hover:shadow-indigo-500/10 flex flex-col">
                
                {/* Thumbnail Area (If none, render a sleek gradient) */}
                <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-slate-950/40 backdrop-blur-sm transition-all duration-300 z-10">
                    <button 
                      onClick={() => navigate(`/learner/watch/${video._id}`)}
                      className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.5)] transform scale-90 group-hover:scale-100 transition-all"
                    >
                      <PlayCircle className="w-8 h-8 ml-1" />
                    </button>
                  </div>
                  {video.thumbnailUrl ? (
                    <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Film className="w-12 h-12 text-slate-700" /></div>
                  )}
                </div>

                {/* Content Details */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{video.title}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-6 flex-1">
                    {video.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-950 px-3 py-1.5 rounded-lg">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      {video.questions?.length || 0} Checkpoints
                    </div>
                    {/* Assuming progress tracking is wired, you can show a "Resume" or "Start" badge here */}
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1 hover:text-indigo-300 cursor-pointer" onClick={() => navigate(`/learner/watch/${video._id}`)}>
                      Begin Module <PlayCircle className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}