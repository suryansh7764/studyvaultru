import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Resource, ResourceType } from '../types';
import { COLLEGES, SUBJECTS } from '../constants';

interface StatsSectionProps {
  resources: Resource[];
}

const StatsSection: React.FC<StatsSectionProps> = ({ resources }) => {
  // Aggregate data for the chart: Count by Resource Type
  const data = [
    { name: 'Question Papers', count: resources.filter(r => r.type === ResourceType.PYQ).length, color: '#0f172a' },
    { name: 'Lecture Notes', count: resources.filter(r => r.type === ResourceType.NOTE).length, color: '#d97706' },
    { name: 'Syllabus', count: resources.filter(r => r.type === ResourceType.SYLLABUS).length, color: '#475569' },
  ];

  // Calculate dynamic counts (subtracting 1 to exclude the 'All' option)
  const collegesCount = Math.max(0, COLLEGES.length - 1);
  const subjectsCount = Math.max(0, SUBJECTS.length - 1);

  // Calculate total downloads
  const totalDownloads = resources.reduce((sum, res) => sum + res.downloadCount, 0);
  const formattedDownloads = totalDownloads > 1000 ? `${(totalDownloads / 1000).toFixed(1)}k+` : totalDownloads;

  return (
    <div id="stats" className="bg-white dark:bg-slate-900 py-16 sm:py-24 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between mb-12">
          <div className="max-w-xl">
            <h2 className="text-3xl font-serif font-bold text-university-900 dark:text-white sm:text-4xl">
              Growing Database
            </h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
              We are constantly updating our repository with the latest materials from all semesters and departments.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Chart */}
          <div className="h-full min-h-[320px] w-full bg-gray-50 dark:bg-slate-800 rounded-2xl p-6 shadow-inner flex flex-col justify-center">
             <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#fff' }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={60}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
             </ResponsiveContainer>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
             {/* 1. Total Documents */}
             <div className="bg-university-light dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 flex flex-col justify-center">
                <p className="text-3xl sm:text-4xl font-bold text-university-900 dark:text-white">{resources.length}+</p>
                <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base font-medium">Total Documents</p>
             </div>

             {/* 2. Colleges */}
             <div className="bg-university-light dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 flex flex-col justify-center">
                <p className="text-3xl sm:text-4xl font-bold text-university-accent">{collegesCount}</p>
                <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base font-medium">Affiliated Colleges</p>
             </div>

             {/* 3. Departments */}
             <div className="bg-university-light dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 flex flex-col justify-center">
                <p className="text-3xl sm:text-4xl font-bold text-university-900 dark:text-white">{subjectsCount}</p>
                <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base font-medium">Departments</p>
             </div>

             {/* 4. Semesters */}
             <div className="bg-university-light dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 flex flex-col justify-center">
                <p className="text-3xl sm:text-4xl font-bold text-university-accent">8</p>
                <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base font-medium">Semesters</p>
             </div>

             {/* 5. Downloads */}
             <div className="bg-university-light dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 flex flex-col justify-center">
                <p className="text-3xl sm:text-4xl font-bold text-university-900 dark:text-white">{formattedDownloads}</p>
                <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base font-medium">Downloads</p>
             </div>

             {/* 6. Visitors */}
             <div className="bg-university-light dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 flex flex-col justify-center">
                <p className="text-3xl sm:text-4xl font-bold text-university-accent">1.2k+</p>
                <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base font-medium">Daily Visitors</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;