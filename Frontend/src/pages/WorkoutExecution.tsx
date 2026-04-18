import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  CheckCircle2, 
  Clock, 
  RotateCcw, 
  Play, 
  Pause,
  Trophy,
  ArrowRight
} from 'lucide-react';
import { usePlanStore } from '../store/usePlanStore';
import { useProgressStore } from '../store/useProgressStore';
import { Button } from '../components/common/Inputs';
import { Loading } from '../components/common/Loading';
import toast from 'react-hot-toast';

export const WorkoutExecution = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentPlan, fetchPlanById, isLoading: planLoading } = usePlanStore();
  const { trackProgress } = useProgressStore();
  
  const [currentDayIndex] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [sessionStartTime] = useState(new Date());
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    if (id) fetchPlanById(id);
  }, [id, fetchPlanById]);

  useEffect(() => {
    if (!isTimerRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          toast('Rest finished! Get back to it! 💪');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, setIsTimerRunning]);

  if (planLoading || !currentPlan) return <Loading />;
  
  const day = currentPlan.days[currentDayIndex];
  if (!day) return <div className="p-10 text-center">No days found in this plan.</div>;
  
  const exercise = day.exercises[currentExerciseIndex];

  const handleNext = () => {
    if (currentExerciseIndex < day.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      if (exercise.rest_time) {
        setTimeLeft(exercise.rest_time);
        setIsTimerRunning(true);
      }
    } else {
      setIsFinished(true);
    }
  };

  const finishWorkout = async () => {
    try {
      // Save progress for the last day's exercises
      // In a real app, we might track this after each exercise, 
      // but for simplicity, we'll save one representative record or all.
      // Saving all exercises from the day as completed:
      for (const ex of day.exercises) {
        await trackProgress({
          plan_id: id || '',
          day_id: day.id,
          exercise_id: ex.id,
          completed: true,
          time_taken: Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 60000)
        });
      }
      
      toast.success('WORKOUT COMPLETE! Progress saved! 🏆');
      navigate('/history');
    } catch {
      toast.error('Could not save progress, please try again.');
    }
  };


  if (isFinished) {
    const duration = Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 60000);
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8 animate-slide-up">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="relative bg-white dark:bg-slate-900 p-8 rounded-full shadow-2xl border-4 border-primary-50 dark:border-primary-900">
              <Trophy className="w-20 h-20 text-yellow-500" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white">Session Complete!</h1>
            <p className="text-xl text-slate-500 dark:text-slate-400">You're one step closer to your goal.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Duration</p>
              <p className="text-2xl font-black text-slate-800 dark:text-white">{duration} min</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Volume</p>
              <p className="text-2xl font-black text-slate-800 dark:text-white">{day.exercises.length} Exs</p>
            </div>
          </div>

          <Button onClick={finishWorkout} className="w-full h-14 text-lg rounded-2xl">
            Save Progress & Finish <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(`/plans/${id}`)}
          className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h2 className="font-bold text-slate-900 dark:text-white">{day.name}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">Exercise {currentExerciseIndex + 1} of {day.exercises.length}</p>
        </div>
        <div className="w-10"></div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary-600 transition-all duration-500 ease-out"
          style={{ width: `${((currentExerciseIndex + 1) / day.exercises.length) * 100}%` }}
        ></div>
      </div>

      {!exercise ? (
        <div className="card p-12 text-center">
          <p className="text-slate-500 dark:text-slate-400">No exercises added for this day</p>
          <Button onClick={() => navigate(`/plans/${id}`)} variant="secondary" className="mt-4">Go to Plan Editor</Button>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            <div className="card overflow-hidden">
               {exercise.image_url ? (
                <img src={exercise.image_url} alt={exercise.name} className="w-full h-64 object-cover" />
              ) : (
                <div className="w-full h-64 bg-slate-50 dark:bg-slate-800 flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 gap-4">
                  <div className="w-20 h-20 rounded-full border-4 border-slate-100 dark:border-slate-700 border-dashed animate-spin-slow"></div>
                  <span className="text-sm italic font-medium">Visualization training...</span>
                </div>
              )}
              <div className="p-8">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">{exercise.name}</h1>
                <div className="flex gap-8 mb-8">
                  <div>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Sets</p>
                    <p className="text-3xl font-black text-primary-600 dark:text-primary-400">{exercise.sets}</p>
                  </div>
                  <div className="border-l border-slate-100 dark:border-slate-800 pl-8">
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Reps/Target</p>
                    <p className="text-3xl font-black text-slate-800 dark:text-slate-200">{exercise.reps || '-'}</p>
                  </div>
                </div>
                {exercise.description && (
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    {exercise.description}
                  </p>
                )}
              </div>
            </div>

            {/* Timer Section */}
            <div className={`card p-8 transition-all duration-500 ${isTimerRunning ? 'ring-2 ring-primary-500 bg-primary-50/20 dark:bg-primary-900/10' : ''}`}>
              <div className="flex items-center justify-between gap-8">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl ${isTimerRunning ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}>
                    <Clock className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase">Rest Timer</p>
                    <p className={`text-4xl font-black ${isTimerRunning ? 'text-primary-600 dark:text-primary-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setTimeLeft(exercise.rest_time || 60)}
                    className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <RotateCcw className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`p-4 rounded-2xl shadow-lg transition-all active:scale-95 ${
                      isTimerRunning 
                        ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                        : 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-500/30'
                    }`}
                  >
                    {isTimerRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                </div>
              </div>
            </div>

            <Button onClick={handleNext} className="w-full h-20 text-xl font-bold rounded-3xl shadow-2xl shadow-primary-500/40">
              Mark Exercise Complete <CheckCircle2 className="w-6 h-6" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
