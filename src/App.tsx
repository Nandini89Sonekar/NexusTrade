import React, { useState } from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import { LearningProvider } from './components/LearningContext';
import { Dashboard } from './components/Dashboard';
import { MissionGuide } from './components/MissionGuide';
import { LogIn, ShieldCheck, Globe, Mail, Lock, UserPlus, AlertCircle } from 'lucide-react';
import { cn } from './lib/utils';

function AppContent() {
  const { user, loading, login, signup, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    try {
      if (isSignUp) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
    } catch (error: any) {
      setAuthError(error.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950 text-white">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]"></div>

        <div className="w-full max-w-md space-y-8 relative z-10">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3" />
              Secure Trading Environment
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter">
              NEXUS<span className="text-blue-500">TRADE</span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              The next-generation workspace for professional traders. 
              Real-time analytics, modular dashboards, and paper trading simulation.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl backdrop-blur-xl shadow-2xl space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {authError && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-[10px]">
                  <AlertCircle className="w-3 h-3" />
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-500 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {authLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    {isSignUp ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </>
                )}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-slate-900 px-2 text-slate-500">Or continue with</span></div>
            </div>

            <button
              onClick={signIn}
              className="w-full flex items-center justify-center gap-3 bg-white text-slate-950 py-3 rounded-xl font-bold hover:bg-slate-100 transition-all active:scale-[0.98]"
            >
              <Globe className="w-4 h-4" />
              Google Authentication
            </button>

            <div className="text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[10px] font-bold text-blue-500 hover:text-blue-400 uppercase tracking-widest"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
              </button>
            </div>
            
            <div className="pt-4 flex items-center justify-center gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Global Markets</span>
              <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Encrypted</span>
            </div>
          </div>

          <p className="text-center text-[10px] text-slate-600 uppercase tracking-widest">
            By continuing, you agree to our terms of service
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Dashboard />
      <MissionGuide />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LearningProvider>
        <AppContent />
      </LearningProvider>
    </AuthProvider>
  );
}
