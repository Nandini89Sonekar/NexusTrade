import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLearning } from './LearningContext';
import { CheckCircle, ArrowRight, X } from 'lucide-react';
import { cn } from '../lib/utils';

export function MissionGuide() {
  const { mode, missions, currentMissionIndex, setMode } = useLearning();
  const currentMission = missions[currentMissionIndex];

  if (mode !== 'guided') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        className="fixed bottom-8 right-8 z-[100] w-80 bg-slate-900 border border-blue-500/50 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
      >
        <div className="bg-blue-600/10 p-4 border-b border-blue-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Guided Mission</span>
          </div>
          <button 
            onClick={() => setMode('none')}
            className="p-1 hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white mb-1">{currentMission.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{currentMission.description}</p>
          </div>

          <div className="space-y-2">
            {missions.map((mission, idx) => (
              <div 
                key={mission.id}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg transition-all",
                  idx === currentMissionIndex ? "bg-blue-600/20 border border-blue-500/30" : "opacity-50"
                )}
              >
                {mission.completed ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center text-[10px] font-bold",
                    idx === currentMissionIndex ? "border-blue-500 text-blue-500" : "border-slate-700 text-slate-700"
                  )}>
                    {idx + 1}
                  </div>
                )}
                <span className={cn(
                  "text-[10px] font-bold",
                  idx === currentMissionIndex ? "text-blue-400" : "text-slate-500"
                )}>
                  {mission.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-950/50 border-t border-slate-800">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>PROGRESS</span>
            <span>{Math.round(((currentMissionIndex) / missions.length) * 100)}%</span>
          </div>
          <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentMissionIndex) / missions.length) * 100}%` }}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
