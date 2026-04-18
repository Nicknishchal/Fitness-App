import { useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { useProgressStore } from '../store/useProgressStore';
import { usePlanStore } from '../store/usePlanStore';
import { Loading } from '../components/common/Loading';
import type { Progress } from '../types';

export const SessionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { history } = useProgressStore();
  const { fetchPlanById, currentPlan } = usePlanStore();
  const sessionExercises = useMemo(() => {
    // Priority 1: Use passed state from history page
    if (location.state?.sessionExercises) {
      return location.state.sessionExercises as Progress[];
    }
    // Fallback: Find records with same plan_id and roughly same time
    const baseRecord = history.find(h => h.id === id);
    if (baseRecord) {
      const time = new Date(baseRecord.completed_at).getTime();
      return history.filter(h => 
        h.plan_id === baseRecord.plan_id && 
        Math.abs(new Date(h.completed_at).getTime() - time) < 5 * 60 * 1000
      );
    }
    return [];
  }, [id, history, location.state]);

  useEffect(() => {
    if (sessionExercises.length > 0) {
      fetchPlanById(sessionExercises[0].plan_id);
    }
  }, [sessionExercises, fetchPlanById]);

  if (sessionExercises.length === 0 || !currentPlan) return <Loading />;

  const firstRecord = sessionExercises[0];

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <button 
        onClick={() => navigate('/history')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        Back to History
      </button>

      {/* Hero Session Header */}
      <div className="bg-slate-900 rounded-3xl p-8 border border-white/10 shadow-2xl overflow-hidden relative text-white">
        <div className="absolute top-0 right-0 p-8 h-full flex items-center opacity-10 pointer-events-none">
          <Trophy className="w-48 h-48" />
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              Session Summary
            </span>
            <span className="bg-white/10 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur">
              {currentPlan.title}
            </span>
            <span className="bg-white/10 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur">
              {sessionExercises.length} Exercises
            </span>
          </div>
          
          <h1 className="text-4xl font-black mb-3">Workout Session</h1>
          <div className="flex flex-col md:flex-row md:items-center gap-4 text-slate-400">
            <p className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(firstRecord.completed_at).toLocaleString(undefined, {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-700"></span>
            <p className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {firstRecord.time_taken || 0} Minutes Duration
            </p>
          </div>
        </div>
      </div>

      {/* Exercises List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Exercises Performed</h2>
        <div className="grid grid-cols-1 gap-6">
          {sessionExercises.map((record) => {
            const day = currentPlan.days.find(d => d.id === record.day_id);
            const exercise = day?.exercises.find(e => e.id === record.exercise_id);
            
            return (
              <div key={record.id} className="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary-500/30 transition-all group">
                <div className="flex items-center gap-6">
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 w-12 h-12 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">
                      {exercise?.name || 'Unknown Exercise'}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 italic line-clamp-1">{exercise?.description || 'Standard performance'}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-0.5">Volume</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{exercise?.sets || 0} Sets × {exercise?.reps || '-'}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-0.5">Rest Interval</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{exercise?.rest_time || 0}s Rest</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-8 bg-primary-600 rounded-3xl text-white flex items-center justify-between shadow-2xl shadow-primary-500/40">
        <div>
          <h3 className="text-xl font-black mb-1">Consistency Check</h3>
          <p className="text-primary-100 opacity-80">You've successfully tracked all movements in this session.</p>
        </div>
        <Trophy className="w-12 h-12 text-primary-200" />
      </div>
    </div>
  );
};

const Trophy = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
);

