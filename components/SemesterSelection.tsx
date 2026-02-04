import React from 'react';
import { CoursePattern, DegreeLevel } from '../types';
import { Layers, ChevronRight, BookOpen } from 'lucide-react';

interface SemesterSelectionProps {
  pattern: CoursePattern;
  degree: DegreeLevel;
  onSelectSemester: (semester: number) => void;
}

const SemesterSelection: React.FC<SemesterSelectionProps> = ({ pattern, degree, onSelectSemester }) => {
  // Determine number of semesters
  let totalSemesters = 6; // Default CBCS UG
  
  if (degree === DegreeLevel.PG) {
    totalSemesters = 4;
  } else if (pattern === CoursePattern.NEP) {
    totalSemesters = 8;
  }

  const semesters = Array.from({ length: totalSemesters }, (_, i) => i + 1);

  // Curated images for each semester to provide visual variety
  const getSemesterImage = (sem: number) => {
    const images = [
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=800&auto=format&fit=crop", // Sem 1: Fresh start/Planner
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop", // Sem 2: Books
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop", // Sem 3: Group/Collaboration
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop", // Sem 4: Writing/Exam
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=800&auto=format&fit=crop", // Sem 5: Focus/Coffee
      "https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?q=80&w=800&auto=format&fit=crop", // Sem 6: Graduation/Finals
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop", // Sem 7: Research/Lab
      "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=800&auto=format&fit=crop", // Sem 8: Success/Graduation (Updated)
    ];
    return images[(sem - 1) % images.length];
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif font-bold text-university-900 dark:text-white mb-3">Select Semester</h2>
        <p className="text-gray-500 dark:text-gray-400 font-medium">
             <span className="bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full text-sm">
                {degree === DegreeLevel.UG ? 'Undergraduate' : 'Postgraduate'}
             </span>
             <span className="mx-2 text-gray-300">•</span>
             <span className="bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full text-sm">
                {pattern === CoursePattern.NEP ? 'NEP Pattern' : 'CBCS Pattern'}
             </span>
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {semesters.map((sem) => (
          <button
            key={sem}
            onClick={() => onSelectSemester(sem)}
            className="group relative h-48 overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 text-left"
          >
             {/* Background Image */}
             <div className="absolute inset-0">
                <img 
                    src={getSemesterImage(sem)}
                    alt={`Semester ${sem} Background`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-university-900/90 via-university-900/50 to-university-900/30 group-hover:via-university-900/40 transition-colors duration-300"></div>
             </div>

             <div className="relative z-10 p-6 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 group-hover:bg-university-accent group-hover:border-university-accent transition-all duration-300">
                        <span className="text-2xl font-bold text-white font-serif">{sem}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
                
                <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-university-accent transition-colors">Semester {sem}</h3>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-300 group-hover:text-white transition-colors">
                        <BookOpen className="h-3 w-3" />
                        <span>View Resources</span>
                    </div>
                </div>
             </div>
             
             {/* Decorative Stripe */}
             <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-university-accent to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SemesterSelection;