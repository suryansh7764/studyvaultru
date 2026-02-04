import React from 'react';
import { COLLEGES, SEMESTERS, PATTERNS, DEGREE_LEVELS, YEARS } from '../constants';
import { FilterState } from '../types';
import { Filter, ChevronDown } from 'lucide-react';

interface FilterSectionProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: any) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ filters, onFilterChange }) => {
  
  // Determine available semesters based on selected pattern
  const availableSemesters = filters.pattern === 'CBCS' 
    ? SEMESTERS.filter(s => s <= 6)
    : SEMESTERS;

  return (
    <div className="bg-white dark:bg-slate-900 shadow-sm border border-gray-200 dark:border-slate-800 rounded-xl p-4 mb-6 transition-colors">
      <div className="flex flex-col xl:flex-row items-start xl:items-center gap-4">
        <div className="flex items-center gap-2 text-university-900 dark:text-white font-semibold mr-4 min-w-fit">
          <Filter className="h-5 w-5 text-university-accent" />
          <span className="whitespace-nowrap">Filter Results</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
            {/* College Select */}
            <div className="relative">
              <select
                className="appearance-none w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 py-2.5 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-university-accent dark:focus:border-university-accent transition-colors text-sm"
                value={filters.collegeId}
                onChange={(e) => onFilterChange('collegeId', e.target.value)}
              >
                {COLLEGES.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-400">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>

            {/* Degree Level Select */}
            <div className="relative">
              <select
                className="appearance-none w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 py-2.5 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-university-accent dark:focus:border-university-accent transition-colors text-sm"
                value={filters.degreeLevel}
                onChange={(e) => onFilterChange('degreeLevel', e.target.value)}
              >
                {DEGREE_LEVELS.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-400">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>

             {/* Pattern Select */}
             <div className="relative">
              <select
                className="appearance-none w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 py-2.5 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-university-accent dark:focus:border-university-accent transition-colors text-sm"
                value={filters.pattern}
                onChange={(e) => onFilterChange('pattern', e.target.value)}
              >
                {PATTERNS.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-400">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>

            {/* Semester Select */}
            <div className="relative">
              <select
                className="appearance-none w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 py-2.5 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-university-accent dark:focus:border-university-accent transition-colors text-sm"
                value={filters.semester}
                onChange={(e) => onFilterChange('semester', e.target.value === '' ? '' : Number(e.target.value))}
              >
                <option value="">All Semesters</option>
                {availableSemesters.map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-400">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>

             {/* Exam Year Select */}
             <div className="relative">
              <select
                className="appearance-none w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 py-2.5 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-university-accent dark:focus:border-university-accent transition-colors text-sm"
                value={filters.year}
                onChange={(e) => onFilterChange('year', e.target.value === '' ? '' : Number(e.target.value))}
              >
                <option value="">All Years</option>
                {YEARS.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-400">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;