
import React from 'react';
import { Resource, ResourceType, User } from '../types';
import { FileText, FileQuestion, Book, Sparkles, Download, ArrowRight } from 'lucide-react';
import { SUBJECTS } from '../constants';

interface LatestResourcesProps {
  resources: Resource[];
  onViewMore: () => void;
  onDownload: (url: string) => void;
}

const LatestResources: React.FC<LatestResourcesProps> = ({ resources, onViewMore, onDownload }) => {
  // Sort by createdAt desc and take top 5
  const latest = [...resources]
    .filter(r => r.id !== 'sample-placeholder')
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 5);

  if (latest.length === 0) return null;

  return (
    <div className="mb-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-university-accent/10 text-university-accent text-[10px] font-bold tracking-widest uppercase mb-3">
              <Sparkles className="h-3 w-3" /> Just Added
           </div>
           <h2 className="text-3xl font-serif font-bold text-university-900 dark:text-white">Latest Discoveries</h2>
           <p className="text-gray-500 dark:text-gray-400 mt-1">Freshly published materials from the community.</p>
        </div>
        <button 
           onClick={onViewMore}
           className="group flex items-center gap-2 text-university-accent font-bold text-sm hover:underline"
        >
           View Full Library <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
         {latest.map((res) => {
            const subjectName = SUBJECTS.find(s => s.id === res.subjectId)?.name || res.subjectId;
            return (
                <div 
                  key={res.id} 
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className={`p-2 rounded-lg bg-gray-50 dark:bg-slate-800 ${
                            res.type === ResourceType.PYQ ? 'text-blue-500' : 
                            res.type === ResourceType.NOTE ? 'text-amber-500' : 'text-purple-500'
                        }`}>
                           {res.type === ResourceType.PYQ ? <FileQuestion className="h-5 w-5" /> : 
                            res.type === ResourceType.NOTE ? <FileText className="h-5 w-5" /> : <Book className="h-5 w-5" />}
                        </div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase bg-gray-50 dark:bg-slate-800 px-2 py-1 rounded">Sem {res.semester}</span>
                    </div>

                    <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1 line-clamp-2 leading-tight group-hover:text-university-accent transition-colors">
                        {res.title}
                    </h4>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-4">{subjectName}</p>

                    <div className="mt-auto pt-4 border-t border-gray-50 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-[10px] text-gray-400 font-medium">{res.size}</span>
                        <button 
                           onClick={() => onDownload(res.downloadUrl)}
                           className="text-university-accent p-1.5 rounded-lg hover:bg-university-accent/5 transition-colors"
                        >
                           <Download className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            );
         })}
      </div>
    </div>
  );
};

export default LatestResources;