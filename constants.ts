
import { College, Resource, ResourceType, Subject, CoursePattern, DegreeLevel } from './types';

export const COLLEGES: College[] = [
  { 
    id: 'all', 
    name: 'All Colleges',
    logo: 'https://ui-avatars.com/api/?name=All+Colleges&background=0f172a&color=fff&size=128&bold=true' 
  },
  { id: 'bs', name: 'B.S. College, Lohardaga', logo: 'https://ui-avatars.com/api/?name=B+S&background=7c2d12&color=fff&size=128&bold=true' },
  { id: 'birsa', name: 'Birsa College, Khunti', logo: 'https://ui-avatars.com/api/?name=B+C&background=374151&color=fff&size=128&bold=true' },
  { id: 'cit', name: 'Cambridge Institute of Technology', logo: 'https://ui-avatars.com/api/?name=C+I&background=1e3a8a&color=fff&size=128&bold=true' },
  { 
    id: 'dc', 
    name: 'Doranda College',
    logo: 'https://ui-avatars.com/api/?name=D+C&background=0369a1&color=fff&size=128&bold=true'
  },
  { id: 'gc', name: 'Gossner College', logo: 'https://ui-avatars.com/api/?name=G+C&background=1d4ed8&color=fff&size=128&bold=true' },
  { id: 'jn', name: 'J.N. College, Dhurwa', logo: 'https://ui-avatars.com/api/?name=J+N&background=a21caf&color=fff&size=128&bold=true' },
  { id: 'kcb', name: 'K.C.B. College, Bero', logo: 'https://ui-avatars.com/api/?name=K+C&background=4338ca&color=fff&size=128&bold=true' },
  { id: 'ko', name: 'K.O. College, Gumla', logo: 'https://ui-avatars.com/api/?name=K+O&background=be123c&color=fff&size=128&bold=true' },
  { id: 'mandar', name: 'Mandar College, Mandar', logo: 'https://ui-avatars.com/api/?name=M+M&background=57534e&color=fff&size=128&bold=true' },
  { 
    id: 'mc', 
    name: 'Marwari College',
    logo: 'https://ui-avatars.com/api/?name=M+C&background=1e293b&color=fff&size=128&bold=true'
  },
  { id: 'mac', name: 'Maulana Azad College', logo: 'https://ui-avatars.com/api/?name=M+A&background=0f766e&color=fff&size=128&bold=true' },
  { id: 'nc', name: 'Nirmala College', logo: 'https://ui-avatars.com/api/?name=N+C&background=ec4899&color=fff&size=128&bold=true' },
  { id: 'ppk', name: 'P.P.K. College, Bundu', logo: 'https://ui-avatars.com/api/?name=P+P&background=047857&color=fff&size=128&bold=true' },
  { id: 'rlsy', name: 'R.L.S.Y. College', logo: 'https://ui-avatars.com/api/?name=R+L&background=15803d&color=fff&size=128&bold=true' },
  { id: 'rtc', name: 'R.T.C. College', logo: 'https://ui-avatars.com/api/?name=R+T&background=be123c&color=fff&size=128&bold=true' },
  { 
    id: 'wc', 
    name: "Ranchi Women's College",
    logo: 'https://ui-avatars.com/api/?name=W+C&background=be185d&color=fff&size=128&bold=true'
  },
  { id: 'ssm', name: 'S.S. Memorial College', logo: 'https://ui-avatars.com/api/?name=S+S&background=b91c1c&color=fff&size=128&bold=true' },
  { id: 'sgm', name: 'Sanjay Gandhi Memorial College', logo: 'https://ui-avatars.com/api/?name=S+G&background=4d7c0f&color=fff&size=128&bold=true' },
  { id: 'sim', name: 'Simdega College, Simdega', logo: 'https://ui-avatars.com/api/?name=S+C&background=0e7490&color=fff&size=128&bold=true' },
  { id: 'spc', name: "St. Paul's College", logo: 'https://ui-avatars.com/api/?name=S+P&background=6d28d9&color=fff&size=128&bold=true' },
  { id: 'sxc', name: "St. Xavier's College", logo: 'https://ui-avatars.com/api/?name=S+X&background=991b1b&color=fff&size=128&bold=true' },
  { 
    id: 'ru_dept', 
    name: 'University Departments (Main Campus)',
    logo: 'https://ui-avatars.com/api/?name=R+U&background=d97706&color=fff&size=128&bold=true'
  },
  { id: 'ysm', name: 'Yogoda Satsanga Mahavidyalaya', logo: 'https://ui-avatars.com/api/?name=Y+S&background=c2410c&color=fff&size=128&bold=true' },
];

export const SUBJECTS: Subject[] = [
  { id: 'all', name: 'All Honors', description: 'Explore resources for all available honors subjects.' },
  // Faculty of Science
  { id: 'phy', name: 'Physics', description: 'Study of matter, energy, and the fundamental forces of nature.' },
  { id: 'chem', name: 'Chemistry', description: 'Explore the properties, composition, and structure of substances.' },
  { id: 'math', name: 'Mathematics', description: 'The abstract science of number, quantity, and space.' },
  { id: 'bot', name: 'Botany', description: 'Scientific study of plants, including physiology and ecology.' },
  { id: 'zoo', name: 'Zoology', description: 'Study of the behavior, structure, and classification of animals.' },
  { id: 'geol', name: 'Geology', description: 'Earth science concerned with the solid Earth and its processes.' },
  
  // Faculty of Social Sciences
  { id: 'hist', name: 'History', description: 'Study of past events, particularly in human affairs.' },
  { id: 'pol', name: 'Political Science', description: 'Analysis of systems of government and political activity.' },
  { id: 'eco', name: 'Economics', description: 'Study of production, consumption, and transfer of wealth.' },
  { id: 'geog', name: 'Geography', description: 'Study of places and the relationships between people and environments.' },
  { id: 'psy', name: 'Psychology', description: 'Scientific study of the human mind and its functions.' },
  { id: 'soc', name: 'Sociology', description: 'Study of the development, structure, and functioning of society.' },
  { id: 'anth', name: 'Anthropology', description: 'Study of human societies and cultures and their development.' },
  { id: 'home', name: 'Home Science', description: 'Scientific course of study on handling home and family life.' },

  // Faculty of Humanities
  { id: 'hin', name: 'Hindi', description: 'Literature and language studies of Hindi.' },
  { id: 'eng', name: 'English', description: 'Literature, linguistics and language studies of English.' },
  { id: 'san', name: 'Sanskrit', description: 'Classical language of South Asia and its literature.' },
  { id: 'urd', name: 'Urdu', description: 'Literature and language studies of Urdu.' },
  { id: 'ben', name: 'Bengali', description: 'Literature and language studies of Bengali.' },
  { id: 'phil', name: 'Philosophy', description: 'Study of fundamental nature of knowledge, reality, and existence.' },
  { id: 'trl', name: 'Tribal & Regional Languages', description: 'Study of indigenous languages and regional dialects.' },

  // Faculty of Commerce
  { id: 'com', name: 'Commerce (Accounts)', description: 'Study of trade, accounting, finance, and business activities.' },

  // Vocational Courses
  { id: 'bba', name: 'BBA (Business Admin)', description: 'Principles of business management and administration.' },
  { id: 'bca', name: 'BCA (Computer App)', description: 'Software development and computer applications.' },
  { id: 'it', name: 'Information Technology', description: 'Use of systems for storing, retrieving, and sending information.' },
  { id: 'bt', name: 'Biotechnology', description: 'Use of living systems and organisms to develop products.' },
  { id: 'fd', name: 'Fashion Designing', description: 'Art of applying design, aesthetics, and beauty to clothing.' },
  { id: 'mcvp', name: 'Mass Comm. & Video Prod.', description: 'Journalism, media studies, and video production techniques.' }
];

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export const YEARS = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017];

export const PATTERNS = [
  { id: 'all', name: 'All Patterns' },
  { id: 'CBCS', name: 'CBCS (Old Pattern)' },
  { id: 'NEP', name: 'NEP (New Education Policy)' },
];

export const DEGREE_LEVELS = [
  { id: 'all', name: 'All Degrees' },
  { id: 'UG', name: 'Undergraduate (UG)' },
  { id: 'PG', name: 'Postgraduate (PG)' },
];

// Helper to generate mock resources
const generateMockResources = (): Resource[] => {
  const resources: Resource[] = [];
  const types = [ResourceType.PYQ, ResourceType.NOTE, ResourceType.PYQ, ResourceType.SYLLABUS];
  
  let idCounter = 1;

  // Generate data for a subset of colleges to keep mock data manageable but diverse
  // We use a larger slice now that we have more colleges
  COLLEGES.slice(1, 15).forEach((college) => {
    // Pick random subset of subjects to populate to make it realistic (not every college has every resource uploaded instantly)
    // Reduce probability slightly to avoid overwhelming list
    const randomSubjects = SUBJECTS.slice(1).filter(() => Math.random() > 0.7);

    randomSubjects.forEach((subject) => {
      // Determine how many resources to generate for this subject/college combo (fewer items per subject to keep total manageable)
      const resourceCount = Math.floor(Math.random() * 3) + 1;

      for (let i = 0; i < resourceCount; i++) {
        // Randomly assign pattern
        const isNEP = Math.random() > 0.4; // 60% chance of NEP
        const pattern = isNEP ? CoursePattern.NEP : CoursePattern.CBCS;
        
        // Randomly assign Degree Level
        const degreeLevel = Math.random() > 0.25 ? DegreeLevel.UG : DegreeLevel.PG;
        
        // Semester logic: CBCS is 1-6, NEP is 1-8
        const maxSem = pattern === CoursePattern.CBCS ? 6 : 8;
        const sem = Math.floor(Math.random() * maxSem) + 1;
        
        // Year logic: NEP started recently (e.g., 2022+), CBCS is older
        const minYear = pattern === CoursePattern.NEP ? 2022 : 2017;
        const maxYear = pattern === CoursePattern.NEP ? 2024 : 2022;
        const year = Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;

        const type = types[Math.floor(Math.random() * types.length)];

        // Create realistic paper titles based on subject
        let titleSuffix = '';
        if (type === ResourceType.PYQ) {
            titleSuffix = `Paper CC-${sem + 2} (${year})`;
        } else if (type === ResourceType.NOTE) {
            titleSuffix = `Unit ${Math.floor(Math.random() * 4) + 1} Summary`;
        } else {
            titleSuffix = `Syllabus (Semester ${sem}) - ${pattern}`;
        }

        resources.push({
          id: `res-${idCounter++}`,
          title: `${subject.name} - ${titleSuffix}`,
          collegeId: college.id,
          subjectId: subject.id,
          semester: sem,
          year: year,
          type: type,
          pattern: pattern,
          degreeLevel: degreeLevel,
          downloadUrl: '#',
          size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
          downloadCount: Math.floor(Math.random() * 2000) + 50,
        });
      }
    });
  });
  return resources;
};

export const MOCK_RESOURCES = generateMockResources();
