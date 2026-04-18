import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Play,
  LayoutGrid,
  Calendar,
  ChevronRight,
  Flame,
  Dumbbell,
  ClipboardList
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { usePlanStore } from '../store/usePlanStore';
import { useProgressStore } from '../store/useProgressStore';
import { Button } from '../components/common/Inputs';
import { Loading } from '../components/common/Loading';

export const Dashboard = () => {
  const { user } = useAuthStore();
  const { plans, isLoading, fetchPlans } = usePlanStore();
  const { streak, fetchStreak } = useProgressStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
    fetchStreak();
  }, [fetchPlans, fetchStreak]);

  if (isLoading && plans.length === 0) return <Loading />;

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome, {user?.full_name?.split(' ')[0]}! 👋</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Ready for your next workout session?</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate('/templates')}>
            <LayoutGrid className="w-4 h-4" />
            Browse Templates
          </Button>
          <Button onClick={() => navigate('/plans')}>
            <Plus className="w-4 h-4" />
            Create Plan
          </Button>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6 flex items-center gap-4">
          <div className="bg-accent-100 p-3 rounded-2xl text-accent-600">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Day Streak</p>
            <p className="text-2xl font-bold dark:text-white">{streak} {streak === 1 ? 'Day' : 'Days'}</p>
          </div>
        </div>
        <div className="card p-6 flex items-center gap-4">
          <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Active Plans</p>
            <p className="text-2xl font-bold dark:text-white">{plans.length}</p>
          </div>
        </div>
      </div>

      {/* Continue Last Workout */}
      {plans.length > 0 && (
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Quick Start</h2>
            <button className="text-primary-600 dark:text-primary-400 font-semibold text-sm flex items-center hover:underline" onClick={() => navigate('/plans')}>
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group border border-slate-800">
            <div className="absolute top-0 right-0 p-8 h-full flex items-center">
              <Play className="w-24 h-24 text-white/5 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="relative z-10 max-w-lg">
              <span className="bg-primary-600 text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full">Recommended</span>
              <h3 className="text-2xl font-bold mt-4 mb-2">{plans[0].title}</h3>
              {plans[0].description && <p className="text-slate-400 mb-6 italic">"{plans[0].description}"</p>}
              <Button
                onClick={() => navigate(`/execute/${plans[0].id}`)}
                className="bg-white text-slate-900 hover:bg-slate-100 border-none shadow-none mt-2"
              >
                Start Workout Mode
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Recent Plans */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Your Recent Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.slice(0, 3).map((plan) => (
            <div
              key={plan.id}
              className="card group cursor-pointer"
              onClick={() => navigate(`/plans/${plan.id}`)}
            >
              <div className="h-48 bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative">
                <Dumbbell className="w-12 h-12 text-slate-300 dark:text-slate-700 group-hover:text-primary-400 group-hover:scale-110 transition-all duration-300" />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-tight">
                  {plan.difficulty}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-1 dark:text-white truncate">{plan.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{plan.days_count} Training Days</p>
                <div className="flex gap-2">
                  <Button 
                    variant="secondary" 
                    className="flex-1 text-xs py-2 h-9 bg-slate-50 dark:bg-slate-800 border-none"
                    onClick={(e) => { e.stopPropagation(); navigate(`/plans/${plan.id}`); }}
                  >
                    Details
                  </Button>
                  <Button 
                    className="flex-1 text-xs py-2 h-9"
                    onClick={(e) => { e.stopPropagation(); navigate(`/execute/${plan.id}`); }}
                  >
                    Start
                  </Button>
                </div>

              </div>
            </div>
          ))}
          {plans.length === 0 && (
            <div className="col-span-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 flex flex-col items-center text-center bg-slate-50/50 dark:bg-slate-900/20">
              <div className="bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <ClipboardList className="w-8 h-8 text-slate-300 dark:text-slate-600" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 mb-6 italic">You haven't created any workout plans yet.</p>
              <Button onClick={() => navigate('/plans')}>
                Create Your First Plan
              </Button>
            </div>
          )}

        </div>
      </section>
    </div>
  );
};

