import { College, Resource, ResourceType, Subject, CoursePattern, DegreeLevel } from './types.ts';

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
  // Faculty of Science
  { id: 'phy', name: 'Physics', faculty: 'Science', description: 'Study of matter, energy, and the fundamental forces of nature.' },
  { id: 'chem', name: 'Chemistry', faculty: 'Science', description: 'Explore the properties, composition, and structure of substances.' },
  { id: 'math', name: 'Mathematics', faculty: 'Science', description: 'The abstract science of number, quantity, and space.' },
  { id: 'bot', name: 'Botany', faculty: 'Science', description: 'Scientific study of plants, including physiology and ecology.' },
  { id: 'zoo', name: 'Zoology', faculty: 'Science', description: 'Study of the behavior, structure, and classification of animals.' },
  { id: 'geol', name: 'Geology', faculty: 'Science', description: 'Earth science concerned with the solid Earth and its processes.' },
  
  // Faculty of Humanities
  { id: 'hin', name: 'Hindi', faculty: 'Humanities', description: 'Literature and language studies of Hindi.' },
  { id: 'eng', name: 'English', faculty: 'Humanities', description: 'Literature, linguistics and language studies of English.' },
  { id: 'san', name: 'Sanskrit', faculty: 'Humanities', description: 'Classical language of South Asia and its literature.' },
  { id: 'urd', name: 'Urdu', faculty: 'Humanities', description: 'Literature and language studies of Urdu.' },
  { id: 'ben', name: 'Bengali', faculty: 'Humanities', description: 'Literature and language studies of Bengali.' },
  { id: 'phil', name: 'Philosophy', faculty: 'Humanities', description: 'Study of fundamental nature of knowledge, reality, and existence.' },

  // Tribal & Regional Languages
  { id: 'trl', name: 'TRL (Tribal Languages)', faculty: 'TRL', description: 'Study of indigenous languages and regional dialects of Jharkhand.' },

  // Faculty of Social Sciences
  { id: 'hist', name: 'History', faculty: 'Social Science', description: 'Study of past events, particularly in human affairs.' },
  { id: 'pol', name: 'Political Science', faculty: 'Social Science', description: 'Analysis of systems of government and political activity.' },
  { id: 'eco', name: 'Economics', faculty: 'Social Science', description: 'Study of production, consumption, and transfer of wealth.' },
  { id: 'geog', name: 'Geography', faculty: 'Social Science', description: 'Study of places and the relationships between people and environments.' },
  { id: 'psy', name: 'Psychology', faculty: 'Social Science', description: 'Scientific study of the human mind and its functions.' },
  { id: 'soc', name: 'Sociology', faculty: 'Social Science', description: 'Study of the development, structure, and functioning of society.' },
  { id: 'anth', name: 'Anthropology', faculty: 'Social Science', description: 'Study of human societies and cultures and their development.' },
  { id: 'home', name: 'Home Science', faculty: 'Social Science', description: 'Scientific course of study on handling home and family life.' },

  // Faculty of Commerce & Vocational
  { id: 'com', name: 'Commerce (Accounts)', faculty: 'Vocational', description: 'Study of trade, accounting, finance, and business activities.' },
  { id: 'bba', name: 'BBA (Business Admin)', faculty: 'Vocational', description: 'Principles of business management and administration.' },
  { id: 'bca', name: 'BCA (Computer App)', faculty: 'Vocational', description: 'Software development and computer applications.' },
  { id: 'it', name: 'Information Technology', faculty: 'Vocational', description: 'Use of systems for storing, retrieving, and sending information.' },
  { id: 'bt', name: 'Biotechnology', faculty: 'Vocational', description: 'Use of living systems and organisms to develop products.' },
  { id: 'fd', name: 'Fashion Designing', faculty: 'Vocational', description: 'Art of applying design, aesthetics, and beauty to clothing.' },
  { id: 'mcvp', name: 'Mass Comm. & Video Prod.', faculty: 'Vocational', description: 'Journalism, media studies, and video production techniques.' }
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

const generateMockResources = (): Resource[] => {
  const resources: Resource[] = [];
  const types = [ResourceType.PYQ, ResourceType.NOTE, ResourceType.PYQ, ResourceType.SYLLABUS];
  let idCounter = 1;
  COLLEGES.slice(1, 10).forEach((college) => {
    const randomSubjects = SUBJECTS.filter(() => Math.random() > 0.6);
    randomSubjects.forEach((subject) => {
      const resourceCount = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < resourceCount; i++) {
        const pattern = Math.random() > 0.4 ? CoursePattern.NEP : CoursePattern.CBCS;
        const degreeLevel = Math.random() > 0.2 ? DegreeLevel.UG : DegreeLevel.PG;
        const maxSem = pattern === CoursePattern.CBCS ? 6 : 8;
        const sem = Math.floor(Math.random() * maxSem) + 1;
        const year = Math.floor(Math.random() * 5) + 2020;
        const type = types[Math.floor(Math.random() * types.length)];
        resources.push({
          id: `res-${idCounter++}`,
          title: `${subject.name} - ${type === ResourceType.PYQ ? 'Exam Paper' : 'Study Notes'}`,
          collegeId: college.id,
          subjectId: subject.id,
          semester: sem,
          year: year,
          type: type,
          pattern: pattern,
          degreeLevel: degreeLevel,
          downloadUrl: '#',
          size: '1.2 MB',
          downloadCount: Math.floor(Math.random() * 500),
          createdAt: Date.now() - Math.floor(Math.random() * 1000000000)
        });
      }
    });
  });
  return resources;
};

export const MOCK_RESOURCES = generateMockResources();