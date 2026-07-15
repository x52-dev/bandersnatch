import React, { useState } from 'react';
import { Loader2, Image as ImageIcon } from 'lucide-react';

export default function EditVideoForm({ video, isUpdating, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: video.title || '',
    description: video.description || '',
    thumbnailUrl: video.thumbnailUrl || '' // NEW: Initialize with existing thumbnail
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 flex flex-col">
      <div className="space-y-5">
        
        {/* Title Field */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Module Title</label>
          <input 
            type="text" 
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white text-sm transition-all"
            required
          />
        </div>

        {/* NEW: Thumbnail Field */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Thumbnail URL</label>
          <div className="flex gap-3">
            <input 
              type="url" 
              placeholder="https://example.com/image.jpg"
              value={formData.thumbnailUrl} 
              onChange={e => setFormData({...formData, thumbnailUrl: e.target.value})}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white text-sm transition-all"
            />
            {/* Quick Preview Thumbnail Block */}
            {formData.thumbnailUrl ? (
              <img src={formData.thumbnailUrl} alt="Preview" className="w-12 h-10 object-cover rounded-lg border border-slate-200 shadow-sm" onError={(e) => { e.target.style.display = 'none'; }} />
            ) : (
              <div className="w-12 h-10 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center"><ImageIcon className="w-4 h-4 text-slate-400" /></div>
            )}
          </div>
        </div>

        {/* Description Field */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
          <textarea 
            rows="4"
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white text-sm transition-all resize-none"
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end gap-3">
        <button 
          type="button" 
          onClick={onCancel} 
          disabled={isUpdating}
          className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isUpdating} 
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md disabled:opacity-50 transition-all flex items-center gap-2 active:scale-[0.98]"
        >
          {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
          {isUpdating ? 'Saving Changes...' : 'Save Metadata'}
        </button>
      </div>
    </form>
  );
}