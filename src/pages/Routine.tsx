import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Plus, Trash2, Save, Edit2, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface RoutineItem {
  id: string;
  time: string;
  activity: string;
}

interface RoutineData {
  morning: RoutineItem[];
  evening: RoutineItem[];
}

const defaultRoutine: RoutineData = {
  morning: [
    { id: '1', time: '6:00 AM', activity: 'Wake up & Exercise' },
    { id: '2', time: '7:00 AM', activity: 'Breakfast & News' },
    { id: '3', time: '8:00 AM', activity: 'MCQ Practice (1 hour)' },
    { id: '4', time: '9:00 AM', activity: 'Typing Practice (30 min)' },
    { id: '5', time: '10:00 AM', activity: 'Syllabus Study' },
  ],
  evening: [
    { id: '6', time: '5:00 PM', activity: 'Current Affairs' },
    { id: '7', time: '6:00 PM', activity: 'Subjective Answers' },
    { id: '8', time: '7:00 PM', activity: 'Revision' },
    { id: '9', time: '8:00 PM', activity: 'Dinner Break' },
    { id: '10', time: '9:00 PM', activity: 'Light Reading' },
  ],
};

export default function Routine() {
  const [routine, setRoutine] = useState<RoutineData>(defaultRoutine);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTime, setEditTime] = useState('');
  const [editActivity, setEditActivity] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`loksewa_routine_${user.email}`);
      if (saved) {
        setRoutine(JSON.parse(saved));
      }
    }
  }, [user]);

  const saveRoutine = (newRoutine: RoutineData) => {
    if (user) {
      localStorage.setItem(`loksewa_routine_${user.email}`, JSON.stringify(newRoutine));
    }
    setRoutine(newRoutine);
  };

  const handleAdd = (period: 'morning' | 'evening') => {
    const newItem: RoutineItem = {
      id: Date.now().toString(),
      time: period === 'morning' ? '8:00 AM' : '6:00 PM',
      activity: 'New Activity',
    };
    saveRoutine({
      ...routine,
      [period]: [...routine[period], newItem],
    });
    setEditingId(newItem.id);
    setEditTime(newItem.time);
    setEditActivity(newItem.activity);
  };

  const handleDelete = (period: 'morning' | 'evening', id: string) => {
    saveRoutine({
      ...routine,
      [period]: routine[period].filter(item => item.id !== id),
    });
  };

  const handleEdit = (item: RoutineItem) => {
    setEditingId(item.id);
    setEditTime(item.time);
    setEditActivity(item.activity);
  };

  const handleSave = (period: 'morning' | 'evening') => {
    if (!editingId) return;
    
    saveRoutine({
      ...routine,
      [period]: routine[period].map(item =>
        item.id === editingId
          ? { ...item, time: editTime, activity: editActivity }
          : item
      ),
    });
    setEditingId(null);
    toast({ title: "Saved!", description: "Your routine has been updated." });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditTime('');
    setEditActivity('');
  };

  const renderRoutineSection = (period: 'morning' | 'evening', items: RoutineItem[], icon: React.ReactNode, title: string) => (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        <Button variant="outline" size="sm" onClick={() => handleAdd(period)}>
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      <div className="space-y-3">
        {items.map(item => (
          <div
            key={item.id}
            className={`p-4 rounded-lg border transition-all ${
              editingId === item.id
                ? 'bg-primary/5 border-primary'
                : 'bg-secondary/50 border-transparent hover:border-border'
            }`}
          >
            {editingId === item.id ? (
              <div className="space-y-3">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    placeholder="Time"
                    className="w-28 px-3 py-2 rounded-lg bg-background border border-border focus:border-primary outline-none text-sm"
                  />
                  <input
                    type="text"
                    value={editActivity}
                    onChange={(e) => setEditActivity(e.target.value)}
                    placeholder="Activity"
                    className="flex-1 px-3 py-2 rounded-lg bg-background border border-border focus:border-primary outline-none text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleSave(period)}>
                    <Save className="w-3 h-3" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    <X className="w-3 h-3" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-primary min-w-[80px]">
                    {item.time}
                  </span>
                  <span className="text-sm">{item.activity}</span>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(period, item.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No activities yet. Click "Add" to create your routine.
          </p>
        )}
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-up">
            <h1 className="text-3xl font-bold mb-2">Daily Routine</h1>
            <p className="text-muted-foreground">
              Plan your morning and evening study schedule for consistent preparation
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {renderRoutineSection(
              'morning',
              routine.morning,
              <Sun className="w-5 h-5" />,
              'Morning Routine'
            )}
            {renderRoutineSection(
              'evening',
              routine.evening,
              <Moon className="w-5 h-5" />,
              'Evening Routine'
            )}
          </div>

          {/* Tips */}
          <div className="glass-card rounded-xl p-6 mt-6">
            <h3 className="font-semibold mb-4">Study Tips</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Start your day with MCQ practice when your mind is fresh
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Practice typing regularly to build muscle memory
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Review weak topics in the evening for better retention
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Take short breaks every hour to stay focused
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
