import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Copy, 
  Trash2, 
  Calendar,
  Layers,
  BarChart2
} from 'lucide-react';
import { usePlanStore } from '../store/usePlanStore';
import { Button, Input } from '../components/common/Inputs';
import { Loading } from '../components/common/Loading';
import type { Difficulty } from '../types';

export const Plans = () => {
  const { plans, isLoading, fetchPlans, deletePlan, duplicatePlan, createPlan } = usePlanStore();
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'All'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const filteredPlans = plans.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesDiff = difficultyFilter === 'All' || p.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
    return matchesSearch && matchesDiff;
  });

  const handleCreatePlan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await createPlan({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      difficulty: formData.get('difficulty') as Difficulty,
      days_count: parseInt(formData.get('days_count') as string) || 0,
    });
    setIsModalOpen(false);
  };

  if (isLoading && plans.length === 0) return <Loading />;

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Workout Plans</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and track your personalized workout routines</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-5 h-5" />
          New Plan
        </Button>
      </header>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search plans..."
            className="w-full pl-12 pr-4 py-3 bg-transparent outline-none text-slate-700 dark:text-slate-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 px-2">
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficultyFilter(diff as Difficulty | 'All')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                difficultyFilter === diff
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <div key={plan.id} className="card group flex flex-col h-full">
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  plan.difficulty.toLowerCase() === 'beginner' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                  plan.difficulty.toLowerCase() === 'intermediate' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' :
                  'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                }`}>
                  {plan.difficulty}
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { e.stopPropagation(); duplicatePlan(plan.id); }}
                    className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); if(confirm('Delete this plan?')) deletePlan(plan.id); }}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{plan.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-6 h-10">{plan.description}</p>
              
              <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-medium">{plan.days_count} Days</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <BarChart2 className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">{plan.difficulty}</span>
                </div>

              </div>
            </div>
            
            <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-50 dark:border-slate-800 flex gap-2">
              <Button 
                variant="secondary" 
                className="flex-1 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                onClick={() => navigate(`/plans/${plan.id}`)}
              >
                View
              </Button>
              <Button 
                className="flex-1 px-2"
                onClick={() => navigate(`/execute/${plan.id}`)}
              >
                Start
              </Button>
            </div>

          </div>
        ))}

        {filteredPlans.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <Layers className="w-16 h-16 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-400 dark:text-slate-500">No plans found</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 italic">Try a different search or create a new plan</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-slide-up border dark:border-slate-800">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Create New Plan</h2>
            <form onSubmit={handleCreatePlan} className="space-y-5">
              <Input name="title" label="Plan Title" placeholder="e.g. 5-Day Hypertrophy Split" required />
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                <textarea 
                  name="description" 
                  className="input-field min-h-[100px] py-3 dark:bg-slate-800 dark:border-slate-700 dark:text-white" 
                  placeholder="What's the goal of this plan?"
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Difficulty</label>
                  <select name="difficulty" className="input-field dark:bg-slate-800 dark:border-slate-700 dark:text-white text-slate-900">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <Input name="days_count" label="Total Days" type="number" placeholder="7" defaultValue="7" required />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Create Plan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
