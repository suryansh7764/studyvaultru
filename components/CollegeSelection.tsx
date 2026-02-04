
import React, { useState } from 'react';
import { COLLEGES } from '../constants';
import { Building2, ChevronRight, MapPin, Search, GraduationCap } from 'lucide-react';

interface CollegeSelectionProps {
  onSelectCollege: (collegeId: string) => void;
}

const CollegeSelection: React.FC<CollegeSelectionProps> = ({ onSelectCollege }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const collegeImages = [
    "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1000&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=1000&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=1000&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1626379953822-baec19c3accd?q=80&w=1000&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1607237138186-73a630026e63?q=80&w=1000&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?q=80&w=1000&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=1000&auto=format&fit=crop", 
  ];

  const getCollegeImage = (index: number) => {
    return collegeImages[index % collegeImages.length];
  };

  const filteredColleges = COLLEGES.filter(college => 
    college.id !== 'all' && college.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-university-accent/10 text-university-accent text-xs font-bold tracking-widest uppercase mb-6">
           <GraduationCap className="h-4 w-4" />
           Step 3: Institution
        </div>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-university-900 dark:text-white mb-6">
          Affiliated Colleges
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg mb-10">
          Find materials specific to your college's department and examination history.
        </p>

        <div className="max-w-xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-university-accent transition-colors">
                <Search className="h-6 w-6" />
            </div>
            <input
                type="text"
                className="block w-full pl-14 pr-4 py-5 border-2 border-gray-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-university-accent/10 focus:border-university-accent text-gray-900 dark:text-white shadow-xl transition-all text-lg"
                placeholder="Search colleges (e.g., Doranda, Marwari)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
        {filteredColleges.length > 0 ? (
          filteredColleges.map((college, index) => (
            <button
              key={college.id}
              onClick={() => onSelectCollege(college.id)}
              className="group relative h-44 w-full overflow-hidden rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-lg hover:shadow-2xl transition-all duration-500 text-left border border-gray-100 dark:border-slate-800"
            >
              <div className="absolute inset-0 z-0">
                 <img 
                   src={getCollegeImage(index)}
                   alt=""
                   className="w-full h-full object-cover opacity-10 group-hover:opacity-25 transition-all duration-700 transform scale-100 group-hover:scale-110"
                 />
                 <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-slate-900 dark:via-slate-900/80"></div>
              </div>

              <div className="relative z-10 h-full px-8 flex items-center gap-6">
                <div className="flex-shrink-0">
                   <div className="w-20 h-20 rounded-[2rem] flex items-center justify-center bg-white dark:bg-slate-800 shadow-xl border border-gray-100 dark:border-slate-700 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 overflow-hidden p-2">
                      {college.logo ? (
                        <img 
                          src={college.logo} 
                          alt={college.name} 
                          className="w-full h-full object-contain" 
                        />
                      ) : (
                        <Building2 className="h-10 w-10 text-university-accent/30 group-hover:text-university-accent transition-colors" />
                      )}
                   </div>
                </div>
                
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-white group-hover:text-university-accent transition-colors leading-tight mb-2 line-clamp-2">
                    {college.name}
                  </h3>
                  <div className="flex items-center text-xs font-bold text-gray-400 dark:text-gray-500 gap-2 group-hover:text-university-900 dark:group-hover:text-gray-300 transition-colors uppercase tracking-widest">
                     <MapPin className="h-4 w-4 text-university-accent/60" />
                     <span>Ranchi University</span>
                  </div>
                </div>

                <div className="flex-shrink-0 opacity-0 -translate-x-8 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                   <div className="bg-university-accent text-white p-3 rounded-2xl shadow-xl shadow-university-accent/20">
                      <ChevronRight className="h-6 w-6" />
                   </div>
                </div>
              </div>
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-university-accent/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-university-accent/15 transition-all"></div>
              <div className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-university-accent to-transparent w-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
            </button>
          ))
        ) : (
          <div className="col-span-full text-center py-24 bg-gray-50 dark:bg-slate-900/50 rounded-[3rem] border-4 border-dashed border-gray-200 dark:border-slate-800">
            <Search className="h-16 w-16 text-gray-300 dark:text-slate-700 mx-auto mb-6" />
            <p className="text-2xl text-gray-500 dark:text-gray-400 font-serif font-bold">No colleges matching your search</p>
            <button 
                onClick={() => setSearchQuery('')}
                className="mt-6 text-university-accent font-bold hover:underline bg-university-accent/5 px-6 py-2 rounded-full"
            >
                Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegeSelection;
