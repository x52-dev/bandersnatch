import React, { useState } from 'react';
import { Plus, Trash2, Clock, HelpCircle } from 'lucide-react';

export default function QuestionnaireBuilder({ questions, onChange }) {
  const [newQuestion, setNewQuestion] = useState({
    timestamp: 0,
    type: 'SINGLE_CHOICE',
    text: '',
    options: ''
  });

  const handleAdd = () => {
    if (!newQuestion.text.trim()) return;
    
    const formattedQuestion = {
      timestamp: Number(newQuestion.timestamp),
      type: newQuestion.type,
      text: newQuestion.text,
      options: newQuestion.type !== 'SHORT_ANSWER' ? newQuestion.options.split(',').map(s => s.trim()) : []
    };

    onChange([...questions, formattedQuestion]);
    
    // Reset local form
    setNewQuestion({ timestamp: 0, type: 'SINGLE_CHOICE', text: '', options: '' });
  };

  const handleRemove = (indexToRemove) => {
    onChange(questions.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-indigo-500" />
          Interactive Checkpoints
        </h3>
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
          {questions.length} Active
        </span>
      </div>

      {/* List of Current Questions */}
      {questions.length > 0 && (
        <div className="space-y-2 mb-4">
          {questions.map((q, idx) => (
            <div key={idx} className="flex items-start justify-between p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-slate-900 text-white px-2 py-0.5 rounded-md text-xs font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {q.timestamp}s
                  </span>
                  <span className="text-xs font-bold text-slate-400">{q.type.replace('_', ' ')}</span>
                </div>
                <p className="text-sm font-medium text-slate-700">{q.text}</p>
              </div>
              <button type="button" onClick={() => handleRemove(idx)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Question Form */}
      <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Pause at (Seconds)</label>
            <input 
              type="number" min="0" 
              value={newQuestion.timestamp} 
              onChange={e => setNewQuestion({...newQuestion, timestamp: e.target.value})}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500" 
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-500 mb-1">Question Type</label>
            <select 
              value={newQuestion.type} 
              onChange={e => setNewQuestion({...newQuestion, type: e.target.value})}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500"
            >
              <option value="SINGLE_CHOICE">Single Choice</option>
              <option value="MULTI_CHOICE">Multiple Choice</option>
              <option value="SHORT_ANSWER">Short Answer (Text)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1">Question Text</label>
          <input 
            type="text" 
            value={newQuestion.text} 
            onChange={e => setNewQuestion({...newQuestion, text: e.target.value})}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500" 
            placeholder="e.g., What does this function return?" 
          />
        </div>

        {newQuestion.type !== 'SHORT_ANSWER' && (
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Options (Comma separated)</label>
            <input 
              type="text" 
              value={newQuestion.options} 
              onChange={e => setNewQuestion({...newQuestion, options: e.target.value})}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500" 
              placeholder="Option 1, Option 2, Option 3" 
            />
          </div>
        )}

        <button 
          type="button" 
          onClick={handleAdd}
          disabled={!newQuestion.text.trim()}
          className="w-full flex items-center justify-center gap-2 py-2 bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-semibold rounded-lg text-sm transition-colors disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> Add Checkpoint
        </button>
      </div>
    </div>
  );
}