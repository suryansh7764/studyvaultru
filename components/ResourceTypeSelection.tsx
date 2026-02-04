import React from 'react';
import { ResourceType } from '../types';
import { FileQuestion, FileText, Book, ArrowRight } from 'lucide-react';

interface ResourceTypeSelectionProps {
  onSelectType: (type: ResourceType) => void;
}

const ResourceTypeSelection: React.FC<ResourceTypeSelectionProps> = ({ onSelectType }) => {
  const types = [
    {
      id: ResourceType.NOTE,
      title: 'Lecture Notes',
      description: 'Comprehensive chapter-wise notes and summaries.',
      image: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?q=80&w=800&auto=format&fit=crop',
      icon: <FileText className="h-6 w-6" />
    },
    {
      id: ResourceType.SYLLABUS,
      title: 'Syllabus',
      description: 'Detailed course structure and reading lists.',
      image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=800&auto=format&fit=crop',
      icon: <Book className="h-6 w-6" />
    },
    {
      id: ResourceType.PYQ,
      title: 'Previous Year Papers',
      description: 'Exam papers from previous years for practice.',
      image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=800&auto=format&fit=crop',
      icon: <FileQuestion className="h-6 w-6" />
    }
  ];

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif font-bold text-university-900 dark:text-white mb-3">Select Material Type</h2>
        <p className="text-gray-500 dark:text-gray-400">What kind of resource are you looking for today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {types.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectType(item.id)}
            className="group relative h-96 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 text-left flex flex-col"
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black/90 group-hover:via-black/70 transition-colors duration-300" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-8 flex flex-col h-full text-white">
              <div className="bg-white/20 backdrop-blur-md w-12 h-12 rounded-xl flex items-center justify-center mb-auto border border-white/10 group-hover:bg-university-accent group-hover:border-transparent transition-colors duration-300">
                {item.icon}
              </div>

              <div>
                <h3 className="text-2xl font-serif font-bold mb-2 group-hover:text-university-accent transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  {item.description}
                </p>
                
                <div className="flex items-center gap-2 font-medium text-sm group-hover:translate-x-2 transition-transform duration-300 text-university-accent">
                  <span>View Materials</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
            
            {/* Border glow effect on hover */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-university-accent/50 rounded-2xl pointer-events-none transition-colors duration-300" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ResourceTypeSelection;