
import React from 'react';
import { Subject, Resource, User } from '../types';
import { 
  BookOpen, ChevronRight, Atom, FlaskConical, Sigma, Sprout, PawPrint, Mountain, 
  Landmark, ScrollText, Coins, Map, Brain, Users, Fingerprint, Home, 
  Languages, Lightbulb, Briefcase, Code, Cpu, Dna, Palette, 
  Clapperboard, Calculator, Heart
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

// Default fallback image (Library/Academic setting)
const DEFAULT_ACADEMIC_IMAGE = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop';

const SubjectGrid: React.FC<SubjectGridProps> = ({ subjects, allResources, onSelectSubject, searchQuery, user, favorites, onToggleFavorite }) => {
  // Filter subjects based on search and sort alphabetically
  const filteredSubjects = subjects
    .filter(s => s.id !== 'all' && s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

  const getIcon = (id: string) => {
    switch (id) {
      // Faculty of Science
      case 'phy': return <Atom className="h-5 w-5" />;
      case 'chem': return <FlaskConical className="h-5 w-5" />;
      case 'math': return <Sigma className="h-5 w-5" />;
      case 'bot': return <Sprout className="h-5 w-5" />;
      case 'zoo': return <PawPrint className="h-5 w-5" />;
      case 'geol': return <Mountain className="h-5 w-5" />;
      
      // Faculty of Social Sciences
      case 'hist': return <ScrollText className="h-5 w-5" />;
      case 'pol': return <Landmark className="h-5 w-5" />;
      case 'eco': return <Coins className="h-5 w-5" />;
      case 'geog': return <Map className="h-5 w-5" />;
      case 'psy': return <Brain className="h-5 w-5" />;
      case 'soc': return <Users className="h-5 w-5" />;
      case 'anth': return <Fingerprint className="h-5 w-5" />;
      case 'home': return <Home className="h-5 w-5" />;

      // Faculty of Humanities (Languages)
      case 'hin':
      case 'eng':
      case 'san':
      case 'urd':
      case 'ben':
      case 'trl':
        return <Languages className="h-5 w-5" />;
      
      // Faculty of Humanities (Others)
      case 'phil': return <Lightbulb className="h-5 w-5" />;

      // Faculty of Commerce
      case 'com': return <Calculator className="h-5 w-5" />;

      // Vocational Courses
      case 'bba': return <Briefcase className="h-5 w-5" />;
      case 'bca': return <Code className="h-5 w-5" />;
      case 'it': return <Cpu className="h-5 w-5" />;
      case 'bt': return <Dna className="h-5 w-5" />;
      case 'fd': return <Palette className="h-5 w-5" />;
      case 'mcvp': return <Clapperboard className="h-5 w-5" />;

      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  const getSubjectImage = (id: string) => {
    const images: Record<string, string> = {
      phy: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=800&auto=format&fit=crop', // Physics
      chem: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop', // Chemistry
      math: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=800&auto=format&fit=crop', // Math
      bot: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=800&auto=format&fit=crop', // Botany
      zoo: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop', // Zoology
      geol: 'https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?q=80&w=800&auto=format&fit=crop', // Geology
      hist: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=800&auto=format&fit=crop', // History
      pol: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop', // Political Science
      eco: 'https://images.unsplash.com/photo-1526304640156-22e933de792c?q=80&w=800&auto=format&fit=crop', // Economics (Updated - Growth)
      geog: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop', // Geography
      psy: 'https://images.unsplash.com/photo-1571772996211-2f02c9727629?q=80&w=800&auto=format&fit=crop', // Psychology
      soc: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800&auto=format&fit=crop', // Sociology
      anth: 'https://images.unsplash.com/photo-1606819717115-9159c900370b?q=80&w=800&auto=format&fit=crop', // Anthropology
      home: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=800&auto=format&fit=crop', // Home Science
      hin: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop', // Hindi
      eng: 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?q=80&w=800&auto=format&fit=crop', // English
      san: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop', // Sanskrit
      urd: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop', // Urdu
      ben: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?q=80&w=800&auto=format&fit=crop', // Bengali
      phil: 'https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=800&auto=format&fit=crop', // Philosophy
      trl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=800&auto=format&fit=crop', // TRL
      com: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop', // Commerce
      bba: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop', // BBA
      bca: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=800&auto=format&fit=crop', // BCA
      it: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop', // IT
      bt: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=800&auto=format&fit=crop', // Biotech
      fd: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800&auto=format&fit=crop', // Fashion
      mcvp: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop', // Mass Comm
    };
    
    // Return specific image if exists and is not empty, otherwise default
    return (images[id] && images[id].trim() !== '') ? images[id] : DEFAULT_ACADEMIC_IMAGE;
  };

  const getResourceCount = (subjectId: string) => {
    return allResources.filter(r => r.subjectId === subjectId).length;
  };

  if (filteredSubjects.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-gray-500 dark:text-gray-400">No subjects found matching "{searchQuery}"</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredSubjects.map((subject) => {
        const count = getResourceCount(subject.id);
        const image = getSubjectImage(subject.id);
        const isLiked = favorites.includes(subject.id);
        
        return (
          <div
            key={subject.id}
            className="group relative h-56 rounded-2xl shadow-md overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 text-left flex flex-col bg-gray-100 dark:bg-slate-800"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img 
                src={image} 
                alt={subject.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_ACADEMIC_IMAGE;
                  e.currentTarget.onerror = null; // Prevent infinite loop if default also fails
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20 group-hover:via-black/60 transition-colors duration-300" />
            </div>

            {/* Clickable Area for Navigation */}
            <button 
                onClick={() => onSelectSubject(subject.id)}
                className="absolute inset-0 z-10 w-full h-full"
                aria-label={`View ${subject.name}`}
            />

            {/* Content Layer */}
            <div className="relative z-20 p-5 flex flex-col h-full w-full pointer-events-none">
              <div className="flex items-start justify-between">
                <div className="p-2 bg-white/10 backdrop-blur-md rounded-lg text-white border border-white/20 group-hover:bg-university-accent group-hover:border-university-accent transition-colors duration-300">
                  {getIcon(subject.id)}
                </div>
                
                {/* Like Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent navigation
                        e.preventDefault();
                        onToggleFavorite(subject.id);
                    }}
                    className={`pointer-events-auto p-2 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 focus:outline-none ${
                        isLiked 
                        ? 'bg-red-500 text-white' 
                        : 'bg-black/20 text-white/70 hover:bg-white hover:text-red-500'
                    }`}
                    title={isLiked ? "Unlike Subject" : "Like Subject"}
                >
                    <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                </button>
              </div>
              
              <div className="mt-auto">
                <h3 className="text-xl font-serif font-bold text-white tracking-wide mb-1 drop-shadow-sm line-clamp-1 leading-tight">
                  {subject.name}
                </h3>
                {subject.description && (
                  <p className="text-xs text-gray-300 line-clamp-2 mb-3 leading-relaxed font-light">
                    {subject.description}
                  </p>
                )}
                <div className="flex items-center gap-2">
                   <span className="inline-block w-6 h-0.5 bg-university-accent rounded-full"></span>
                   <p className="text-[10px] text-gray-200 font-bold tracking-widest uppercase">
                     {count} Resources
                   </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SubjectGrid;
