import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Copy, Info, LayoutGrid } from 'lucide-react';
import { usePlanStore } from '../store/usePlanStore';
import { Loading } from '../components/common/Loading';
import { Button } from '../components/common/Inputs';

export const Templates = () => {
  const navigate = useNavigate();
  const { templates, fetchTemplates, isLoading, duplicatePlan } = usePlanStore();

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  if (isLoading) return <Loading />;

  const displayTemplates = templates;


  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Workout Templates</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Start with a professional routine and customize it to your needs.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayTemplates.map((template) => (
          <div key={template.id} className="card group relative">
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur p-2 rounded-full shadow-sm text-yellow-500">
                <Star className="w-5 h-5 fill-yellow-500" />
              </div>
            </div>
            <div className="h-40 bg-gradient-to-br from-primary-600 to-primary-900 relative overflow-hidden p-6 text-white">
              <LayoutGrid className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10 rotate-12" />
              <div className="relative z-10 h-full flex flex-col justify-end">
                <span className="text-[10px] uppercase font-black tracking-widest text-primary-200">{template.difficulty}</span>
                <h3 className="text-xl font-bold">{template.title}</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2 h-10">
                {template.description}
              </p>
              <div className="flex gap-3">
                <Button 
                  onClick={() => {
                    duplicatePlan(template.id);
                    navigate('/plans');
                  }}
                  className="flex-1"
                >
                  <Copy className="w-4 h-4" /> Use This
                </Button>
                <button className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                  <Info className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {displayTemplates.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <LayoutGrid className="w-16 h-16 text-slate-200 dark:text-slate-800 mb-4" />
            <h3 className="text-xl font-semibold text-slate-400 dark:text-slate-500">No templates available</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 italic">Professional templates will appear here once they are added to the database.</p>
          </div>
        )}

      </div>

    </div>
  );
};
