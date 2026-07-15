import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './services/api'; // Enterprise API interceptor
import { Mail, Lock, User, ArrowRight, PlayCircle, Sparkles, Loader2, Shield } from 'lucide-react';

export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'LEARNER' });
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin ? { email: formData.email, password: formData.password } : formData;
      
      const response = await api.post(endpoint, payload);
      
      if (isLogin) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('role', response.data.role);
        
        // Route based on role
        if (response.data.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/learner');
        }
      } else {
        setIsLogin(true); // Switch to login view after successful registration
        setFormData({ ...formData, password: '' }); // Clear password for security
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Left Side - The Premium Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 bg-white relative z-10 shadow-[10px_0_30px_rgba(0,0,0,0.03)] transition-all duration-500">
        <div className="max-w-md w-full mx-auto">
          
          {/* Brand */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <PlayCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Lumina<span className="text-indigo-600">Learn</span>
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 mb-2 transition-all">
            {isLogin ? 'Welcome back' : 'Start your journey'}
          </h1>
          <p className="text-slate-500 mb-8 font-medium">
            {isLogin ? 'Enter your details to access your workspace.' : 'Create an account to build interactive experiences.'}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50/50 border border-red-100 rounded-xl text-sm font-medium text-red-600 flex items-start gap-3">
              <Shield className="w-5 h-5 flex-shrink-0 text-red-500" />
              {Array.isArray(error) ? error.join(', ') : error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Conditional Full Name Field (Only on Signup) */}
            {!isLogin && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            {/* Conditional Role Selection (Only on Signup) */}
            {!isLogin && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300 pt-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Select your role</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'LEARNER' })}
                    className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all ${
                      formData.role === 'LEARNER' 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600' 
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                    }`}
                  >
                    Learner
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'ADMIN' })}
                    className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all ${
                      formData.role === 'ADMIN' 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600' 
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                    }`}
                  >
                    Administrator
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-indigo-600/25 active:scale-[0.98] mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-8 text-center text-sm font-medium text-slate-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ ...formData, password: '' });
              }} 
              className="text-indigo-600 hover:text-indigo-700 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-600/20 rounded px-1"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Premium Visuals (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-slate-900 items-center justify-center">
        <div className="absolute top-0 -left-1/4 w-full h-full bg-gradient-to-br from-indigo-600/30 to-transparent rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-0 -right-1/4 w-full h-full bg-gradient-to-tl from-purple-600/30 to-transparent rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
        
        <div className="relative z-10 max-w-lg p-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/90 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 text-amber-300" />
            Interactive Video Learning
          </div>
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Build smarter logic into your video content.
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            Pause standard playback. Inject dynamic quizzes. Track user metrics natively.
          </p>
        </div>
      </div>
    </div>
  );
}