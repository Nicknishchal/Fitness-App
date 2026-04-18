import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Calendar, ChevronRight, ClipboardList } from 'lucide-react';
import { useProgressStore } from '../store/useProgressStore';
import { Loading } from '../components/common/Loading';
import { Button } from '../components/common/Inputs';
import type { Progress } from '../types';

interface GroupedSession extends Progress {
  exercises: Progress[];
}

export const History = () => {
  const navigate = useNavigate();
  const { history, isLoading, fetchHistory } = useProgressStore();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  if (isLoading && history.length === 0) return <Loading />;

  // Grouping history by session (plan_id + roughly same time)
  const sessions = history.reduce((acc: GroupedSession[], current) => {
    const time = new Date(current.completed_at).getTime();
    // Find a session that matches plan and is within 5 minutes
    const existingSession = acc.find(s => 
      s.plan_id === current.plan_id && 
      Math.abs(new Date(s.completed_at).getTime() - time) < 5 * 60 * 1000
    );

    if (existingSession) {
      existingSession.exercises.push(current);
    } else {
      acc.push({
        ...current,
        exercises: [current]
      });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Workout History</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Consistency is key. Review your journey below.</p>
      </header>

      <div className="space-y-4">
        {sessions.map((session) => (
          <div 
            key={session.id} 
            onClick={() => navigate(`/history/${session.id}`, { state: { sessionExercises: session.exercises } })}
            className="card p-6 flex items-center justify-between group cursor-pointer hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-6">
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl text-slate-400 dark:text-slate-500 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                <Dumbbell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">
                  Workout Session
                </h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-4 h-4" /> 
                    {new Date(session.completed_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                  <span className="bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                    {session.exercises.length} Exercises
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                  <span className="text-slate-500">{session.time_taken || 0} min</span>
                </div>
              </div>
            </div>
            <button className="p-2 text-slate-300 group-hover:text-primary-500 transition-colors">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        ))}


        
        {history.length === 0 && (
          <div className="py-20 flex flex-col items-center text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/10">
            <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <ClipboardList className="w-8 h-8 text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 italic mb-6">No history yet. Start your first workout to see progress!</p>
            <Button onClick={() => navigate('/plans')}>Browse Plans</Button>
          </div>
        )}

      </div>
    </div>
  );
};

