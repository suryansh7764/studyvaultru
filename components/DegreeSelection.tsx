import React from 'react';
import { DegreeLevel } from '../types';
import { GraduationCap, ScrollText, ArrowRight } from 'lucide-react';

interface DegreeSelectionProps {
  onSelectDegree: (degree: DegreeLevel) => void;
}

const DegreeSelection: React.FC<DegreeSelectionProps> = ({ onSelectDegree }) => {
  return (
    <div className="max-w-5xl mx-auto px-4">
      <h2 className="text-3xl font-serif font-bold text-center text-university-900 dark:text-white mb-8">Select Degree Level</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* UG Card */}
        <button
          onClick={() => onSelectDegree(DegreeLevel.UG)}
          className="group relative h-80 overflow-hidden rounded-3xl text-left shadow-lg hover:shadow-2xl transition-all duration-500"
        >
          {/* Background Image - Students holding degrees */}
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop" 
              alt="Undergraduate Students Group" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 group-hover:via-black/60 transition-colors duration-300"></div>
          </div>

          <div className="relative z-10 p-8 flex flex-col h-full justify-end">
            <div className="bg-blue-600/90 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
              <GraduationCap className="h-8 w-8" />
            </div>
            
            <h3 className="text-3xl font-serif font-bold text-white mb-2 leading-tight">
              Undergraduate <span className="text-blue-400">(UG)</span>
            </h3>
            
            <p className="text-gray-200 mb-6 text-sm font-medium opacity-90">
              Bachelor's degrees (B.A., B.Sc., B.Com, Vocational).
            </p>
            
            <div className="flex items-center text-white font-bold group-hover:gap-3 transition-all">
              <span>Explore Courses</span>
              <ArrowRight className="h-5 w-5 ml-2" />
            </div>
          </div>
        </button>

        {/* PG Card */}
        <button
          onClick={() => onSelectDegree(DegreeLevel.PG)}
          className="group relative h-80 overflow-hidden rounded-3xl text-left shadow-lg hover:shadow-2xl transition-all duration-500"
        >
          {/* Background Image - Academic Books/Research */}
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1000&auto=format&fit=crop" 
              alt="Postgraduate Books and Research" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 group-hover:via-black/60 transition-colors duration-300"></div>
          </div>

          <div className="relative z-10 p-8 flex flex-col h-full justify-end">
            <div className="bg-rose-600/90 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
              <ScrollText className="h-8 w-8" />
            </div>
            
            <h3 className="text-3xl font-serif font-bold text-white mb-2 leading-tight">
              Postgraduate <span className="text-rose-400">(PG)</span>
            </h3>
            
            <p className="text-gray-200 mb-6 text-sm font-medium opacity-90">
              Master's degrees (M.A., M.Sc., M.Com, MBA, MCA).
            </p>
            
            <div className="flex items-center text-white font-bold group-hover:gap-3 transition-all">
              <span>Explore Courses</span>
              <ArrowRight className="h-5 w-5 ml-2" />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default DegreeSelection;