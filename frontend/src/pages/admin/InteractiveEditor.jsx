import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Play, Pause, Upload, HelpCircle, CheckCircle2, Loader2, Trash2, Clock } from 'lucide-react';
import api from '../../services/api';
import Modal from '../../components/ui/Modal';

export default function InteractiveEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // This ref is now properly attached to the hidden input below
  const fileInputRef = useRef(null);
  
  const [video, setVideo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const videoRef = useRef(null);
  const timelineRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverPosition, setHoverPosition] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetTimestamp, setTargetTimestamp] = useState(0);
  const [newQuestion, setNewQuestion] = useState({ type: 'SINGLE_CHOICE', text: '', options: '', correctAnswers: '' });

  useEffect(() => {
    api.get(`/admin/videos/${id}`).then(res => {
      setVideo(res.data);
      setQuestions(res.data.questions || []);
      setLoading(false);
    });
  }, [id]);

  const togglePlay = () => {
    if (videoRef.current.paused) { videoRef.current.play(); setIsPlaying(true); } 
    else { videoRef.current.pause(); setIsPlaying(false); }
  };

  const handleTimelineMouseMove = (e) => {
    if (!timelineRef.current || duration === 0) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const percent = Math.min(Math.max(0, e.clientX - rect.left), rect.width) / rect.width;
    setHoverPosition(percent * 100);
    setHoverTime(Math.floor(percent * duration));
  };

  const handleTimelineClick = () => {
    if (hoverTime !== null) {
      videoRef.current.pause(); setIsPlaying(false);
      videoRef.current.currentTime = hoverTime;
      setTargetTimestamp(hoverTime);
      setIsModalOpen(true);
    }
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    const formattedQuestion = {
      timestamp: targetTimestamp, type: newQuestion.type, text: newQuestion.text,
      options: newQuestion.type !== 'SHORT_ANSWER' ? newQuestion.options.split(',').map(s => s.trim()) : [],
      correctAnswers: newQuestion.type !== 'SHORT_ANSWER' ? newQuestion.correctAnswers.split(',').map(s => s.trim()) : []
    };
    setQuestions([...questions, formattedQuestion].sort((a, b) => a.timestamp - b.timestamp));
    setIsModalOpen(false);
    setNewQuestion({ type: 'SINGLE_CHOICE', text: '', options: '', correctAnswers: '' });
  };

const handleImportJson = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (Array.isArray(importedData)) {
          // SAFEGUARD: Automatically add a type if the JSON is missing it
          const sanitizedData = importedData.map(q => ({
            ...q,
            type: q.type || (q.correctAnswers?.length > 1 ? 'MULTI_CHOICE' : 'SINGLE_CHOICE')
          }));
          
          setQuestions([...questions, ...sanitizedData].sort((a, b) => a.timestamp - b.timestamp));
        }
      } catch (err) { 
        alert("Invalid JSON format."); 
      }
    };
    reader.readAsText(file);
    e.target.value = null; 
  };

  const saveToDatabase = async () => {
    setIsSaving(true);
    try { 
      await api.put(`/admin/videos/${id}`, { questions }); 
      alert("Saved successfully!"); 
    } finally { 
      setIsSaving(false); 
    }
  };

  const formatTime = (sec) => `${Math.floor(sec / 60)}:${Math.floor(sec % 60).toString().padStart(2, '0')}`;

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Header Bar */}
      <div className="h-16 border-b border-slate-800 bg-slate-900 px-6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin')} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></button>
          <div><h1 className="text-sm font-bold text-white">{video?.title}</h1><p className="text-xs text-slate-400">Interactive Timeline Editor</p></div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Cleaned up the duplicate buttons and attached the ref */}
          <input 
            type="file" 
            accept=".json" 
            onChange={handleImportJson} 
            ref={fileInputRef}
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg flex items-center gap-2 border border-slate-700 transition-colors"
          >
            <Upload className="w-4 h-4" /> Import JSON
          </button>
          
          <button onClick={saveToDatabase} disabled={isSaving} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg flex items-center gap-2 shadow-lg disabled:opacity-50 transition-all active:scale-[0.98]">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Timeline
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Video & Timeline */}
        <div className="flex-1 flex flex-col p-6 overflow-y-auto">
          <div className="w-full max-w-5xl mx-auto space-y-6">
            
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800 group cursor-pointer" onClick={togglePlay}>
              <video 
                ref={videoRef} 
                src={video?.videoUrl} 
                className="w-full h-full object-contain" 
                onTimeUpdate={() => setCurrentTime(videoRef.current.currentTime)} 
                onLoadedMetadata={() => setDuration(videoRef.current.duration)} 
                controls={false} 
              />
              {!isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 bg-indigo-600/90 rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <button onClick={togglePlay} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-white transition-colors">
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <div className="text-sm font-mono text-slate-400">{formatTime(currentTime)} / {formatTime(duration)}</div>
              </div>
              
              <div ref={timelineRef} className="relative w-full h-8 flex items-center group cursor-pointer" onMouseMove={handleTimelineMouseMove} onMouseLeave={() => setHoverTime(null)} onClick={handleTimelineClick}>
                <div className="absolute w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full pointer-events-none" style={{ width: `${(currentTime / duration) * 100}%` }} />
                </div>
                
                {questions.map((q, idx) => (
                  <div 
                    key={idx} 
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-amber-400 rounded border-2 border-slate-900 pointer-events-none shadow-sm z-10 rotate-45" 
                    style={{ left: `calc(${(q.timestamp / duration) * 100}% - 8px)` }} 
                  />
                ))}
                
                {hoverTime !== null && (
                  <div className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-20" style={{ left: `${hoverPosition}%` }}>
                    <div className="absolute bottom-6 mb-2 px-3 py-1.5 bg-white text-slate-900 text-xs font-bold rounded-lg shadow-xl whitespace-nowrap transform -translate-x-1/2 flex items-center gap-1.5">
                      <Plus className="w-3 h-3 text-indigo-600" /> Add at {formatTime(hoverTime)}
                    </div>
                    <div className="w-6 h-6 bg-indigo-500 rounded-full border-4 border-slate-900 shadow-[0_0_15px_rgba(99,102,241,0.6)] transform -translate-x-1/2 flex items-center justify-center">
                      <Plus className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Questions Sidebar */}
        <div className="w-96 bg-slate-900 border-l border-slate-800 flex flex-col flex-shrink-0">
          <div className="p-5 border-b border-slate-800 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-400" />
            <h2 className="font-bold text-white">Timeline Checkpoints</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {questions.length === 0 ? (
              <div className="text-center p-8 border-2 border-dashed border-slate-800 rounded-xl text-slate-500 text-sm">
                Hover over timeline to add questions.
              </div>
            ) : (
              questions.map((q, idx) => (
                <div key={idx} className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl group hover:border-slate-600 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <span className="bg-slate-950 text-indigo-400 px-2 py-0.5 rounded text-xs font-mono font-bold">
                      <Clock className="w-3 h-3 inline mr-1" />{formatTime(q.timestamp)}
                    </span>
                    <button onClick={() => setQuestions(questions.filter((_, i) => i !== idx))} className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-slate-200 font-medium mb-1">{q.text}</p>
                  <p className="text-xs text-slate-500 uppercase font-bold">
  {(q.type || 'SINGLE_CHOICE').replace('_', ' ')}
</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Checkpoint Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Add Checkpoint at ${formatTime(targetTimestamp)}`} icon={Plus}>
        <form onSubmit={handleAddQuestion} className="p-6 space-y-5 text-slate-900">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Question Type</label>
            <select value={newQuestion.type} onChange={e => setNewQuestion({...newQuestion, type: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all">
              <option value="SINGLE_CHOICE">Single Choice</option>
              <option value="MULTI_CHOICE">Multiple Choice</option>
              <option value="SHORT_ANSWER">Short Answer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Question Text</label>
            <input type="text" required value={newQuestion.text} onChange={e => setNewQuestion({...newQuestion, text: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all" placeholder="Enter question..." />
          </div>
          {newQuestion.type !== 'SHORT_ANSWER' && (
            <>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Options (Comma separated)</label>
                <input type="text" required value={newQuestion.options} onChange={e => setNewQuestion({...newQuestion, options: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all" placeholder="Option 1, Option 2, Option 3" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Correct Answer(s)</label>
                <input type="text" required value={newQuestion.correctAnswers} onChange={e => setNewQuestion({...newQuestion, correctAnswers: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all" placeholder="Option 1" />
              </div>
            </>
          )}
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center gap-2 transition-all active:scale-[0.98]">
              <CheckCircle2 className="w-4 h-4" /> Add
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}