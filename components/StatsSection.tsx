import React from 'react';
import { Resource } from '../types.ts';
import { COLLEGES, SUBJECTS } from '../constants.ts';
import { 
  FileText, Building2, Users, GraduationCap
} from 'lucide-react';

interface StatsSectionProps {
  resources: Resource[];
}

const StatsSection: React.FC<StatsSectionProps> = ({ resources }) => {
  const collegesCount = Math.max(0, COLLEGES.length - 1);
  const subjectsCount = Math.max(0, SUBJECTS.length - 1);

  return (
    <div id="stats" className="bg-gray-50 dark:bg-slate-950 py-16 transition-colors relative overflow-hidden border-t border-gray-100 dark:border-slate-900">
      {/* Subtle Background Decoration */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-university-accent/5 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 blur-[80px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center">
          
          {/* Header Section */}
          <div className="text-center mb-12">
             <div className="inline-flex items-center gap-2 mb-4">
                <span className="h-px w-8 bg-university-accent"></span>
                <span className="text-[10px] font-bold text-university-accent uppercase tracking-[0.25em]">Database Statistics</span>
                <span className="h-px w-8 bg-university-accent"></span>
             </div>
             <h2 className="text-4xl font-serif font-bold text-gray-900 dark:text-white leading-tight mb-4">
               Our <span className="text-university-accent">Academic</span> Repository
             </h2>
             <p className="text-base text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto">
               Providing comprehensive coverage across all affiliated institutions and honors departments of Ranchi University.
             </p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
             <MiniStatCard 
                icon={<FileText className="h-5 w-5" />} 
                label="Resources" 
                value={`${resources.length}+`} 
                color="amber"
             />
             <MiniStatCard 
                icon={<Building2 className="h-5 w-5" />} 
                label="Colleges" 
                value={collegesCount} 
                color="blue"
             />
             <MiniStatCard 
                icon={<Users className="h-5 w-5" />} 
                label="Honors" 
                value={subjectsCount} 
                color="purple"
             />
             <MiniStatCard 
                icon={<GraduationCap className="h-5 w-5" />} 
                label="Semesters" 
                value="8" 
                color="emerald"
             />
          </div>
        </div>
      </div>
    </div>
  );
};

const MiniStatCard = ({ icon, label, value, color }: { icon: any, label: string, value: string | number, color: string }) => {
    const colorMap: Record<string, string> = {
        amber: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10 border-amber-100/50 dark:border-amber-500/20',
        blue: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10 border-blue-100/50 dark:border-blue-500/20',
        purple: 'text-purple-500 bg-purple-50 dark:bg-purple-500/10 border-purple-100/50 dark:border-purple-500/20',
        emerald: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100/50 dark:border-emerald-500/20',
    };

    return (
        <div className={`p-6 rounded-3xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex items-center gap-5 bg-white dark:bg-slate-900/60 ${colorMap[color]}`}>
            <div className={`p-3.5 rounded-2xl ${colorMap[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none tracking-tight">{value}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">{label}</p>
            </div>
        </div>
    );
};

export default StatsSection;