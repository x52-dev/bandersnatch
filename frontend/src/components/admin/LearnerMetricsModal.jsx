import React, { useState, useEffect } from 'react';
import { Loader2, Search, ArrowLeft, BarChart3, CheckCircle2, XCircle } from 'lucide-react';
import { adminVideoService } from '../../services/videoService';

export default function LearnerMetricsModal({ onClose }) {
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Drill-down state
  const [selectedLearner, setSelectedLearner] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [metricsLoading, setMetricsLoading] = useState(false);

  useEffect(() => {
    adminVideoService.getLearners().then(res => {
      setLearners(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    });
  }, []);

  const handleSelectLearner = async (learner) => {
    setSelectedLearner(learner);
    setMetricsLoading(true);
    try {
      const res = await adminVideoService.getLearnerMetrics(learner._id);
      setMetrics(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setMetricsLoading(false);
    }
  };

  if (selectedLearner) {
    return (
      <div className="flex flex-col h-[70vh]">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <button onClick={() => setSelectedLearner(null)} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h3 className="font-bold text-slate-900">{selectedLearner.name}</h3>
            <p className="text-xs text-slate-500">{selectedLearner.email}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {metricsLoading ? (
            <div className="h-full flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
          ) : metrics.length === 0 ? (
            <div className="text-center text-slate-500 py-10">No videos assigned to this learner yet.</div>
          ) : (
            <div className="space-y-4">
              {metrics.map(m => (
                <div key={m._id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-slate-900">{m.title}</h4>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${m.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {m.status}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-5">
                    <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                      <span>Video Progress</span>
                      <span>{m.completionPercentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${m.completionPercentage}%` }} />
                    </div>
                  </div>

                  {/* Quiz Stats */}
                  <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900">{m.totalQuestions}</div>
                      <div className="text-xs font-semibold text-slate-400">Total Checkpoints</div>
                    </div>
                    <div className="text-center border-l border-slate-100">
                      <div className="text-2xl font-bold text-emerald-500 flex justify-center items-center gap-1">
                        {m.correctAnswers} <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="text-xs font-semibold text-slate-400">Correct</div>
                    </div>
                    <div className="text-center border-l border-slate-100">
                      <div className="text-2xl font-bold text-red-500 flex justify-center items-center gap-1">
                        {m.wrongAnswers} <XCircle className="w-4 h-4" />
                      </div>
                      <div className="text-xs font-semibold text-slate-400">Wrong</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- Main Search View ---
  const filteredLearners = learners.filter(l => (l?.name || '').toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex flex-col h-[60vh]">
      <div className="p-6 flex-1 flex flex-col overflow-hidden">
        <div className="relative mb-4 flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" placeholder="Search learners to view metrics..." 
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>

        <div className="flex-1 overflow-y-auto border border-slate-200 rounded-2xl bg-slate-50 p-2 space-y-1">
          {loading ? (
            <div className="h-full flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
          ) : (
            filteredLearners.map(learner => (
              <div 
                key={learner._id} onClick={() => handleSelectLearner(learner)}
                className="flex items-center justify-between p-4 rounded-xl cursor-pointer bg-white border border-slate-100 hover:border-indigo-300 hover:shadow-md transition-all group"
              >
                <div>
                  <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{learner.name}</div>
                  <div className="text-xs font-semibold text-slate-400">{learner.email}</div>
                </div>
                <BarChart3 className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}