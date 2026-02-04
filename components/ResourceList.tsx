
import React, { useState } from 'react';
import { Resource, ResourceType, StudyGoal, CoursePattern, DegreeLevel, User } from '../types';
import { FileText, Download, Book, FileQuestion, CalendarPlus, X, Info, Heart, Sparkles } from 'lucide-react';
import { db } from '../services/db';
import LoginModal from './LoginModal';

interface ResourceListProps {
  resources: Resource[];
  activeFilterType?: ResourceType | null; 
  user: User | null;
  onLogin: (uid: string, identifier: string, name: string, collegeId: string) => void;
  favorites?: string[]; // IDs passed from parent
  onToggleFavorite?: (id: string) => void;
}

const CARD_BG_COLORS = [
  'bg-slate-50',
  'bg-orange-50',
  'bg-amber-50',
  'bg-stone-50',
  'bg-yellow-50',
  'bg-neutral-50'
];

const ResourceList: React.FC<ResourceListProps> = ({ resources, activeFilterType, user, onLogin, favorites = [], onToggleFavorite }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalGoalText, setModalGoalText] = useState('');
  const [modalDeadline, setModalDeadline] = useState('');
  const [modalPriority, setModalPriority] = useState<'high' | 'medium' | 'low'>('medium');
  
  // Login State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingDownloadId, setPendingDownloadId] = useState<string | null>(null);

  const handleAddToPlannerClick = (resource: Resource) => {
    setModalGoalText(`Finish ${resource.type === ResourceType.PYQ ? 'solving' : 'reading'} ${resource.title}`);
    setModalDeadline('');
    setModalPriority('medium');
    setIsModalOpen(true);
  };

  const saveToPlanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalGoalText.trim()) return;

    const newGoal: StudyGoal = {
      id: Date.now().toString(),
      text: modalGoalText,
      deadline: modalDeadline,
      priority: modalPriority,
      completed: false,
      createdAt: Date.now(),
    };

    try {
      const existingGoalsStr = localStorage.getItem('ru_study_goals');
      const existingGoals: StudyGoal[] = existingGoalsStr ? JSON.parse(existingGoalsStr) : [];
      const updatedGoals = [newGoal, ...existingGoals];
      localStorage.setItem('ru_study_goals', JSON.stringify(updatedGoals));
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save goal", error);
    }
  };

  const triggerDownload = async (id: string) => {
      if (id === 'sample-placeholder') {
          window.open('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '_blank');
          return;
      }

      try {
          const blobUrl = await db.getFileUrl(`res-${id}`);
          if (blobUrl) {
              window.open(blobUrl, '_blank');
          } else {
              alert("File not found in database.");
          }
      } catch (e) {
          console.error("Download failed", e);
          alert("Error retrieving file.");
      }
  };

  const handleDownloadClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (user?.isLoggedIn) {
      triggerDownload(id);
    } else {
      setPendingDownloadId(id);
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = (uid: string, identifier: string, name: string, collegeId: string) => {
      onLogin(uid, identifier, name, collegeId);
      setIsLoginModalOpen(false);
      if (pendingDownloadId) {
        triggerDownload(pendingDownloadId);
        setPendingDownloadId(null);
      }
  };

  const isRecent = (timestamp?: number) => {
      if (!timestamp) return false;
      const fortyEightHours = 48 * 60 * 60 * 1000;
      return (Date.now() - timestamp) < fortyEightHours;
  };

  const DEMO_PDF_URL = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
  let displayedResources = [...resources];
  const isFallback = resources.length === 0;

  if (isFallback) {
    const fallbackType = activeFilterType || ResourceType.PYQ;
    const fallbackResource: Resource = {
      id: 'sample-placeholder',
      title: `Sample ${fallbackType === ResourceType.PYQ ? 'Question Paper' : fallbackType === ResourceType.NOTE ? 'Lecture Note' : 'Syllabus'} (Demo PDF)`,
      collegeId: 'demo',
      subjectId: 'demo',
      semester: 1,
      year: new Date().getFullYear(),
      type: fallbackType,
      pattern: CoursePattern.NEP,
      degreeLevel: DegreeLevel.UG,
      downloadUrl: DEMO_PDF_URL,
      size: '0.1 MB',
      downloadCount: 0
    };
    displayedResources = [fallbackResource];
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {isFallback && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-start gap-3 mb-6">
           <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
           <div>
             <h4 className="text-sm font-bold text-blue-900 dark:text-blue-100">Displaying Sample Content</h4>
             <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
               We couldn't find exact matches for your filters, so we've added a sample document below.
             </p>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedResources.map((resource, index) => {
            const bgColorClass = CARD_BG_COLORS[index % CARD_BG_COLORS.length];
            const recent = isRecent(resource.createdAt);
            const isLiked = favorites.includes(resource.id);

            return (
              <div 
                key={resource.id} 
                className={`group relative flex flex-col ${bgColorClass} dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl hover:border-university-accent/40 dark:hover:border-university-accent/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 overflow-hidden`}
              >
                {recent && (
                    <div className="absolute top-0 right-0 z-20">
                        <div className="bg-university-accent text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-lg flex items-center gap-1">
                            <Sparkles className="h-3 w-3" /> NEW
                        </div>
                    </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/40 dark:to-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div className={`
                      flex-shrink-0 p-3 rounded-xl shadow-sm ring-1 ring-inset transition-colors duration-300 bg-white dark:bg-slate-800
                      ${resource.type === ResourceType.PYQ ? 'text-blue-700 dark:text-blue-300 ring-blue-100 dark:ring-blue-800' : 
                        resource.type === ResourceType.NOTE ? 'text-amber-700 dark:text-amber-300 ring-amber-100 dark:ring-amber-800' : 
                        'text-purple-700 dark:text-purple-300 ring-purple-100 dark:ring-purple-800'}
                    `}>
                      {resource.type === ResourceType.PYQ ? <FileQuestion className="h-6 w-6" /> : 
                       resource.type === ResourceType.NOTE ? <FileText className="h-6 w-6" /> :
                       <Book className="h-6 w-6" />}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`
                        px-2.5 py-1 rounded-md text-[10px] font-bold border tracking-wider uppercase shadow-sm bg-white/60 dark:bg-slate-800/60
                        ${resource.type === ResourceType.PYQ ? 'text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-900/50' : 
                          resource.type === ResourceType.NOTE ? 'text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-900/50' : 
                          'text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-900/50'}
                      `}>
                          {resource.type === ResourceType.PYQ ? 'Question Paper' : resource.type === ResourceType.NOTE ? 'Notes' : 'Syllabus'}
                      </span>
                      
                      <button
                          onClick={() => onToggleFavorite && onToggleFavorite(resource.id)}
                          className={`p-1.5 rounded-full transition-all duration-200 focus:outline-none hover:scale-110 ${
                              isLiked
                              ? 'text-red-500 bg-white dark:bg-red-900/20 shadow-sm'
                              : 'text-gray-400 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-white dark:hover:bg-slate-800'
                          }`}
                          title={isLiked ? "Unlike" : "Like"}
                      >
                          <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <div className="mb-6 flex-grow">
                     <h4 className="text-lg font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 mb-3 group-hover:text-university-accent transition-colors">
                        {resource.title}
                     </h4>
                     <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                        <span className="bg-white/60 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-gray-200 dark:border-slate-700">Sem {resource.semester}</span>
                        <span className="bg-white/60 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-gray-200 dark:border-slate-700">{resource.year}</span>
                        <span className="text-gray-400 dark:text-slate-600">&bull;</span>
                        <span>{resource.size}</span>
                     </div>
                  </div>

                  <div className="mt-auto pt-5 border-t border-gray-200/60 dark:border-slate-800 flex items-center justify-between gap-3">
                     <button 
                        onClick={() => handleAddToPlannerClick(resource)}
                        className="flex-1 flex items-center justify-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 transition-all px-4 py-2.5 rounded-lg shadow-sm"
                        title="Add to Study Planner"
                      >
                        <CalendarPlus className="h-4 w-4" />
                        Plan
                      </button>
                      <button 
                        onClick={(e) => handleDownloadClick(e, resource.id)}
                        className="flex-1 flex items-center justify-center gap-2 text-xs font-bold text-white bg-university-900 dark:bg-university-accent hover:bg-university-800 dark:hover:bg-orange-600 transition-all px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg group-hover:scale-105 active:scale-95"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200 dark:border-slate-700 scale-100 animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-5">
                 <h3 className="text-xl font-serif font-bold text-university-900 dark:text-white flex items-center gap-2">
                   <CalendarPlus className="h-6 w-6 text-university-accent" />
                   Add to Planner
                 </h3>
                 <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                   <X className="h-5 w-5" />
                 </button>
              </div>
              
              <form onSubmit={saveToPlanner} className="space-y-5">
                 <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Goal Description</label>
                    <input 
                      type="text" 
                      value={modalGoalText}
                      onChange={(e) => setModalGoalText(e.target.value)}
                      className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-university-accent focus:ring-1 focus:ring-university-accent dark:text-white text-sm transition-all"
                      placeholder="e.g. Finish reading Chapter 1"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Deadline</label>
                       <input 
                         type="date" 
                         value={modalDeadline}
                         onChange={(e) => setModalDeadline(e.target.value)}
                         className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-university-accent focus:ring-1 focus:ring-university-accent dark:text-white text-sm text-gray-700 dark:text-gray-200 transition-all"
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Priority</label>
                       <select 
                         value={modalPriority}
                         onChange={(e) => setModalPriority(e.target.value as any)}
                         className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-university-accent focus:ring-1 focus:ring-university-accent dark:text-white text-sm text-gray-700 dark:text-gray-200 transition-all"
                       >
                         <option value="high">High</option>
                         <option value="medium">Medium</option>
                         <option value="low">Low</option>
                       </select>
                    </div>
                 </div>

                 <div className="flex gap-3 pt-3">
                    <button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={!modalGoalText.trim()}
                      className="flex-1 py-3 rounded-xl bg-university-accent hover:bg-orange-700 text-white font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 text-sm"
                    >
                      Add Goal
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLogin={handleLoginSuccess} 
      />
    </div>
  );
};

export default ResourceList;
