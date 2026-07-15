import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Loader2, CheckCircle2, XCircle, Clock, Check } from 'lucide-react';
import { learnerVideoService } from '../../services/videoService';

const formatTime = (sec) => {
  if (isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export default function WatchRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [resumeTime, setResumeTime] = useState(0);
  const [hasRestoredTime, setHasRestoredTime] = useState(false);
  
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [answeredTimestamps, setAnsweredTimestamps] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(15);
  
  // SDE II FIX: Array to track multiple selected options
  const [selectedOptions, setSelectedOptions] = useState([]);
  
  const [feedback, setFeedback] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    learnerVideoService.getVideo(id).then(res => {
      const videoData = res.data.video || res.data;
      const progressData = res.data.progress || null;

      const sortedVideo = {
        ...videoData,
        questions: videoData.questions?.sort((a, b) => a.timestamp - b.timestamp) || []
      };
      setVideo(sortedVideo);

      if (progressData && progressData.lastWatchedTimestamp > 0) {
        setResumeTime(progressData.lastWatchedTimestamp);
      } else {
        setHasRestoredTime(true);
      }
      setLoading(false);
    }).catch(err => {
      console.error("Failed to load video data:", err);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || hasRestoredTime || resumeTime === 0) return;

    const executeResume = () => {
      videoEl.currentTime = resumeTime;
      setHasRestoredTime(true);
    };

    if (videoEl.readyState >= 1) {
      executeResume();
    } else {
      videoEl.addEventListener('loadedmetadata', executeResume);
      return () => videoEl.removeEventListener('loadedmetadata', executeResume);
    }
  }, [video, resumeTime, hasRestoredTime]);

  useEffect(() => {
    const syncInterval = setInterval(() => {
      if (isPlaying && videoRef.current && hasRestoredTime) {
        learnerVideoService.saveProgress(id, videoRef.current.currentTime, videoRef.current.duration)
          .catch(err => console.warn("Background telemetry sync failed:", err));
      }
    }, 5000);
    return () => clearInterval(syncInterval);
  }, [isPlaying, id, hasRestoredTime]);

  useEffect(() => {
    let timer;
    if (activeQuestion && !feedback && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && !feedback) {
      handleTimeUp();
    }
    return () => clearInterval(timer);
  }, [activeQuestion, timeLeft, feedback]);

  const handleTimeUpdate = () => {
    if (!video || activeQuestion || !videoRef.current) return;
    
    const current = videoRef.current.currentTime;
    setCurrentTime(current); 
    
    const currentSecond = Math.floor(current);
    const upcomingQuestion = video.questions.find(q => 
      q.timestamp === currentSecond && !answeredTimestamps.has(q.timestamp)
    );

    if (upcomingQuestion) {
      videoRef.current.pause();
      setIsPlaying(false);
      setActiveQuestion(upcomingQuestion);
      setTimeLeft(15);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const togglePlay = () => {
    if (activeQuestion || !videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(err => console.warn("Browser blocked playback:", err));
    } else {
      videoRef.current.pause();
    }
  };

  const resumeVideo = () => {
    setActiveQuestion(null);
    setFeedback(null);
    setSelectedOptions([]); // Reset selections for the next question
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(err => console.warn("Browser blocked resume:", err));
      }
    }, 150);
  };

  // NEW: Toggle function for selecting multiple options
  const handleToggleOption = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(prev => prev.filter(o => o !== option));
    } else {
      setSelectedOptions(prev => [...prev, option]);
    }
  };

  // NEW: Submit function sends the array
  const handleSubmitAnswers = async () => {
    if (selectedOptions.length === 0) return;
    setIsChecking(true);
    try {
      const res = await learnerVideoService.checkAnswer(video._id, activeQuestion.timestamp, selectedOptions);
      setFeedback(res.data);
      setAnsweredTimestamps(prev => new Set(prev).add(activeQuestion.timestamp));
      setTimeout(() => resumeVideo(), 4000);
    } catch (err) {
      console.error("Failed to check answer:", err);
    } finally {
      setIsChecking(false);
    }
  };

  const handleTimeUp = () => {
    setFeedback({ isCorrect: false, correctAnswers: ["Time expired!"], message: "You ran out of time." });
    setAnsweredTimestamps(prev => new Set(prev).add(activeQuestion.timestamp));
    setTimeout(() => resumeVideo(), 4000);
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      <div className="h-16 px-6 flex items-center gap-4 bg-slate-900 border-b border-slate-800">
        <button onClick={() => navigate('/learner')} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-sm font-bold text-white">{video?.title}</h1>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 relative">
        <div className="relative w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800 group">
          
          <video 
            ref={videoRef}
            src={video?.videoUrl}
            poster={video?.thumbnailUrl || "https://placehold.co/1280x720/0f172a/ffffff?text=Loading+Module..."}
            className="w-full h-full object-contain cursor-pointer"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onClick={togglePlay}
            controls={false} 
          />

          {!activeQuestion && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent px-6 pt-16 pb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="relative w-full h-1.5 bg-slate-700/50 rounded-full mb-4 group/slider">
                <div className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full transition-all duration-100" style={{ width: `${progressPercentage}%` }}>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white rounded-full shadow shadow-black/50 opacity-0 group-hover/slider:opacity-100 transition-opacity" />
                </div>
                {video?.questions?.map((q, idx) => (
                  <div 
                    key={idx} 
                    className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-black shadow-sm ${answeredTimestamps.has(q.timestamp) ? 'bg-emerald-400' : 'bg-amber-400'}`} 
                    style={{ left: `${(q.timestamp / duration) * 100}%` }}
                    title={`Checkpoint at ${formatTime(q.timestamp)}`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-4 text-white">
                <button onClick={togglePlay} className="hover:text-indigo-400 transition-colors focus:outline-none">
                  {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                </button>
                <div className="text-sm font-medium font-mono text-slate-300">
                  <span className="text-white">{formatTime(currentTime)}</span> / {formatTime(duration)}
                </div>
              </div>
            </div>
          )}

          {!isPlaying && !activeQuestion && currentTime === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-slate-950/20">
              <div className="w-20 h-20 bg-indigo-600/90 rounded-full flex items-center justify-center backdrop-blur-md shadow-[0_0_40px_rgba(79,70,229,0.4)]">
                <Play className="w-10 h-10 text-white ml-2" />
              </div>
            </div>
          )}

          {activeQuestion && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 z-50 animate-in fade-in duration-300">
              {!feedback ? (
                <div className="max-w-xl w-full bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl transform transition-all">
                  <div className="flex items-center justify-between mb-6">
                    <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Checkpoint</span>
                    <div className={`flex items-center gap-2 text-sm font-bold ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-slate-400'}`}>
                      <Clock className="w-4 h-4" /> 00:{timeLeft.toString().padStart(2, '0')}
                    </div>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">{activeQuestion.text}</h2>
                  
                  {/* SDE II FIX: Render Multi-Select Options */}
                  <div className="space-y-3 mb-6">
                    {activeQuestion.options.map((option, idx) => {
                      const isSelected = selectedOptions.includes(option);
                      return (
                        <button
                          key={idx} 
                          onClick={() => handleToggleOption(option)} 
                          disabled={isChecking}
                          className={`w-full text-left px-6 py-4 rounded-xl border transition-all flex items-center justify-between group disabled:opacity-50 ${
                            isSelected 
                            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' 
                            : 'bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-indigo-400 text-slate-200'
                          }`}
                        >
                          <span className="font-medium">{option}</span>
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500'}`}>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* SDE II FIX: Dedicated Submit Button */}
                  <button
                    onClick={handleSubmitAnswers}
                    disabled={selectedOptions.length === 0 || isChecking}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition-all active:scale-[0.98] shadow-md"
                  >
                    {isChecking ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Answer'}
                  </button>

                </div>
              ) : (
                <div className={`max-w-md w-full border rounded-3xl p-6 sm:p-8 shadow-2xl transform transition-all text-center animate-in zoom-in-95 ${feedback.isCorrect ? 'bg-emerald-950/50 border-emerald-900/50' : 'bg-red-950/50 border-red-900/50'}`}>
                  <div className="flex justify-center mb-6">
                    {feedback.isCorrect ? (
                      <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center"><CheckCircle2 className="w-10 h-10 text-emerald-500" /></div>
                    ) : (
                      <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center"><XCircle className="w-10 h-10 text-red-500" /></div>
                    )}
                  </div>
                  <h2 className={`text-2xl sm:text-3xl font-bold mb-3 ${feedback.isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>{feedback.message}</h2>
                  {!feedback.isCorrect && (
                    <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 mt-6">
                      <p className="text-xs text-slate-400 font-bold uppercase mb-1">Correct Answer:</p>
                      <p className="text-slate-200 font-medium">{feedback.correctAnswers.join(' & ')}</p>
                    </div>
                  )}
                  <p className="text-slate-500 text-sm mt-8 animate-pulse">Resuming video shortly...</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}