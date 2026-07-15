import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Eye, EyeOff, Edit2, Loader2, Plus, Search, Layers, Users, BarChart3, Trash2, ImageOff } from 'lucide-react';

export default function VideoTable({ videos, loading, onTogglePublish, onEdit, onAddVideo, onAssign, onViewMetrics, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-200/40 overflow-hidden">
      
      <div className="px-6 py-5 border-b border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/40">
        <div className="flex items-center gap-3">
          <button onClick={onAddVideo} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all active:scale-[0.98] w-fit">
            <Plus className="w-4 h-4" /> Add New Video
          </button>
          <button onClick={onViewMetrics} className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600 px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-all">
            <BarChart3 className="w-4 h-4" /> Learner Metrics
          </button>
        </div>

        <div className="relative group w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors" />
          <input type="text" placeholder="Search inventory..." className="w-full pl-9 pr-4 py-2 bg-white/80 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200/60">
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-2/5">Video Details</th>
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Date Created</th>
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="4" className="py-16 text-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" /></td></tr>
            ) : videos.length === 0 ? (
              <tr><td colSpan="4" className="py-16 text-center text-slate-400 font-medium">Inventory is empty. Click "Add New Video" to get started.</td></tr>
            ) : (
              videos.map((video) => (
                <tr key={video._id} className="hover:bg-slate-50/50 transition-colors group">
                  
                  {/* SDE II FIX: Square Thumbnail Layout */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      {/* Small Square Thumbnail */}
                      <div className="w-14 h-14 bg-slate-100 rounded-xl border border-slate-200 flex-shrink-0 overflow-hidden flex items-center justify-center relative shadow-sm">
                        {video.thumbnailUrl ? (
                          <img 
                            src={video.thumbnailUrl} 
                            alt={video.title} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null; 
                              e.target.src = "https://placehold.co/100x100/1e293b/ffffff?text=Video";
                            }}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-400">
                            <ImageOff className="w-5 h-5 mb-0.5" />
                            <span className="text-[8px] font-bold">NO IMAGE</span>
                          </div>
                        )}
                      </div>

                      {/* Text Details next to the square */}
                      <div>
                        <div className="font-semibold text-slate-900 text-base mb-0.5">{video.title}</div>
                        <div className={`text-sm line-clamp-1 max-w-sm ${video.description === 'Description unavailable.' ? 'text-slate-400 italic' : 'text-slate-500'}`}>
                          {video.description}
                        </div>
                        {video.isProcessing && (
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 rounded-full transition-all duration-300 ease-out" style={{ width: `${video.progress}%` }} />
                            </div>
                            <span className="text-[10px] font-bold text-indigo-600">{video.progress}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Date Column */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {new Date(video.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </td>

                  {/* Status Column */}
                  <td className="py-4 px-6">
                    {video.isProcessing ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 animate-pulse">
                        <Loader2 className="w-3 h-3 animate-spin" /> Processing...
                      </span>
                    ) : (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${video.isPublished ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${video.isPublished ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {video.isPublished ? 'Published' : 'Draft'}
                      </span>
                    )}
                  </td>

                  {/* Actions Column */}
                  <td className="py-4 px-6">
                    <div className={`flex items-center justify-end gap-2 transition-all ${video.isProcessing ? 'opacity-40 pointer-events-none' : 'opacity-80 group-hover:opacity-100'}`}>
                      
                      <button onClick={() => navigate(`/admin/editor/${video._id}`)} className="p-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 hover:bg-indigo-600 hover:text-white shadow-sm transition-all" title="Interactive Timeline Editor">
                        <Layers className="w-4 h-4" />
                      </button>

                      <button onClick={() => onTogglePublish(video._id, video.isPublished)} className={`p-2 rounded-lg border transition-all ${video.isPublished ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'}`} title={video.isPublished ? "Unpublish Video" : "Publish Video"}>
                        {video.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      
                      <button onClick={() => onEdit(video)} className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 shadow-sm transition-all" title="Edit Metadata">
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button onClick={() => onAssign(video)} className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 shadow-sm transition-all" title="Assign to Learners">
                        <Users className="w-4 h-4" />
                      </button>

                      <button onClick={() => onDelete(video._id)} className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-600 hover:bg-red-50 shadow-sm transition-all" title="Delete Video">
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}