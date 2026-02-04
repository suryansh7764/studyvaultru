
import React from 'react';
import { User, Resource } from '../types';
import { User as UserIcon, Building2, Award, Mail, BookOpen, LogOut, Heart, FileText } from 'lucide-react';
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
  const collegeName = COLLEGES.find(c => c.id === user.collegeId)?.name || 'Unknown College';

  // Separate resources and subjects based on ID pattern or existence in SUBJECTS
  const savedSubjectIds = user.savedResources?.filter(id => SUBJECTS.some(s => s.id === id)) || [];
  const savedSubjectObjects = SUBJECTS.filter(s => savedSubjectIds.includes(s.id));
  
  // Resources are already filtered by parent based on saved IDs, but let's double check they are actual resources
  const actualSavedResources = savedResources.filter(r => !savedSubjectIds.includes(r.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar: User Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-slate-800 text-center relative overflow-hidden">
             <div className="w-24 h-24 bg-gradient-to-br from-university-accent to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold shadow-lg">
                {user.name.charAt(0).toUpperCase()}
             </div>
             <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{user.name}</h2>
             <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{user.identifier}</p>
             
             <div className="space-y-4 text-left">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
                   <Building2 className="h-5 w-5 text-gray-400" />
                   <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400">Institution</p>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200 line-clamp-1" title={collegeName}>{collegeName}</p>
                   </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
                   <Award className="h-5 w-5 text-university-accent" />
                   <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400">Credits Earned</p>
                      <p className="text-sm font-bold text-university-accent">{user.credits}</p>
                   </div>
                </div>
             </div>

             <button 
               onClick={onLogout}
               className="w-full mt-6 py-3 rounded-xl border-2 border-red-100 dark:border-red-900/30 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2"
             >
               <LogOut className="h-4 w-4" /> Sign Out
             </button>
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-3 space-y-8">
           <div className="flex items-center justify-between">
              <div>
                 <h1 className="text-3xl font-serif font-bold text-university-900 dark:text-white">My Profile</h1>
                 <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account and liked items</p>
              </div>
           </div>

           {/* Liked Subjects Section */}
           {savedSubjectObjects.length > 0 && (
               <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-slate-800 pb-4">
                     <div className="bg-red-500/10 p-2 rounded-lg text-red-500">
                        <Heart className="h-6 w-6" />
                     </div>
                     <h3 className="text-xl font-bold text-gray-900 dark:text-white">Liked Subjects</h3>
                     <span className="ml-auto bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-bold">
                        {savedSubjectObjects.length}
                     </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {savedSubjectObjects.map(subject => (
                          <div key={subject.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-slate-700 transition-all">
                              <span className="font-bold text-gray-800 dark:text-gray-200">{subject.name}</span>
                              <button 
                                onClick={() => onToggleFavorite(subject.id)}
                                className="text-red-500 hover:text-gray-400 transition-colors p-1"
                                title="Remove from likes"
                              >
                                  <Heart className="h-5 w-5 fill-current" />
                              </button>
                          </div>
                      ))}
                  </div>
               </div>
           )}

           {/* Saved Resources Section */}
           <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-slate-800 min-h-[400px]">
              <div className="flex items-center gap-3 mb-8 border-b border-gray-100 dark:border-slate-800 pb-4">
                 <div className="bg-university-accent/10 p-2 rounded-lg text-university-accent">
                    <FileText className="h-6 w-6" />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white">Saved Documents</h3>
                 <span className="ml-auto bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-bold">
                    {actualSavedResources.length} Items
                 </span>
              </div>

              {actualSavedResources.length > 0 ? (
                 <ResourceList 
                    resources={actualSavedResources}
                    user={user}
                    onLogin={() => {}} // User is already logged in
                    favorites={user.savedResources}
                    onToggleFavorite={onToggleFavorite}
                 />
              ) : (
                 <div className="text-center py-20">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                       <BookOpen className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">No saved documents</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto mb-6">
                       Browse the library and click the heart icon to save materials here.
                    </p>
                    <button 
                       onClick={() => onNavigate('subjects')}
                       className="px-6 py-2 bg-university-accent text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                    >
                       Browse Library
                    </button>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
