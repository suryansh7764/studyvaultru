import React from 'react';
import { ResourceType } from '../types';
import { FileQuestion, FileText, Book, ArrowRight } from 'lucide-react';

interface CategorySelectionProps {
  onSelectCategory: (type: ResourceType) => void;
}

const CategorySelection: React.FC<CategorySelectionProps> = ({ onSelectCategory }) => {
  const categories = [
    {
      type: ResourceType.PYQ,
      title: 'Previous Year Papers',
      description: 'Access past question papers organized by year and semester.',
      icon: <FileQuestion className="h-10 w-10" />,
      colorClass: 'bg-blue-50 text-blue-600 border-blue-100 hover:border-blue-300',
      btnClass: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      type: ResourceType.NOTE,
      title: 'Lecture Notes',
      description: 'Comprehensive study notes covering all units and chapters.',
      icon: <FileText className="h-10 w-10" />,
      colorClass: 'bg-amber-50 text-amber-600 border-amber-100 hover:border-amber-300',
      btnClass: 'bg-amber-600 hover:bg-amber-700'
    },
    {
      type: ResourceType.SYLLABUS,
      title: 'Syllabus',
      description: 'Detailed semester-wise syllabus for CBCS and NEP patterns.',
      icon: <Book className="h-10 w-10" />,
      colorClass: 'bg-purple-50 text-purple-600 border-purple-100 hover:border-purple-300',
      btnClass: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {categories.map((cat) => (
        <button
          key={cat.type}
          onClick={() => onSelectCategory(cat.type)}
          className={`relative group rounded-3xl p-8 border-2 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full ${cat.colorClass}`}
        >
          <div className="mb-6 bg-white w-20 h-20 rounded-2xl flex items-center justify-center shadow-sm">
            {cat.icon}
          </div>
          
          <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">
            {cat.title}
          </h3>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            {cat.description}
          </p>
          
          <div className={`mt-auto inline-flex items-center gap-2 text-white px-6 py-3 rounded-xl font-medium transition-colors ${cat.btnClass}`}>
            <span>Browse Materials</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </button>
      ))}
    </div>
  );
};

export default CategorySelection;