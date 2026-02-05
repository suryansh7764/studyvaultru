import React from 'react';
import { Subject, Resource, User } from '../types.ts';
import { 
  BookOpen, Atom, FlaskConical, Sigma, Sprout, PawPrint, Mountain, 
  Landmark, ScrollText, Coins, Map, Brain, Users, Fingerprint, Home, 
  Languages, Lightbulb, Briefcase, Code, Cpu, Dna, Palette, 
  Clapperboard, Calculator, Heart, Globe, Zap, Hash
} from 'lucide-react';

interface SubjectGridProps {
  subjects: Subject[];
  allResources: Resource[];
  onSelectSubject: (subjectId: string) => void;
  searchQuery: string;
  user: User | null;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

const DEFAULT_ACADEMIC_IMAGE = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop';

const SubjectGrid: React.FC<SubjectGridProps> = ({ subjects, allResources, onSelectSubject, searchQuery, favorites, onToggleFavorite }) => {
  
  // Faculty grouping logic - Vibrant visual themes
  const facultyCategories = [
    { 
        id: 'Science', 
        label: 'Faculty of Science', 
        icon: <Atom className="h-6 w-6" />, 
        accent: 'blue',
        gradient: 'from-blue-600 to-cyan-500', 
        textColor: 'text-blue-600 dark:text-blue-400',
        ringColor: 'ring-blue-500/30',
        glowColor: 'group-hover:shadow-blue-500/20'
    },
    { 
        id: 'Humanities', 
        label: 'Faculty of Humanities', 
        icon: <Globe className="h-6 w-6" />, 
        accent: 'rose',
        gradient: 'from-rose-600 to-pink-500', 
        textColor: 'text-rose-600 dark:text-rose-400',
        ringColor: 'ring-rose-500/30',
        glowColor: 'group-hover:shadow-rose-500/20'
    },
    { 
        id: 'TRL', 
        label: 'Regional Languages', 
        icon: <Users className="h-6 w-6" />, 
        accent: 'emerald',
        gradient: 'from-emerald-600 to-teal-500', 
        textColor: 'text-emerald-600 dark:text-emerald-400',
        ringColor: 'ring-emerald-500/30',
        glowColor: 'group-hover:shadow-emerald-500/20'
    },
    { 
        id: 'Social Science', 
        label: 'Social Sciences', 
        icon: <Landmark className="h-6 w-6" />, 
        accent: 'amber',
        gradient: 'from-amber-600 to-orange-500', 
        textColor: 'text-amber-600 dark:text-amber-400',
        ringColor: 'ring-amber-500/30',
        glowColor: 'group-hover:shadow-amber-500/20'
    },
    { 
        id: 'Vocational', 
        label: 'Vocational Dept.', 
        icon: <Briefcase className="h-6 w-6" />, 
        accent: 'purple',
        gradient: 'from-purple-600 to-indigo-500', 
        textColor: 'text-purple-600 dark:text-purple-400',
        ringColor: 'ring-purple-500/30',
        glowColor: 'group-hover:shadow-purple-500/20'
    },
  ];

  const getIcon = (id: string) => {
    const iconClass = "h-5 w-5";
    switch (id) {
      case 'phy': return <Atom className={iconClass} />;
      case 'chem': return <FlaskConical className={iconClass} />;
      case 'math': return <Sigma className={iconClass} />;
      case 'bot': return <Sprout className={iconClass} />;
      case 'zoo': return <PawPrint className={iconClass} />;
      case 'geol': return <Mountain className={iconClass} />;
      case 'hist': return <ScrollText className={iconClass} />;
      case 'pol': return <Landmark className={iconClass} />;
      case 'eco': return <Coins className={iconClass} />;
      case 'geog': return <Map className={iconClass} />;
      case 'psy': return <Brain className={iconClass} />;
      case 'soc': return <Users className={iconClass} />;
      case 'anth': return <Fingerprint className={iconClass} />;
      case 'home': return <Home className={iconClass} />;
      case 'hin':
      case 'eng':
      case 'san':
      case 'urd':
      case 'ben':
      case 'trl':
        return <Languages className={iconClass} />;
      case 'phil': return <Lightbulb className={iconClass} />;
      case 'com': return <Calculator className={iconClass} />;
      case 'bba': return <Briefcase className={iconClass} />;
      case 'bca': return <Code className={iconClass} />;
      case 'it': return <Cpu className={iconClass} />;
      case 'bt': return <Dna className={iconClass} />;
      case 'fd': return <Palette className={iconClass} />;
      case 'mcvp': return <Clapperboard className={iconClass} />;
      default: return <BookOpen className={iconClass} />;
    }
  };

  const getSubjectImage = (id: string) => {
    const images: Record<string, string> = {
      phy: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=800&auto=format&fit=crop',
      chem: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop',
      math: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=800&auto=format&fit=crop',
      bot: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=800&auto=format&fit=crop',
      zoo: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop',
      geol: 'https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?q=80&w=800&auto=format&fit=crop',
      hist: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=800&auto=format&fit=crop',
      pol: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop',
      eco: 'https://images.unsplash.com/photo-1526304640156-22e933de792c?q=80&w=800&auto=format&fit=crop',
      geog: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop',
      psy: 'https://images.unsplash.com/photo-1571772996211-2f02c9727629?q=80&w=800&auto=format&fit=crop',
      soc: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800&auto=format&fit=crop',
      anth: 'https://images.unsplash.com/photo-1606819717115-9159c900370b?q=80&w=800&auto=format&fit=crop',
      home: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=800&auto=format&fit=crop',
      hin: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop',
      eng: 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?q=80&w=800&auto=format&fit=crop',
      san: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop',
      urd: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop',
      ben: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?q=80&w=800&auto=format&fit=crop',
      phil: 'https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=800&auto=format&fit=crop',
      trl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=800&auto=format&fit=crop',
      com: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
      bba: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
      bca: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=800&auto=format&fit=crop',
      it: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
      bt: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=800&auto=format&fit=crop',
      fd: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800&auto=format&fit=crop',
      mcvp: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop',
    };
    return images[id] || DEFAULT_ACADEMIC_IMAGE;
  };

  const getResourceCount = (subjectId: string) => {
    return allResources.filter(r => r.subjectId === subjectId).length;
  };

  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToFaculty = (id: string) => {
      const element = document.getElementById(`faculty-${id}`);
      if (element) {
          const offset = 140;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          window.scrollTo({
              top: elementRect - bodyRect - offset,
              behavior: 'smooth'
          });
      }
  };

  return (
    <div className="space-y-24">
      {/* Refined Quick Navigation */}
      {!searchQuery && (
          <div className="sticky top-20 z-40 py-4 bg-gray-50/90 dark:bg-slate-950/90 backdrop-blur-md -mx-4 px-4 border-b border-gray-200 dark:border-slate-800 animate-in fade-in duration-500 overflow-x-auto no-scrollbar">
              <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
                  <div className="flex items-center gap-2 text-university-accent font-bold text-[9px] uppercase tracking-[0.3em] mr-4 whitespace-nowrap">
                     <Zap className="h-3.5 w-3.5" /> Navigate:
                  </div>
                  {facultyCategories.map(faculty => (
                      <button
                        key={faculty.id}
                        onClick={() => scrollToFaculty(faculty.id)}
                        className={`px-4 py-2 rounded-xl border text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-2 ${faculty.textColor} border-gray-200 dark:border-slate-800 hover:border-university-accent bg-white dark:bg-slate-900 shadow-sm hover:scale-105 active:scale-95`}
                      >
                         {React.cloneElement(faculty.icon as React.ReactElement, { className: 'h-3.5 w-3.5' })}
                         {faculty.label.split(' ')[0]}
                      </button>
                  ))}
              </div>
          </div>
      )}

      {facultyCategories.map((faculty) => {
        const facultySubjects = filteredSubjects.filter(s => s.faculty === faculty.id);
        if (facultySubjects.length === 0) return null;

        return (
          <section 
            key={faculty.id} 
            id={`faculty-${faculty.id}`}
            className="animate-in fade-in slide-in-from-bottom-12 duration-1000"
          >
            {/* Minimal & Elegant Faculty Header */}
            <div className="relative mb-12 text-center">
                <div className="flex flex-col items-center justify-center">
                    <div className={`p-4 rounded-[2rem] bg-gradient-to-br ${faculty.gradient} text-white shadow-2xl shadow-${faculty.accent}-500/20 mb-6 group-hover:scale-110 transition-transform`}>
                        {faculty.icon}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white tracking-tight mb-3">
                        {faculty.label}
                    </h2>
                    <div className={`h-1.5 w-24 bg-gradient-to-r ${faculty.gradient} rounded-full`}></div>
                    <div className="flex items-center gap-3 mt-4">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.25em]">
                            {facultySubjects.length} Honors Departments
                        </span>
                    </div>
                </div>
            </div>

            {/* Narrower & More Compact Grid (5 Columns) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {facultySubjects.map((subject) => {
                const count = getResourceCount(subject.id);
                const image = getSubjectImage(subject.id);
                const isLiked = favorites.includes(subject.id);
                
                return (
                  <div
                    key={subject.id}
                    className={`group relative h-56 rounded-[2rem] shadow-lg overflow-hidden transition-all duration-500 flex flex-col bg-gray-100 dark:bg-slate-800 border-2 border-transparent hover:border-${faculty.accent}-500/30 ${faculty.glowColor}`}
                  >
                    <div className="absolute inset-0">
                      <img 
                        src={image} 
                        alt={subject.name} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        onError={(e) => { e.currentTarget.src = DEFAULT_ACADEMIC_IMAGE; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent group-hover:via-black/50 transition-colors duration-500" />
                      
                      {/* Refined Shine Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] animate-shine"></div>
                      </div>
                    </div>

                    <button 
                        onClick={() => onSelectSubject(subject.id)}
                        className="absolute inset-0 z-10 w-full h-full"
                        aria-label={`View ${subject.name}`}
                    />

                    <div className="relative z-20 p-5 flex flex-col h-full w-full pointer-events-none">
                      <div className="flex items-start justify-between">
                        <div className={`p-2.5 bg-white/10 backdrop-blur-xl rounded-xl text-white border border-white/20 group-hover:bg-gradient-to-br ${faculty.gradient} group-hover:border-transparent transition-all duration-500 shadow-xl`}>
                          {getIcon(subject.id)}
                        </div>
                        
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                onToggleFavorite(subject.id);
                            }}
                            className="pointer-events-auto p-2.5 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 focus:outline-none bg-black/20 text-white/70 hover:bg-white hover:text-red-500 shadow-lg"
                        >
                            <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                        </button>
                      </div>
                      
                      <div className="mt-auto">
                        <h3 className="text-xl font-bold text-white tracking-tight leading-tight group-hover:text-university-accent transition-colors line-clamp-1">
                          {subject.name}
                        </h3>
                        
                        <div className="flex items-center gap-2 mt-2">
                           <span className={`h-1 w-6 bg-gradient-to-r ${faculty.gradient} rounded-full transition-all group-hover:w-10`}></span>
                           <p className="text-[9px] text-gray-300 font-bold tracking-widest uppercase">
                             {count} Resources
                           </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {filteredSubjects.length === 0 && (
        <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-gray-200 dark:border-slate-800">
          <BookOpen className="h-10 w-10 text-gray-300 dark:text-slate-700 mx-auto mb-6" />
          <p className="text-xl text-gray-500 dark:text-gray-400 font-serif font-bold">No results found for "{searchQuery}"</p>
          <button 
             onClick={() => window.location.reload()}
             className="mt-6 text-university-accent font-bold px-8 py-2 rounded-xl bg-university-accent/5 hover:bg-university-accent/10 transition-all"
          >
             Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default SubjectGrid;