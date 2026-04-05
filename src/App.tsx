import React from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import { LearningProvider } from './components/LearningContext';
import { Dashboard } from './components/Dashboard';
import { MissionGuide } from './components/MissionGuide';
import { LogIn, ShieldCheck, Globe } from 'lucide-react';

function AppContent() {
  const { user, loading, signIn } = useAuth();

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

          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl backdrop-blur-xl shadow-2xl">
            <button
              onClick={signIn}
              className="w-full flex items-center justify-center gap-3 bg-white text-slate-950 py-4 rounded-xl font-bold hover:bg-slate-100 transition-all active:scale-[0.98]"
            >
              <LogIn className="w-5 h-5" />
              Continue with Google
            </button>
            
            <div className="mt-6 flex items-center justify-center gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
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
