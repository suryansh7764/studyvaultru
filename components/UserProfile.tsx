import React, { useState } from 'react';
import { User, Resource, ResourceType } from '../types';
import { 
  User as UserIcon, Building2, Award, Mail, BookOpen, LogOut, 
  Heart, FileText, TrendingUp, CheckCircle, Clock, Plus, 
  Search, Bookmark, ShieldCheck, Zap, Sparkles, GraduationCap,
  ArrowRight, BarChart3, History, Trophy, Medal, Gem, Flame
} from 'lucide-react';
import ResourceList from './ResourceList';
import { COLLEGES, SUBJECTS } from '../constants';

interface UserProfileProps {
  user: User;
  savedResources: Resource[];
  onLogout: () => void;
  onToggleFavorite: (id: string) => void;
  onNavigate: (view: any) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, savedResources, onLogout, onToggleFavorite, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'library' | 'contributions' | 'performance'>('library');
  
  const collegeName = COLLEGES.find(c => c.id === user.collegeId)?.name || 'University Student';
  const savedSubjectIds = user.savedResources?.filter(id => SUBJECTS.some(s => s.id === id)) || [];
  const savedSubjectObjects = SUBJECTS.filter(s => savedSubjectIds.includes(s.id));
  const actualSavedResources = savedResources.filter(r => !savedSubjectIds.includes(r.id));

  // Tiered Badge Logic (0-50, 51-100, 101-200, 201-300, 301-500, 501-1000)
  const getBadgeDetails = (credits: number) => {
    if (credits >= 501) return { 
        label: 'Ruby Legend', 
        icon: <Flame className="h-6 w-6" />, 
        color: 'text-red-500', 
        bg: 'bg-red-500/10', 
        gradient: 'from-red-600 via-rose-500 to-red-900',
        next: 1000,
        desc: 'Ultimate Rank'
    };
    if (credits >= 301) return { 
        label: 'Diamond Elite', 
        icon: <Sparkles className="h-6 w-6" />, 
        color: 'text-cyan-400', 
        bg: 'bg-cyan-400/10', 
        gradient: 'from-cyan-300 via-blue-400 to-indigo-600',
        next: 500,
        desc: 'Crystal Excellence'
    };
    if (credits >= 201) return { 
        label: 'Platinum Scholar', 
        icon: <Gem className="h-6 w-6" />, 
        color: 'text-slate-300', 
        bg: 'bg-slate-300/10', 
        gradient: 'from-slate-300 via-white to-slate-500',
        next: 300,
        desc: 'High Distinction'
    };
    if (credits >= 101) return { 
        label: 'Gold Achiever', 
        icon: <Trophy className="h-6 w-6" />, 
        color: 'text-amber-400', 
        bg: 'bg-amber-400/10', 
        gradient: 'from-amber-400 via-yellow-200 to-orange-600',
        next: 200,
        desc: 'Elite Contributor'
    };
    if (credits >= 51) return { 
        label: 'Silver Learner', 
        icon: <Medal className="h-6 w-6" />, 
        color: 'text-slate-400', 
        bg: 'bg-slate-400/10', 
        gradient: 'from-gray-300 via-slate-100 to-gray-500',
        next: 100,
        desc: 'Active Student'
    };
    return { 
        label: 'Bronze Rookie', 
        icon: <Award className="h-6 w-6" />, 
        color: 'text-orange-700', 
        bg: 'bg-orange-700/10', 
        gradient: 'from-orange-600 via-amber-200 to-orange-900',
        next: 50,
        desc: 'Rising Talent'
    };
  };

  const badge = getBadgeDetails(user.credits);
  const currentProgress = Math.min((user.credits / badge.next) * 100, 100);

  // Calculate average score
  const averageScore = user.assessmentHistory && user.assessmentHistory.length > 0
    ? Math.round(user.assessmentHistory.reduce((acc, curr) => acc + (curr.score / curr.totalMarks) * 100, 0) / user.assessmentHistory.length)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Dashboard Header / Hero - using rounded-[2rem] as requested */}
      <div className="relative mb-12 rounded-[2rem] overflow-hidden bg-university-900 shadow-2xl p-8 md:p-12 text-white border border-white/5">
         <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
            <div className={`absolute top-[-20%] right-[-10%] w-[600px] h-[600px] opacity-20 rounded-full blur-[140px] bg-gradient-to-br ${badge.gradient}`}></div>
            <div className="absolute bottom-[-20%] left-[-5%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]"></div>
         </div>

         <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
            {/* Avatar with Animated Ring */}
            <div className="relative group shrink-0">
                <div className={`w-32 h-32 md:w-44 md:h-44 rounded-full p-1.5 bg-gradient-to-tr ${badge.gradient} animate-gradient-slow shadow-2xl`}>
                    <div className="w-full h-full rounded-full bg-slate-950 border-[6px] border-slate-950 flex items-center justify-center text-5xl md:text-6xl font-serif font-bold text-white shadow-inner relative overflow-hidden">
                        {user.name.charAt(0).toUpperCase()}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </div>
                </div>
                <div className={`absolute -bottom-1 -right-1 p-3 rounded-2xl shadow-2xl border-4 border-university-900 text-white bg-gradient-to-br ${badge.gradient} group-hover:scale-110 transition-transform`}>
                    {badge.icon}
                </div>
            </div>

            <div className="flex-1 text-center lg:text-left">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 ${badge.color} text-[10px] font-black tracking-[0.2em] uppercase shadow-lg`}>
                        <Sparkles className="h-3.5 w-3.5" /> {badge.label}
                    </div>
                    {user.credits > 10 && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                            <CheckCircle className="h-3 w-3 fill-current" /> Verified Student
                        </div>
                    )}
                </div>

                <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 tracking-tight leading-tight">
                    {user.name.split(' ')[0]} 
                    <span className="text-white/20 font-light mx-3 hidden md:inline">/</span>
                    <span className={`bg-gradient-to-r ${badge.gradient} bg-clip-text text-transparent`}>Command Hub</span>
                </h1>
                
                <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 mb-8 text-slate-400 text-sm font-medium">
                    <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"><Mail className="h-4 w-4 text-university-accent" /> {user.identifier}</span>
                    <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"><Building2 className="h-4 w-4 text-university-accent" /> {collegeName}</span>
                </div>

                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                    <button 
                        onClick={() => onNavigate('submit')}
                        className="px-10 py-4 rounded-2xl bg-university-accent hover:bg-amber-600 text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-amber-900/40 flex items-center gap-3 transition-all hover:scale-105 active:scale-95"
                    >
                        <Plus className="h-5 w-5" /> Upload Material
                    </button>
                    <button 
                        onClick={() => onNavigate('assessments')}
                        className="px-10 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest backdrop-blur-2xl border border-white/10 flex items-center gap-3 transition-all hover:scale-105 active:scale-95"
                    >
                        <Zap className="h-5 w-5 text-university-accent" /> Mock Test
                    </button>
                </div>
            </div>
         </div>
      </div>

      {/* Stats Cards - using rounded-[2rem] as requested */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Milestone Card */}
          <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-[2rem] p-10 shadow-xl border border-gray-100 dark:border-slate-800 flex flex-col md:flex-row gap-10 items-center relative overflow-hidden">
              <div className="flex-shrink-0 text-center relative z-10">
                  <div className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${badge.gradient} flex items-center justify-center text-white shadow-2xl mb-4 mx-auto transform rotate-3 group-hover:rotate-0 transition-transform`}>
                      <Award className="h-14 w-14" />
                  </div>
                  <div className="text-4xl font-black text-slate-900 dark:text-white mb-1">{user.credits}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Credits</div>
              </div>
              
              <div className="flex-1 w-full relative z-10">
                  <div className="flex justify-between items-end mb-4">
                      <div>
                          <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white">Tier Progress</h3>
                          <p className="text-xs text-slate-500 font-medium mt-1">Ascend to {getBadgeDetails(badge.next + 1).label}</p>
                      </div>
                      <div className="text-right">
                          <span className="text-3xl font-black text-university-accent">{badge.next - user.credits}</span>
                          <span className="text-[10px] font-black text-slate-400 ml-2 uppercase tracking-widest">Left</span>
                      </div>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-slate-800 h-5 rounded-full overflow-hidden p-1 border border-gray-200 dark:border-slate-700">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${badge.gradient} transition-all duration-1000 relative`}
                        style={{ width: `${currentProgress}%` }}
                      >
                          <div className="absolute inset-0 bg-white/30 animate-shine"></div>
                      </div>
                  </div>
                  <div className="flex justify-between mt-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      <span className={badge.color}>{badge.label}</span>
                      <span className="opacity-60">Grand Evolution</span>
                  </div>
              </div>
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${badge.gradient} opacity-[0.03] rounded-full -mr-16 -mt-16`}></div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-lg border border-gray-100 dark:border-slate-800 text-center flex flex-col items-center justify-center group hover:-translate-y-1 transition-all">
                  <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 mb-3 group-hover:scale-110 transition-transform">
                      <Bookmark className="h-6 w-6" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{actualSavedResources.length}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Library Items</div>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-lg border border-gray-100 dark:border-slate-800 text-center flex flex-col items-center justify-center group hover:-translate-y-1 transition-all">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 mb-3 group-hover:scale-110 transition-transform">
                      <TrendingUp className="h-6 w-6" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{averageScore}%</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Global Score</div>
              </div>
              <button 
                onClick={onLogout}
                className="col-span-2 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white rounded-[1.5rem] py-4 font-black text-[10px] uppercase tracking-[0.2em] transition-all border border-red-500/20 flex items-center justify-center gap-3 active:scale-95"
              >
                  <LogOut className="h-4 w-4" /> Sign Out Account
              </button>
          </div>
      </div>

      {/* Tabbed Area - using rounded-[2rem] as requested */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden min-h-[600px]">
          <div className="flex border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950 p-2 overflow-x-auto no-scrollbar gap-2">
              <TabBtn 
                active={activeTab === 'library'} 
                onClick={() => setActiveTab('library')} 
                icon={<BookOpen className="h-4 w-4" />} 
                label="My Resources" 
              />
              <TabBtn 
                active={activeTab === 'contributions'} 
                onClick={() => setActiveTab('contributions')} 
                icon={<History className="h-4 w-4" />} 
                label="Submission Hub" 
              />
              <TabBtn 
                active={activeTab === 'performance'} 
                onClick={() => setActiveTab('performance')} 
                icon={<BarChart3 className="h-4 w-4" />} 
                label="AI Analytics" 
              />
          </div>

          <div className="p-8 md:p-12">
              {activeTab === 'library' && (
                  <div className="animate-in fade-in slide-in-from-left-6 duration-700">
                      {savedSubjectIds.length > 0 && (
                          <div className="mb-12">
                              <h3 className="text-2xl font-serif font-bold text-university-900 dark:text-white mb-8 flex items-center gap-3">
                                  <div className="p-2.5 bg-rose-500/10 rounded-2xl"><Heart className="h-5 w-5 text-rose-500 fill-current" /></div> 
                                  Followed Subjects
                              </h3>
                              <div className="flex flex-wrap gap-4">
                                  {savedSubjectObjects.map(sub => (
                                      <div key={sub.id} className="flex items-center gap-4 px-6 py-4 bg-gray-50 dark:bg-slate-800/40 rounded-2xl border border-transparent hover:border-university-accent/30 transition-all group shadow-sm">
                                          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-md text-university-accent">
                                              <GraduationCap className="h-5 w-5" />
                                          </div>
                                          <span className="font-black text-slate-800 dark:text-slate-200 text-sm">{sub.name}</span>
                                          <button 
                                              onClick={() => onToggleFavorite(sub.id)}
                                              className="ml-2 text-slate-300 hover:text-red-500 transition-colors"
                                          >
                                              <XCircleIcon />
                                          </button>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )}

                      <h3 className="text-2xl font-serif font-bold text-university-900 dark:text-white mb-10 flex items-center gap-3">
                          <div className="p-2.5 bg-university-accent/10 rounded-2xl"><Bookmark className="h-5 w-5 text-university-accent fill-current" /></div> 
                          Saved Documents
                      </h3>
                      {actualSavedResources.length > 0 ? (
                          <ResourceList 
                            resources={actualSavedResources}
                            user={user}
                            onLogin={() => {}}
                            favorites={user.savedResources}
                            onToggleFavorite={onToggleFavorite}
                            onNavigate={onNavigate}
                          />
                      ) : (
                          <EmptyState 
                            icon={<FileText />} 
                            title="Library is Empty" 
                            desc="Materials you save while browsing Ranchi University honors papers will appear here for quick access." 
                            actionLabel="Browse Vault"
                            onAction={() => onNavigate('subjects')}
                          />
                      )}
                  </div>
              )}

              {activeTab === 'contributions' && (
                  <div className="animate-in fade-in slide-in-from-right-6 duration-700">
                      <div className="bg-university-900 rounded-[2rem] p-10 text-white mb-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-university-accent/10 to-transparent opacity-30"></div>
                          <div className="max-w-md text-center md:text-left relative z-10">
                              <h3 className="text-3xl font-serif font-bold mb-4">Peer Contribution</h3>
                              <p className="text-slate-400 font-medium mb-6">Earn <span className="text-university-accent font-black">5 Credits</span> for every verified PDF. Rank up to unlock student awards.</p>
                              <button 
                                onClick={() => onNavigate('submit')}
                                className="px-10 py-3.5 bg-university-accent text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-lg hover:bg-amber-600 transition-all flex items-center gap-2 mx-auto md:mx-0 active:scale-95"
                              >
                                 <Plus className="h-4 w-4" /> Start Submission
                              </button>
                          </div>
                          <div className="grid grid-cols-2 gap-4 w-full md:w-auto relative z-10">
                              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center backdrop-blur-md">
                                  <div className={`text-4xl font-black ${badge.color} mb-1`}>0</div>
                                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">Approved</div>
                              </div>
                              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center backdrop-blur-md">
                                  <div className="text-4xl font-black text-slate-300 mb-1">0</div>
                                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">Pending</div>
                              </div>
                          </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-slate-800/20 rounded-[2rem] border border-gray-100 dark:border-slate-800 overflow-hidden">
                          <table className="w-full text-left text-sm">
                              <thead className="bg-white dark:bg-slate-800 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-gray-100 dark:border-slate-700">
                                  <tr>
                                      <th className="px-8 py-6">Resource</th>
                                      <th className="px-8 py-6">Date</th>
                                      <th className="px-8 py-6">Status</th>
                                      <th className="px-8 py-6 text-right">Award</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr className="hover:bg-white dark:hover:bg-slate-800/50 transition-colors">
                                      <td colSpan={4} className="px-8 py-24 text-center">
                                          <div className="flex flex-col items-center gap-6 text-slate-400">
                                              <div className="p-6 rounded-full bg-slate-100 dark:bg-slate-900">
                                                <History className="h-10 w-10 opacity-30" />
                                              </div>
                                              <div>
                                                <p className="font-serif text-2xl italic mb-1">No Activity Found</p>
                                                <p className="text-xs font-bold uppercase tracking-widest opacity-60">Help the community to earn credits</p>
                                              </div>
                                          </div>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                      </div>
                  </div>
              )}

              {activeTab === 'performance' && (
                  <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                      <div className="flex justify-between items-center mb-10">
                          <div>
                            <h3 className="text-3xl font-serif font-bold text-university-900 dark:text-white">Skill Analysis</h3>
                            <p className="text-slate-500 text-sm font-medium">Your progress across AI assessments</p>
                          </div>
                          <button 
                            onClick={() => onNavigate('assessment-history')}
                            className="flex items-center gap-2 text-university-accent font-black text-[10px] uppercase tracking-widest hover:underline"
                          >
                             View Records <ArrowRight className="h-4 w-4" />
                          </button>
                      </div>

                      {user.assessmentHistory && user.assessmentHistory.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             {user.assessmentHistory.slice(0, 4).map(test => (
                                 <div key={test.id} className="p-8 rounded-[2rem] bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800 flex items-center justify-between group hover:border-university-accent/30 transition-all shadow-sm">
                                     <div className="flex items-center gap-6">
                                         <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center font-serif text-3xl font-black text-university-900 dark:text-white group-hover:scale-110 transition-transform">
                                             {Math.round((test.score/test.totalMarks)*100)}%
                                         </div>
                                         <div>
                                             <h4 className="font-black text-xl text-slate-900 dark:text-white group-hover:text-university-accent transition-colors leading-tight">{test.subjectName}</h4>
                                             <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">
                                                <Clock className="h-3 w-3" /> {new Date(test.date).toLocaleDateString()}
                                             </div>
                                         </div>
                                     </div>
                                     <div className="text-right">
                                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Final Score</span>
                                         <span className="text-xl font-black text-slate-700 dark:text-slate-200">{test.score}/{test.totalMarks}</span>
                                     </div>
                                 </div>
                             ))}
                          </div>
                      ) : (
                          <EmptyState 
                             icon={<TrendingUp />} 
                             title="No Data Logged" 
                             desc="Use our AI engine to simulate mock exams for your honors course and track your growth." 
                             actionLabel="Start AI Test"
                             onAction={() => onNavigate('assessments')}
                          />
                      )}
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const TabBtn = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-4 px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] transition-all border-b-4 whitespace-nowrap ${active ? 'border-university-accent text-university-900 dark:text-white bg-university-accent/5 shadow-inner' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
    >
        {/* Fix: cast icon to React.ReactElement<any> to avoid className type error */}
        {React.cloneElement(icon as React.ReactElement<any>, { className: `h-5 w-5 ${active ? 'text-university-accent' : ''}` })}
        {label}
    </button>
);

const EmptyState = ({ icon, title, desc, actionLabel, onAction }: { icon: any, title: string, desc: string, actionLabel: string, onAction: () => void }) => (
    <div className="text-center py-24 px-8 bg-gray-50 dark:bg-slate-800/20 rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-slate-800">
        <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 text-slate-200 shadow-xl border border-gray-100 dark:border-slate-700">
            {/* Fix: cast icon to React.ReactElement<any> to avoid className type error */}
            {React.cloneElement(icon as React.ReactElement<any>, { className: 'h-12 w-12 opacity-40 text-university-accent' })}
        </div>
        <h4 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-4">{title}</h4>
        <p className="text-slate-500 dark:text-gray-400 max-w-sm mx-auto mb-10 text-lg leading-relaxed">{desc}</p>
        <button 
            onClick={onAction}
            className="px-14 py-4 bg-university-900 dark:bg-university-accent text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-2xl active:scale-95"
        >
            {actionLabel}
        </button>
    </div>
);

const XCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
);

export default UserProfile;