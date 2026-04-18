import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Plus,
  ChevronLeft,
  Trash2,
  Edit3,
  ChevronDown,
  ChevronUp,
  Video,
  Clock,
  Hash,
  Dumbbell
} from 'lucide-react';
import { usePlanStore } from '../store/usePlanStore';
import { Button, Input } from '../components/common/Inputs';
import { Loading } from '../components/common/Loading';
import type { Exercise } from '../types';

export const PlanDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentPlan,
    isLoading,
    fetchPlanById,
    addDay,
    deleteDay,
    addExercise,
    updateExercise,
    deleteExercise
  } = usePlanStore();

  const [expandedDays, setExpandedDays] = useState<string[]>([]);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState<{ isOpen: boolean, dayId: string, exercise?: Exercise }>({
    isOpen: false,
    dayId: '',
  });
  const [trackingType, setTrackingType] = useState<'reps' | 'time'>('reps');

  useEffect(() => {
    if (id) fetchPlanById(id);
  }, [id, fetchPlanById]);


  const toggleDay = (dayId: string) => {
    setExpandedDays(prev =>
      prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId]
    );
  };

  const handleCreateDay = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;
    const formData = new FormData(e.currentTarget);
    await addDay(id, {
      name: formData.get('name') as string,
      order: (currentPlan?.days.length || 0) + 1
    });
    setIsDayModalOpen(false);
  };

  const handleExerciseSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id || !isExerciseModalOpen.dayId) return;
    const formData = new FormData(e.currentTarget);
    const exerciseData: Partial<Exercise> = {
      name: formData.get('name') as string,
      sets: parseInt(formData.get('sets') as string),
      reps: trackingType === 'time' ? `${formData.get('duration')}s` : formData.get('reps') as string,
      rest_time: parseInt(formData.get('rest_time') as string),
      youtube_link: formData.get('youtube_link') as string,
    };

    if (isExerciseModalOpen.exercise) {
      await updateExercise(id, isExerciseModalOpen.dayId, isExerciseModalOpen.exercise.id, exerciseData);
    } else {
      await addExercise(id, isExerciseModalOpen.dayId, exerciseData);
    }
    setIsExerciseModalOpen({ isOpen: false, dayId: '' });
  };


  if (isLoading || !currentPlan) return <Loading />;

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <button
        onClick={() => navigate('/plans')}
        className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        Back to Plans
      </button>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">{currentPlan.title}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">{currentPlan.description}</p>
          <div className="flex gap-4 mt-6">
            <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/50">
              <Hash className="w-4 h-4 text-primary-500" /> {currentPlan.days_count} Training Days
            </span>
          </div>
        </div>
        <Button onClick={() => setIsDayModalOpen(true)} className="w-full md:w-auto">
          <Plus className="w-5 h-5" />
          Add Training Day
        </Button>
      </div>

      <div className="space-y-4">
        {(currentPlan.days || []).sort((a, b) => (a.order || 0) - (b.order || 0)).map((day) => (
          <div key={day.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm transition-colors duration-300">
            <div
              className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              onClick={() => toggleDay(day.id)}
            >
              <div className="flex items-center gap-4">
                <div className="bg-slate-100 dark:bg-slate-800 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-slate-500 dark:text-slate-400">
                  {day.order}
                </div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">{day.name}</h3>
                <span className="text-slate-400 dark:text-slate-500 text-sm">{(day.exercises || []).length} Exercises</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); if (id && confirm('Delete this day?')) deleteDay(id, day.id); }}
                  className="p-2 text-slate-300 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {expandedDays.includes(day.id) ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </div>
            </div>

            {expandedDays.includes(day.id) && (
              <div className="p-5 border-t border-slate-50 dark:border-slate-800 space-y-4 bg-slate-50/30 dark:bg-slate-950/20">
                {(day.exercises || []).map((ex) => (
                  <div key={ex.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between group shadow-sm transition-colors duration-300">
                    <div className="flex gap-4">
                      {ex.image_url ? (
                        <img src={ex.image_url} alt={ex.name} className="w-16 h-16 rounded-lg object-cover" />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600">
                          {String(ex.reps || "").toLowerCase().includes('s') ? <Clock className="w-6 h-6" /> : <Dumbbell className="w-6 h-6" />}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white">{ex.name}</h4>
                        <div className="flex items-center gap-4 mt-1 text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded uppercase">
                            {ex.sets} Sets × {ex.reps}
                          </span>
                          {ex.rest_time && <span>Rest: {ex.rest_time}s</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {ex.youtube_link && (
                        <a href={ex.youtube_link} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-red-600">
                          <Video className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => {
                          const isTime = String(ex.reps || "").toLowerCase().includes('s');
                          setTrackingType(isTime ? 'time' : 'reps');
                          setIsExerciseModalOpen({ isOpen: true, dayId: day.id, exercise: ex });
                        }}
                        className="p-2 text-slate-400 hover:text-primary-600"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => id && deleteExercise(id, day.id, ex.id)}
                        className="p-2 text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => {
                    setTrackingType('reps');
                    setIsExerciseModalOpen({ isOpen: true, dayId: day.id });
                  }}
                  className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 dark:text-slate-600 text-sm font-bold flex items-center justify-center gap-2 hover:border-primary-200 dark:hover:border-primary-900 hover:text-primary-500 hover:bg-primary-50/30 dark:hover:bg-primary-950/30 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Exercise to {day.name}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Day Modal */}
      {isDayModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full animate-slide-up shadow-2xl border dark:border-slate-800">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Add Training Day</h2>
            <form onSubmit={handleCreateDay} className="space-y-5">
              <Input name="name" label="Day Name" placeholder="e.g. Chest & Triceps" required autoFocus />
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsDayModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Save Day
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Exercise Modal */}
      {isExerciseModalOpen.isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-lg w-full animate-slide-up shadow-2xl max-h-[90vh] overflow-y-auto border dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold dark:text-white">
                {isExerciseModalOpen.exercise ? 'Edit' : 'Add'} Exercise
              </h2>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setTrackingType('reps')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${trackingType === 'reps' ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm' : 'text-slate-500'}`}
                >
                  Reps
                </button>
                <button
                  type="button"
                  onClick={() => setTrackingType('time')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${trackingType === 'time' ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm' : 'text-slate-500'}`}
                >
                  Time
                </button>
              </div>
            </div>

            <form onSubmit={handleExerciseSubmit} className="space-y-4">
              <Input
                name="name"
                label="Exercise Name"
                placeholder="e.g. Bench Press"
                defaultValue={isExerciseModalOpen.exercise?.name}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="sets"
                  label="Sets"
                  type="number"
                  defaultValue={isExerciseModalOpen.exercise?.sets || 3}
                  required
                />

                {trackingType === 'reps' ? (
                  <Input
                    name="reps"
                    label="Reps / Info"
                    placeholder="e.g. 10-12"
                    defaultValue={isExerciseModalOpen.exercise?.reps}
                    required
                  />
                ) : (
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Duration (seconds)</label>
                    <select
                      name="duration"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 transition-all font-medium"
                      defaultValue={String(isExerciseModalOpen.exercise?.reps || "").replace('s', '') || "30"}
                    >
                      {Array.from({ length: 30 }, (_, i) => (i + 1) * 10).map(val => (
                        <option key={val} value={val}>{val} Seconds</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <Input
                name="rest_time"
                label="Rest (seconds)"
                type="number"
                defaultValue={isExerciseModalOpen.exercise?.rest_time || 60}
              />
              <Input
                name="youtube_link"
                label="Tutorial Link (Optional)"
                placeholder="https://youtube.com/..."
                defaultValue={isExerciseModalOpen.exercise?.youtube_link}
              />

              <div className="flex gap-3 pt-6">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setIsExerciseModalOpen({ isOpen: false, dayId: '' })}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {isExerciseModalOpen.exercise ? 'Update' : 'Add'} Exercise
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
