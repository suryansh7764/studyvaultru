import React from 'react';
import { CoursePattern } from '../types';
import { BookOpen, Sparkles, ArrowRight } from 'lucide-react';

interface PatternSelectionProps {
  onSelectPattern: (pattern: CoursePattern) => void;
}

const PatternSelection: React.FC<PatternSelectionProps> = ({ onSelectPattern }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-serif font-bold text-center text-university-900 dark:text-white mb-8">Select Course Pattern</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* NEP Card */}
        <button
          onClick={() => onSelectPattern(CoursePattern.NEP)}
          className="group relative h-80 overflow-hidden rounded-2xl p-8 text-left shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-end"
        >
          {/* Background Image - Modern Bookshelf */}
          <div className="absolute inset-0">
             <img 
               src="https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=1000&auto=format&fit=crop" 
               alt="NEP Pattern Background" 
               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 group-hover:via-black/70 transition-colors duration-300"></div>
          </div>

          <div className="relative z-10">
            <div className="bg-purple-600/90 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">NEP (New Education Policy)</h3>
            <p className="text-gray-200 mb-6 text-sm font-medium opacity-90">
              For sessions starting from 2022 onwards. 4-year undergraduate program structure.
            </p>
            <div className="flex items-center text-white font-bold group-hover:gap-3 transition-all">
              <span>Select NEP</span>
              <ArrowRight className="h-5 w-5 ml-2" />
            </div>
          </div>
        </button>

        {/* CBCS Card */}
        <button
          onClick={() => onSelectPattern(CoursePattern.CBCS)}
          className="group relative h-80 overflow-hidden rounded-2xl p-8 text-left shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-end"
        >
          {/* Background Image - Classic Library Shelves */}
          <div className="absolute inset-0">
             <img 
               src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1000&auto=format&fit=crop" 
               alt="CBCS Pattern Background" 
               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 group-hover:via-black/70 transition-colors duration-300"></div>
          </div>

          <div className="relative z-10">
            <div className="bg-teal-600/90 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">CBCS (Old Pattern)</h3>
            <p className="text-gray-200 mb-6 text-sm font-medium opacity-90">
              Choice Based Credit System. For sessions prior to 2022. 3-year degree program.
            </p>
            <div className="flex items-center text-white font-bold group-hover:gap-3 transition-all">
              <span>Select CBCS</span>
              <ArrowRight className="h-5 w-5 ml-2" />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default PatternSelection;