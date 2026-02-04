
import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Award, Gift, LogIn, X, Clock, User as UserIcon, Building2, Mail, Phone } from 'lucide-react';
import { User, ResourceType, Submission, CoursePattern, DegreeLevel } from '../types';
import { SUBJECTS, SEMESTERS, COLLEGES } from '../constants';

interface SubmitPaperProps {
  user: User | null;
  userSubmissions: Submission[];
  onLogin: (uid: string, identifier: string, name: string, collegeId: string) => void;
  onSubmitPaper: (file: File, subjectId: string, semester: string, type: ResourceType, additional: {collegeId: string, pattern: CoursePattern, degreeLevel: DegreeLevel}) => void;
}

const SubmitPaper: React.FC<SubmitPaperProps> = ({ user, userSubmissions, onLogin, onSubmitPaper }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [subjectId, setSubjectId] = useState('');
  const [semester, setSemester] = useState('');
  const [type, setType] = useState<ResourceType | ''>('');
  
  // New mandatory fields for proper resource creation
  const [collegeId, setCollegeId] = useState('');
  const [pattern, setPattern] = useState<CoursePattern | ''>('');
  const [degreeLevel, setDegreeLevel] = useState<DegreeLevel | ''>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Login Modal State
  const [showLoginModal, setShowLoginModal] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type === "application/pdf") {
      setFile(file);
    } else {
      alert("Please upload a PDF file.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!file || !subjectId || !semester || !type || !collegeId || !pattern || !degreeLevel) {
      alert("Please fill all mandatory fields and upload a file.");
      return;
    }

    setIsSubmitting(true);

    // Simulate upload delay
    setTimeout(() => {
      onSubmitPaper(file, subjectId, semester, type as ResourceType, {
          collegeId,
          pattern: pattern as CoursePattern,
          degreeLevel: degreeLevel as DegreeLevel
      });
      setIsSubmitting(false);
      setSubmitted(true);
      
      // Reset form after 4 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFile(null);
        setSubjectId('');
        setSemester('');
        setType('');
        setCollegeId('');
        setPattern('');
        setDegreeLevel('');
      }, 4000);
    }, 2000);
  };

  const handleLoginSuccess = (uid: string, identifier: string, name: string, collegeId: string) => {
      onLogin(uid, identifier, name, collegeId);
      setShowLoginModal(false);
  };

  const progressToReward = Math.min(((user?.credits || 0) / 200) * 100, 100);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="text-center mb-12">
        <span className="inline-block py-1 px-3 rounded-full bg-university-accent/10 text-university-accent text-xs font-bold tracking-widest uppercase mb-4">
           Contribute & Earn
        </span>
        <h1 className="text-4xl font-serif font-bold text-university-900 dark:text-white mb-4">
          Submit Papers & Get Rewarded
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Help your juniors by uploading Previous Year Questions or Notes. Your approved items will be visible to everyone!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        
        {/* Left: Credit Status Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-university-900 dark:bg-slate-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 text-university-accent">
                <Award className="h-6 w-6" />
                <span className="font-bold tracking-wider text-sm uppercase">Your Credits</span>
              </div>
              <div className="text-5xl font-bold mb-4">{user?.credits || 0}</div>
              
              <div className="mb-2 flex justify-between text-xs font-medium text-slate-300">
                 <span>Progress to Reward</span>
                 <span>200 Goal</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 mb-6">
                 <div className="bg-university-accent h-2 rounded-full transition-all duration-1000" style={{ width: `${progressToReward}%` }}></div>
              </div>

              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                 <div className="flex items-start gap-3">
                    <Gift className="h-5 w-5 text-amber-300 mt-0.5" />
                    <div>
                       <p className="font-bold text-sm mb-1">Rewards Program</p>
                       <p className="text-xs text-slate-200 leading-relaxed">
                         Get <span className="text-white font-bold">5 Credits</span> for every approved PDF. Reach <span className="text-white font-bold">200 Credits</span> to unlock <span className="text-amber-300 font-bold">Awards or Money</span>!
                       </p>
                    </div>
                 </div>
              </div>
            </div>
            
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-university-accent/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 p-6 opacity-5">
               <Award className="h-32 w-32" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm">
             <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
               <AlertCircle className="h-4 w-4 text-university-accent" />
               Guidelines
             </h3>
             <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
               <li className="flex items-start gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5"></div>
                 <span>Approved documents appear instantly in the library.</span>
               </li>
               <li className="flex items-start gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5"></div>
                 <span>Credits are awarded after <strong>Admin Approval</strong>.</span>
               </li>
             </ul>
          </div>
        </div>

        {/* Right: Upload Form */}
        <div className="lg:col-span-2">
           {submitted ? (
             <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-green-200 dark:border-green-900 p-8 text-center animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6">
                   <CheckCircle className="h-10 w-10" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Submission Successful!</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                   Your paper is now <strong>Pending Approval</strong>. It will be published for all students once verified.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors font-medium text-sm"
                >
                  Submit Another Paper
                </button>
             </div>
           ) : (
             <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-slate-800">
                
                {/* Drag and Drop Area */}
                <div 
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 mb-8 cursor-pointer ${
                    dragActive 
                      ? 'border-university-accent bg-university-accent/5' 
                      : file 
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                        : 'border-gray-300 dark:border-slate-700 hover:border-university-accent hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                >
                  <input 
                    ref={inputRef}
                    type="file" 
                    className="hidden" 
                    accept="application/pdf"
                    onChange={handleChange}
                  />
                  
                  {file ? (
                    <div className="flex flex-col items-center">
                       <FileText className="h-12 w-12 text-green-500 mb-3" />
                       <p className="font-bold text-gray-900 dark:text-white">{file.name}</p>
                       <p className="text-xs text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                       <span className="mt-4 text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">Ready to Upload</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                       <Upload className={`h-12 w-12 mb-4 ${dragActive ? 'text-university-accent' : 'text-gray-400'}`} />
                       <p className="font-bold text-gray-900 dark:text-white text-lg">
                         Drag & drop your PDF here
                       </p>
                       <p className="text-gray-500 text-sm mt-2">Browse your local files</p>
                    </div>
                  )}
                </div>

                {/* Metadata Fields */}
                <div className="space-y-5">
                   <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">College Name</label>
                        <select 
                          className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:border-university-accent outline-none dark:text-white text-sm"
                          value={collegeId}
                          onChange={(e) => setCollegeId(e.target.value)}
                        >
                          <option value="">Choose your college</option>
                          {COLLEGES.filter(c => c.id !== 'all').map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Subject</label>
                        <select 
                          className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:border-university-accent outline-none dark:text-white text-sm"
                          value={subjectId}
                          onChange={(e) => setSubjectId(e.target.value)}
                        >
                          <option value="">Select Subject</option>
                          {SUBJECTS.filter(s => s.id !== 'all').map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Semester</label>
                        <select 
                          className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:border-university-accent outline-none dark:text-white text-sm"
                          value={semester}
                          onChange={(e) => setSemester(e.target.value)}
                        >
                           <option value="">Select Semester</option>
                           {SEMESTERS.map(s => (
                             <option key={s} value={s}>Semester {s}</option>
                           ))}
                        </select>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Degree Level</label>
                        <select 
                          className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:border-university-accent outline-none dark:text-white text-sm"
                          value={degreeLevel}
                          onChange={(e) => setDegreeLevel(e.target.value as DegreeLevel)}
                        >
                           <option value="">Select Level</option>
                           <option value={DegreeLevel.UG}>Undergraduate (UG)</option>
                           <option value={DegreeLevel.PG}>Postgraduate (PG)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Course Pattern</label>
                        <select 
                          className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:border-university-accent outline-none dark:text-white text-sm"
                          value={pattern}
                          onChange={(e) => setPattern(e.target.value as CoursePattern)}
                        >
                           <option value="">Select Pattern</option>
                           <option value={CoursePattern.NEP}>NEP (New)</option>
                           <option value={CoursePattern.CBCS}>CBCS (Old)</option>
                        </select>
                      </div>
                   </div>

                   <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Type</label>
                      <div className="grid grid-cols-3 gap-3">
                         {[ResourceType.PYQ, ResourceType.NOTE, ResourceType.SYLLABUS].map((t) => (
                           <button
                             key={t}
                             type="button"
                             onClick={() => setType(t)}
                             className={`py-2.5 px-2 rounded-lg text-sm font-medium border transition-all ${
                               type === t 
                                 ? 'bg-university-accent text-white border-university-accent' 
                                 : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:border-gray-300'
                             }`}
                           >
                             {t === ResourceType.PYQ ? 'Exam Paper' : t === ResourceType.NOTE ? 'Notes' : 'Syllabus'}
                           </button>
                         ))}
                      </div>
                   </div>

                   <button
                     type="submit"
                     disabled={isSubmitting || !file}
                     className="w-full mt-6 py-4 rounded-xl bg-university-900 dark:bg-university-accent hover:bg-university-800 dark:hover:bg-amber-600 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                   >
                     {isSubmitting ? (
                       <>
                         <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                         <span>Uploading Paper...</span>
                       </>
                     ) : (
                       <>
                         <span>Submit to Community</span>
                         <Award className="h-5 w-5" />
                       </>
                     )}
                   </button>
                </div>
             </form>
           )}
        </div>
      </div>

      {/* History Table Unchanged */}
      {user && userSubmissions.length > 0 && (
         <div className="mt-16 border-t border-gray-200 dark:border-slate-800 pt-12">
            <h3 className="text-2xl font-serif font-bold text-university-900 dark:text-white mb-6">Your Contribution History</h3>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm">
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
                   <thead className="bg-gray-50 dark:bg-slate-800 text-xs uppercase font-bold">
                     <tr>
                       <th className="px-6 py-4">File Name</th>
                       <th className="px-6 py-4">Date</th>
                       <th className="px-6 py-4">Status</th>
                       <th className="px-6 py-4 text-right">Credits</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                     {userSubmissions.sort((a,b) => b.timestamp - a.timestamp).map((sub) => (
                       <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                         <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            {sub.fileName}
                         </td>
                         <td className="px-6 py-4">
                            {new Date(sub.timestamp).toLocaleDateString()}
                         </td>
                         <td className="px-6 py-4">
                            {sub.status === 'pending' && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
                                   <Clock className="h-3 w-3" /> Pending Review
                                </span>
                            )}
                            {sub.status === 'approved' && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/30">
                                   <CheckCircle className="h-3 w-3" /> Live on Site
                                </span>
                            )}
                            {sub.status === 'rejected' && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30">
                                   <X className="h-3 w-3" /> Discarded
                                </span>
                            )}
                         </td>
                         <td className="px-6 py-4 text-right font-bold text-university-accent">
                            {sub.status === 'approved' ? `+${sub.creditsEarned}` : '-'}
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
         </div>
      )}

      {/* Login Modal */}
      {/* Note: In a real app, we should import LoginModal component, but to avoid circular deps in this simplified structure, we reuse the existing one or conditionally render. 
          Actually, we can just use the prop onLogin which opens the main app login modal or render a local one. 
          For consistency with other components, we should use the same LoginModal component. 
          However, SubmitPaper is imported in App.tsx which imports LoginModal. So we can't import LoginModal here easily without circular dep if types share file.
          But we can just reuse the one passed from App if we lifted state up, OR we just render the modal here if we import it.
          Let's assume we import LoginModal from components/LoginModal.
      */}
      {/* Re-using the imported LoginModal component for this specific flow */}
      {/* We need to import LoginModal at the top of file */}
      {/* Since we can't easily change imports in this XML block without full file content, I'm assuming LoginModal is not imported. 
          Wait, the previous file had LoginModal defined locally or imported. 
          Ah, I see LoginModal is imported in App.tsx. 
          I will just invoke the prop if needed or render inline if I can't import.
          Actually, I will import it.
      */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLoginSuccess}
      />
    </div>
  );
};

// We need to import LoginModal to use it in JSX
import LoginModal from './LoginModal';

export default SubmitPaper;
