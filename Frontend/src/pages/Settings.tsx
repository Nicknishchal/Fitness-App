import { useState } from 'react';
import { Bell, Shield, User, Smartphone } from 'lucide-react';
import { Button } from '../components/common/Inputs';
import toast from 'react-hot-toast';

export const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [reminderTime, setReminderTime] = useState('08:00');

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="max-w-4xl space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account and app preferences</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <aside className="space-y-1">
          {[
            { icon: User, label: 'Profile' },
            { icon: Bell, label: 'Notifications', active: true },
            { icon: Shield, label: 'Privacy & Security' },
            { icon: Smartphone, label: 'Devices' },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                item.active 
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </aside>

        <div className="md:col-span-2 space-y-6">
          <section className="card p-8 space-y-8">
            <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-6">
              <div className="space-y-1">
                <h3 className="font-bold text-lg dark:text-white">Workout Reminders</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Enable daily notifications for your schedule</p>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${notifications ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white dark:bg-slate-400 rounded-full shadow transition-all duration-300 ${notifications ? 'left-7 bg-white' : 'left-1'}`} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2 uppercase tracking-wide">Reminder Time</label>
                <input 
                  type="time" 
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="input-field max-w-[200px] dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  disabled={!notifications}
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2 uppercase tracking-wide">Notification Type</label>
                <div className="space-y-3">
                  {['Push Notifications', 'Email Digest', 'SMS Reminders'].map(type => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-primary-600 focus:ring-primary-500" />
                      <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex gap-4">
              <Button onClick={handleSave}>Save Changes</Button>
              <Button variant="secondary" className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">Reset to Default</Button>
            </div>
          </section>

          <section className="card p-8 bg-red-50/30 dark:bg-red-900/10 border-red-100 dark:border-red-900/30">
            <h3 className="font-bold text-lg text-red-900 dark:text-red-400 mb-2">Danger Zone</h3>
            <p className="text-sm text-red-600 dark:text-red-500 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
            <Button variant="danger" className="bg-red-600 shadow-red-500/20">Delete My Account</Button>
          </section>
        </div>
      </div>
    </div>
  );
};
