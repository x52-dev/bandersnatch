import React, { useState } from 'react';
import { UploadCloud, Link as LinkIcon, Loader2 } from 'lucide-react';

export default function AddVideoForm({ onSubmit, onCancel }) {
  const [mode, setMode] = useState('local'); // 'local' or 'url'
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnailUrl: '', // NEW: Thumbnail state
    file: null,
    url: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, mode);
  };

  const isSubmitDisabled = mode === 'local' ? !formData.file : !formData.url;

  return (
    <form onSubmit={handleSubmit} className="p-6 flex flex-col h-[65vh]">
      
      {/* Mode Selector */}
      <div className="flex bg-slate-100 p-1 rounded-xl mb-6 flex-shrink-0">
        <button
          type="button"
          onClick={() => setMode('local')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${mode === 'local' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <UploadCloud className="w-4 h-4" /> Local File
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${mode === 'url' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <LinkIcon className="w-4 h-4" /> Remote URL
        </button>
      </div>

      {/* Scrollable Form Content */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        
        {/* File / URL Input */}
        {mode === 'local' ? (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Video File <span className="text-red-500">*</span></label>
            <input 
              type="file" 
              accept="video/*" 
              onChange={e => setFormData({...formData, file: e.target.files[0]})}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all"
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Video URL <span className="text-red-500">*</span></label>
            <input 
              type="url" 
              placeholder="https://example.com/video.mp4"
              value={formData.url} 
              onChange={e => setFormData({...formData, url: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white text-sm transition-all"
            />
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Module Title</label>
          <input 
            type="text" 
            placeholder={mode === 'local' ? "Leave blank to use filename" : "Enter video title"}
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white text-sm transition-all"
          />
        </div>

        {/* NEW: Thumbnail URL */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Thumbnail URL (Optional)</label>
          <input 
            type="url" 
            placeholder="https://example.com/poster-image.jpg"
            value={formData.thumbnailUrl} 
            onChange={e => setFormData({...formData, thumbnailUrl: e.target.value})}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white text-sm transition-all"
          />
          <p className="text-xs text-slate-400 mt-1">If left blank, a placeholder will be generated automatically.</p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
          <textarea 
            rows="3"
            placeholder="What will learners achieve in this module?"
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white text-sm transition-all resize-none"
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-6 mt-4 border-t border-slate-100 flex justify-end gap-3 flex-shrink-0">
        <button type="button" onClick={onCancel} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isSubmitDisabled} 
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md disabled:opacity-50 disabled:pointer-events-none transition-all active:scale-[0.98]"
        >
          Add to Inventory
        </button>
      </div>
    </form>
  );
}