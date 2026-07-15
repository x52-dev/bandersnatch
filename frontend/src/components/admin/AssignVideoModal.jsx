import React, { useState, useEffect } from 'react';
import { Loader2, Users, Search, AlertTriangle } from 'lucide-react';
import { adminVideoService } from '../../services/videoService';

export default function AssignVideoModal({ video, onClose }) {
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // SDE II Defensive State: Normalize assignedTo to always be an array of flat string IDs
  const [selectedIds, setSelectedIds] = useState(() => {
    if (!video || !video.assignedTo) return [];
    return video.assignedTo.map(item => 
      typeof item === 'object' && item !== null ? item._id || item.toString() : item.toString()
    );
  });

  useEffect(() => {
    console.log("Initializing Assignment Modal for Video:", video);
    
    adminVideoService.getLearners()
      .then(res => {
        console.log("API successfully returned learners:", res.data);
        // Ensure res.data is actually an array before committing to state
        setLearners(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Critical error fetching learners list:", err);
        setApiError(err.message || "Failed to communicate with authentication service.");
        setLoading(false);
      });
  }, [video]);

  const handleToggleSelect = (id) => {
    const stringId = id.toString();
    setSelectedIds(prev => 
      prev.includes(stringId) ? prev.filter(learnerId => learnerId !== stringId) : [...prev, stringId]
    );
  };

  const handleAssign = async () => {
    setIsAssigning(true);
    try {
      console.log(`Submitting assignment payload for video ${video._id}:`, selectedIds);
      await adminVideoService.assignToLearners(video._id, selectedIds);
      onClose(); 
    } catch (err) {
      console.error('Failed to update learner assignments:', err);
      alert("Network error: Could not commit changes to the database.");
    } finally {
      setIsAssigning(false);
    }
  };

  // Safe Filter Logic: Guards against null/undefined fields in the DB records
  const filteredLearners = learners.filter(l => {
    const name = l?.name ? String(l.name).toLowerCase() : '';
    const email = l?.email ? String(l.email).toLowerCase() : '';
    const query = searchTerm.toLowerCase();
    return name.includes(query) || email.includes(query);
  });

  return (
    <div className="flex flex-col h-[60vh]">
      <div className="p-6 flex-1 flex flex-col overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="relative mb-4 flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search learners by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-900 shadow-sm"
          />
        </div>

        {/* Scrollable Container Block */}
        <div className="flex-1 overflow-y-auto border border-slate-200/80 rounded-2xl bg-slate-50 p-3 space-y-1.5 min-h-[200px]">
          {loading ? (
            <div className="h-full min-h-[200px] flex flex-col items-center justify-center gap-2 text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              <span className="text-xs font-medium">Querying active directory...</span>
            </div>
          ) : apiError ? (
            <div className="h-full flex flex-col items-center justify-center p-4 text-center text-sm font-medium text-red-600 gap-2">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              {apiError}
            </div>
          ) : filteredLearners.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-sm text-slate-400 font-medium py-12">
              No matching records found.
            </div>
          ) : (
            filteredLearners.map(learner => {
              const isChecked = selectedIds.includes(String(learner._id));
              return (
                <label 
                  key={learner._id} 
                  className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all border select-none ${
                    isChecked 
                      ? 'bg-indigo-50/80 border-indigo-200 shadow-sm' 
                      : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500/30 checked:bg-indigo-600 transition-colors"
                    checked={isChecked}
                    onChange={() => handleToggleSelect(learner._id)}
                  />
                  <div>
                    <div className="text-sm font-bold text-slate-900">{learner.name || 'Anonymous User'}</div>
                    <div className="text-xs font-semibold text-slate-400 mt-0.5">{learner.email}</div>
                  </div>
                </label>
              );
            })
          )}
        </div>
      </div>

      {/* Footer Block */}
      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 flex-shrink-0">
        <button 
          type="button"
          onClick={onClose} 
          className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
        >
          Cancel
        </button>
        <button 
          type="button"
          onClick={handleAssign} 
          disabled={isAssigning || loading || apiError} 
          className="px-6 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white text-sm font-bold rounded-xl flex items-center gap-2 transition-all shadow-md disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98]"
        >
          {isAssigning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Users className="w-4 h-4" />}
          Assign to {selectedIds.length} Learners
        </button>
      </div>
    </div>
  );
}