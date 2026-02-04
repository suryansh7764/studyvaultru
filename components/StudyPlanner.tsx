import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, Calendar, Flag, AlertCircle, Target, Trophy } from 'lucide-react';
import { StudyGoal } from '../types';

const StudyPlanner: React.FC = () => {
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [newGoalText, setNewGoalText] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');

  // Load from Local Storage on mount
  useEffect(() => {
    const savedGoals = localStorage.getItem('ru_study_goals');
    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals));
      } catch (e) {
        console.error("Failed to parse goals", e);
      }
    }
  }, []);

  // Save to Local Storage whenever goals change
  useEffect(() => {
    localStorage.setItem('ru_study_goals', JSON.stringify(goals));
  }, [goals]);

  const addGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;

    const goal: StudyGoal = {
      id: Date.now().toString(),
      text: newGoalText,
      deadline: newDeadline,
      priority: newPriority,
      completed: false,
      createdAt: Date.now(),
    };

    setGoals(prev => [goal, ...prev]);
    setNewGoalText('');
    setNewDeadline('');
    setNewPriority('medium');
  };

  const toggleGoal = (id: string) => {
    setGoals(prev => prev.map(g => 
      g.id === id ? { ...g, completed: !g.completed } : g
    ));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50';
      case 'medium': return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/50';
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/50';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800';
    }
  };

  const isDueSoon = (dateString: string) => {
    if (!dateString) return false;
    const today = new Date();
    const due = new Date(dateString);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays >= 0 && diffDays <= 3;
  };

  const completedCount = goals.filter(g => g.completed).length;
  const progress = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-serif font-bold text-university-900 dark:text-white">Study Planner</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Set goals, track your syllabus coverage, and stay organized.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Add Form */}
        <div className="space-y-6">
          {/* Progress Card */}
          <div className="bg-university-900 dark:bg-slate-800 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                   <Target className="h-6 w-6 text-university-accent" />
                   <h3 className="font-bold text-lg">Your Progress</h3>
                </div>
                
                <div className="flex items-end gap-2 mb-2">
                   <span className="text-4xl font-bold">{progress}%</span>
                   <span className="text-gray-400 mb-1.5">completed</span>
                </div>
                
                <div className="w-full bg-white/20 rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-university-accent h-2.5 rounded-full transition-all duration-700" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-sm text-gray-300">
                   <span>{completedCount} finished</span>
                   <span>{goals.length - completedCount} remaining</span>
                </div>
             </div>
             {/* Decorative BG */}
             <Trophy className="absolute -bottom-4 -right-4 h-32 w-32 text-white/5 rotate-12" />
          </div>

          {/* Add Goal Form */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-slate-800">
             <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
               <Plus className="h-5 w-5 text-university-accent" />
               Add New Goal
             </h3>
             <form onSubmit={addGoal} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">Goal Description</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Finish Physics Unit 1 Notes" 
                    className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-university-accent focus:ring-1 focus:ring-university-accent transition-all text-sm dark:text-white"
                    value={newGoalText}
                    onChange={(e) => setNewGoalText(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">Deadline</label>
                      <input 
                        type="date" 
                        className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-university-accent focus:ring-1 focus:ring-university-accent transition-all text-sm text-gray-600 dark:text-gray-300"
                        value={newDeadline}
                        onChange={(e) => setNewDeadline(e.target.value)}
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">Priority</label>
                      <select 
                        className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-university-accent focus:ring-1 focus:ring-university-accent transition-all text-sm text-gray-600 dark:text-gray-300"
                        value={newPriority}
                        onChange={(e) => setNewPriority(e.target.value as any)}
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                   </div>
                </div>

                <button 
                  type="submit" 
                  disabled={!newGoalText.trim()}
                  className="w-full bg-university-accent hover:bg-amber-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  Create Goal
                </button>
             </form>
          </div>
        </div>

        {/* Right Column: Goal List */}
        <div className="lg:col-span-2 space-y-4">
           {goals.length === 0 ? (
             <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-dashed border-gray-300 dark:border-slate-700 h-full flex flex-col items-center justify-center">
                <Target className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No goals set yet</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto mt-2">Start by adding a study target, exam date, or syllabus chapter you want to complete.</p>
             </div>
           ) : (
             <>
                {goals.sort((a, b) => Number(a.completed) - Number(b.completed)).map((goal) => (
                  <div 
                    key={goal.id} 
                    className={`group flex items-start gap-4 p-5 rounded-xl border transition-all duration-200 ${
                      goal.completed 
                        ? 'bg-gray-50 dark:bg-slate-900 border-gray-100 dark:border-slate-800 opacity-75' 
                        : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-university-accent/30 dark:hover:border-university-accent/30'
                    }`}
                  >
                    <button 
                      onClick={() => toggleGoal(goal.id)}
                      className={`flex-shrink-0 mt-1 transition-colors ${goal.completed ? 'text-green-500' : 'text-gray-300 dark:text-gray-600 hover:text-university-accent'}`}
                    >
                      {goal.completed ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                    </button>

                    <div className="flex-grow">
                       <div className="flex items-start justify-between">
                          <h4 className={`text-base font-medium transition-all ${goal.completed ? 'text-gray-500 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>
                            {goal.text}
                          </h4>
                          <button 
                            onClick={() => deleteGoal(goal.id)}
                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                       </div>

                       <div className="flex flex-wrap items-center gap-3 mt-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${getPriorityColor(goal.priority)}`}>
                             {goal.priority}
                          </span>
                          
                          {goal.deadline && (
                            <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded ${
                               !goal.completed && isDueSoon(goal.deadline) 
                                 ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
                                 : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400'
                            }`}>
                               {isDueSoon(goal.deadline) && !goal.completed ? <AlertCircle className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
                               <span>
                                 {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                 {isDueSoon(goal.deadline) && !goal.completed && " (Due Soon!)"}
                               </span>
                            </div>
                          )}
                       </div>
                    </div>
                  </div>
                ))}
             </>
           )}
        </div>
      </div>
    </div>
  );
};

export default StudyPlanner;