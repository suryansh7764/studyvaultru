
import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronRight, BookOpen, Layers, Building2 } from 'lucide-react';
import { SUBJECTS } from '../constants';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onPopularClick?: (term: string) => void;
}

const Hero: React.FC<HeroProps> = ({ searchQuery, setSearchQuery, onPopularClick }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter subjects for dropdown (exclude 'all')
  const filteredSubjects = searchQuery 
    ? SUBJECTS.filter(s => s.id !== 'all' && s.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 6) 
    : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  // Reset active index when query changes
  useEffect(() => {
    setActiveIndex(-1);
  }, [searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowDropdown(true);
  };

  const handleSelectSubject = (subjectName: string) => {
    setSearchQuery(subjectName);
    setShowDropdown(false);
    setActiveIndex(-1);
    onPopularClick?.(subjectName);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || filteredSubjects.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
        onPopularClick?.(searchQuery);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => (prev < filteredSubjects.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev > -1 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex > -1) {
          handleSelectSubject(filteredSubjects[activeIndex].name);
        } else {
          setShowDropdown(false);
          onPopularClick?.(searchQuery);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setActiveIndex(-1);
        inputRef.current?.blur();
        break;
      case 'Tab':
        setShowDropdown(false);
        break;
    }
  };

  return (
    <div className="relative bg-university-900 overflow-hidden min-h-[600px] flex items-center justify-center py-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover opacity-40"
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop"
          alt="University Campus"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-university-900/80 via-university-900/60 to-university-900"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center w-full">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/90 text-sm font-medium mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
           <span className="flex h-2 w-2 rounded-full bg-university-accent"></span>
           StudyVault - Ranchi University
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight mb-4 drop-shadow-lg leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          Find Your <span className="text-university-accent">Study Materials</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-200 font-serif italic mb-6 opacity-90 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          "Knowledge Secured. Success Assured."
        </p>
        
        <p className="max-w-2xl text-lg text-gray-300 font-light leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          A comprehensive collection of Previous Year Questions, Syllabus, and Lecture Notes for all colleges under Ranchi University.
        </p>
        
        {/* Search Box Container */}
        <div ref={wrapperRef} className="w-full max-w-2xl relative z-20 animate-in fade-in scale-95 duration-700 delay-300">
          <div 
            className="relative group"
            role="combobox"
            aria-expanded={showDropdown && filteredSubjects.length > 0}
            aria-haspopup="listbox"
            aria-owns="subject-dropdown-list"
          >
             <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-university-accent group-focus-within:text-university-accent transition-colors" />
             </div>
             <input
                ref={inputRef}
                type="text"
                className="block w-full pl-14 pr-4 py-5 border-0 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-university-accent/30 rounded-2xl text-lg font-medium shadow-2xl transition-all"
                placeholder="Search for subjects (e.g., Physics, History)..."
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => setShowDropdown(true)}
                onKeyDown={handleKeyDown}
                aria-autocomplete="list"
                aria-controls="subject-dropdown-list"
                aria-activedescendant={activeIndex >= 0 ? `subject-option-${activeIndex}` : undefined}
                aria-label="Search subjects"
             />
             <div className="absolute inset-y-0 right-3 flex items-center">
                <button 
                  className="bg-university-accent hover:bg-amber-700 text-white p-2.5 rounded-xl transition-colors shadow-md"
                  onClick={() => onPopularClick?.(searchQuery)}
                  aria-label="Search"
                  tabIndex={-1}
                >
                   <ChevronRight className="h-5 w-5" />
                </button>
             </div>
          </div>

          {/* Autocomplete Dropdown */}
          {showDropdown && searchQuery && filteredSubjects.length > 0 && (
             <ul 
                id="subject-dropdown-list"
                role="listbox"
                className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 text-left p-2 list-none m-0 z-50"
             >
                <li className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider select-none" aria-hidden="true">Suggested Subjects</li>
                {filteredSubjects.map((subject, index) => (
                   <li 
                      key={subject.id}
                      id={`subject-option-${index}`}
                      role="option"
                      aria-selected={index === activeIndex}
                      onClick={() => handleSelectSubject(subject.name)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`
                        w-full text-left px-4 py-3 rounded-xl flex items-center justify-between group transition-colors cursor-pointer
                        ${index === activeIndex ? 'bg-university-light dark:bg-slate-700' : 'hover:bg-university-light dark:hover:bg-slate-700'}
                      `}
                   >
                      <div className="flex items-center gap-3">
                         <div className={`
                            p-2 rounded-lg transition-colors
                            ${index === activeIndex 
                                ? 'bg-university-accent text-white' 
                                : 'bg-university-accent/10 text-university-accent group-hover:bg-university-accent group-hover:text-white'
                            }
                         `}>
                            <BookOpen className="h-4 w-4" />
                         </div>
                         <span className="font-medium text-gray-800 dark:text-gray-200">
                            {subject.name}
                         </span>
                      </div>
                      <span className={`
                         text-sm transition-all
                         ${index === activeIndex 
                            ? 'text-university-accent translate-x-1' 
                            : 'text-gray-400 group-hover:text-university-accent group-hover:translate-x-1'
                         }
                      `}>Select</span>
                   </li>
                ))}
             </ul>
          )}
        </div>

        {/* Feature Highlights (Replacement for Popular Tags) */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
            {/* Feature 1 */}
            <div className="flex flex-col items-center sm:items-start p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors group">
               <div className="p-3 bg-university-accent/20 rounded-xl text-university-accent mb-3 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-6 w-6" />
               </div>
               <h3 className="text-white font-bold text-lg mb-1">PYQs & Notes</h3>
               <p className="text-gray-400 text-sm text-center sm:text-left leading-relaxed">
                 Access high-quality notes and past papers for better exam preparation.
               </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center sm:items-start p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors group">
               <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400 mb-3 group-hover:scale-110 transition-transform">
                  <Building2 className="h-6 w-6" />
               </div>
               <h3 className="text-white font-bold text-lg mb-1">All Colleges</h3>
               <p className="text-gray-400 text-sm text-center sm:text-left leading-relaxed">
                 Resources tailored for every college affiliated with Ranchi University.
               </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center sm:items-start p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors group">
               <div className="p-3 bg-green-500/20 rounded-xl text-green-400 mb-3 group-hover:scale-110 transition-transform">
                  <Layers className="h-6 w-6" />
               </div>
               <h3 className="text-white font-bold text-lg mb-1">All Semesters</h3>
               <p className="text-gray-400 text-sm text-center sm:text-left leading-relaxed">
                 Updated content for both CBCS (Old) and NEP (New) patterns.
               </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
