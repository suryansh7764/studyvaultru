import React, { useState, useRef } from 'react';
import { 
  Upload, FileText, CheckCircle, AlertCircle, Award, Gift, X, 
  Clock, ShieldAlert, ExternalLink, Settings, Lock, FileCheck, 
  Sparkles, Trophy, Gem, HelpCircle, ArrowRight, MousePointer2,
  Check, ShieldCheck
} from 'lucide-react';
import { User, ResourceType, Submission, CoursePattern, DegreeLevel } from '../types.ts';
import { SUBJECTS, SEMESTERS, COLLEGES } from '../constants.ts';
import LoginModal from './LoginModal.tsx';

interface SubmitPaperProps {
  user: User | null;
  userSubmissions: Submission[];
  onLogin: (uid: string, identifier: string, name: string, collegeId: string) => void;
  onSubmitPaper: (file: File, subjectId: string, semester: string, type: ResourceType, additional: {collegeId: string, pattern: CoursePattern, degreeLevel: DegreeLevel}) => Promise<void>;
}

const SubmitPaper: React.FC<SubmitPaperProps> = ({ user, userSubmissions, onLogin, onSubmitPaper }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [subjectId, setSubjectId] = useState('');
  const [semester, setSemester] = useState('');
  const [type, setType] = useState<ResourceType | ''>('');
  
  const [collegeId, setCollegeId] = useState('');
  const [pattern, setPattern] = useState<CoursePattern | ''>('');
  const [degreeLevel, setDegreeLevel] = useState<DegreeLevel | ''>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'bucket' | 'table' | 'permission' | 'general' | null>(null);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
  };

  const handleFile = (file: File) => {
    setError(null);
    setErrorType(null);
    if (file.type === "application/pdf") {
        if (file.size > 20 * 1024 * 1024) {
            setError("File size exceeds 20MB limit.");
            return;
        }
        setFile(file);
    } else {
        setError("Please upload a valid PDF file.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrorType(null);
    
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!file || !subjectId || !semester || !type || !collegeId || !pattern || !degreeLevel) {
      setError("Incomplete submission. Please fill all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmitPaper(file, subjectId, semester, type as ResourceType, {
          collegeId,
          pattern: pattern as CoursePattern,
          degreeLevel: degreeLevel as DegreeLevel
      });
      setSubmitted(true);
      setFile(null);
      resetFields();
    } catch (err: any) {
      console.error("Submission Error UI Catch:", err);
      const msg = err.message || "";
      if (msg.includes("BUCKET_MISSING")) {
          setError("Infrastructure Error: Storage bucket not configured.");
          setErrorType('bucket');
      } else if (msg.includes("PERMISSION_DENIED")) {
          setError("Security Error: Upload blocked by server policies.");
          setErrorType('permission');
      } else if (msg.includes("TABLE_MISSING")) {
          setError("Database Error: Submission table missing.");
          setErrorType('table');
      } else {
          setError(msg || "An unexpected error occurred during upload.");
          setErrorType('general');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetFields = () => {
    setSubjectId(''); setSemester(''); setType(''); setCollegeId(''); setPattern(''); setDegreeLevel('');
  };

  const handleLoginSuccess = (uid: string, identifier: string, name: string, collegeId: string) => {
      onLogin(uid, identifier, name, collegeId);
      setShowLoginModal(false);
  };

  return (
    <div className="relative min-h-screen pb-20 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-university-900/10 to-transparent -z-10"></div>
      <div className="absolute top-40 right-[-10%] w-[500px] h-[500px] bg-university-accent/5 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-40 left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-university-accent/10 border border-university-accent/20 text-university-accent text-xs font-black tracking-[0.2em] uppercase mb-6 shadow-sm">
            <Sparkles className="h-4 w-4" /> Global Knowledge Exchange
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-university-900 dark:text-white mb-6 tracking-tight">
            The <span className="text-university-accent">Contributor's</span> Vault
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            Turn your study notes and old exam papers into valuable community resources. 
            Earn credits for every approved submission.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Guidelines & Perks (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Credits Dashboard */}
            <div className="bg-university-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-university-accent opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
               <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                     <div className="p-3 rounded-2xl bg-university-accent/20 border border-white/10">
                        <Trophy className="h-6 w-6 text-university-accent" />
                     </div>
                     <h3 className="text-xl font-serif font-bold">Your Standing</h3>
                  </div>
                  <div className="mb-8">
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Available Balance</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-black text-white">{user?.credits || 0}</span>
                        <span className="text-university-accent font-bold text-sm tracking-widest uppercase">Credits</span>
                      </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                      <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-black uppercase text-slate-300">Next Milestone</span>
                          <span className="text-[10px] font-black text-university-accent">200 CR</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-university-accent rounded-full transition-all duration-1000" style={{ width: `${Math.min(((user?.credits || 0)/200)*100, 100)}%` }}></div>
                      </div>
                  </div>
               </div>
            </div>

            {/* Incentives Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-slate-800 shadow-xl">
               <h3 className="text-xl font-serif font-bold text-university-900 dark:text-white mb-6">Why Contribute?</h3>
               <div className="space-y-6">
                  <PerkItem icon={<Award className="text-amber-500" />} title="+5 Credits" desc="Earn points for every verified PDF you upload." />
                  <PerkItem icon={<Gem className="text-blue-500" />} title="Rank Up" desc="Unlock Scholar status and exclusive platform badges." />
                  <PerkItem icon={<ShieldCheck className="text-emerald-500" />} title="Community Impact" desc="Help thousands of Ranchi University students succeed." />
               </div>
            </div>

            {/* Quality Checklist */}
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-[2.5rem] p-8 border border-dashed border-gray-300 dark:border-slate-700">
               <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" /> Quality Check
               </h3>
               <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-xs font-bold text-gray-600 dark:text-gray-300">
                    <div className="h-5 w-5 rounded bg-white dark:bg-slate-700 flex items-center justify-center shrink-0 border border-gray-200 dark:border-slate-600"><Check className="h-3 w-3 text-green-500" /></div>
                    PDF must be clear and readable.
                  </li>
                  <li className="flex items-start gap-3 text-xs font-bold text-gray-600 dark:text-gray-300">
                    <div className="h-5 w-5 rounded bg-white dark:bg-slate-700 flex items-center justify-center shrink-0 border border-gray-200 dark:border-slate-600"><Check className="h-3 w-3 text-green-500" /></div>
                    Includes subject name and year.
                  </li>
                  <li className="flex items-start gap-3 text-xs font-bold text-gray-600 dark:text-gray-300">
                    <div className="h-5 w-5 rounded bg-white dark:bg-slate-700 flex items-center justify-center shrink-0 border border-gray-200 dark:border-slate-600"><Check className="h-3 w-3 text-green-500" /></div>
                    Maximum file size is 20MB.
                  </li>
               </ul>
            </div>
          </div>

          {/* Right Column: Submission Form (8 cols) */}
          <div className="lg:col-span-8">
            {submitted ? (
              <div className="h-full min-h-[600px] flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-green-100 dark:border-green-900/30 p-12 text-center shadow-2xl animate-in zoom-in-95 duration-500 relative overflow-hidden">
                {/* Success Animation Background */}
                <div className="absolute inset-0 pointer-events-none opacity-50">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-[100px] animate-pulse"></div>
                </div>
                
                <div className="relative z-10">
                    <div className="w-32 h-32 bg-green-100 dark:bg-green-900/40 text-green-600 rounded-[3rem] flex items-center justify-center mb-8 mx-auto shadow-xl">
                        <FileCheck className="h-16 w-16" />
                    </div>
                    <h2 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">Submission Captured!</h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-10 text-lg">
                        Your paper has been sent to the review vault. You'll receive <span className="font-bold text-green-600">5 Credits</span> once verified.
                    </p>
                    <button 
                        onClick={() => setSubmitted(false)} 
                        className="px-12 py-4 bg-university-900 dark:bg-white text-white dark:text-university-900 font-black text-xs uppercase tracking-widest rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all"
                    >
                        Submit Another Material
                    </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                
                {/* Admin/User Guided Errors (The RLS/Bucket fixes from previous iterations) */}
                {errorType === 'permission' && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-500 rounded-[2.5rem] p-10 shadow-2xl animate-in slide-in-from-top-4">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-amber-500 rounded-2xl text-white"><Lock className="h-6 w-6" /></div>
                            <h3 className="text-2xl font-serif font-bold text-amber-900 dark:text-amber-200">Policy Block (RLS)</h3>
                        </div>
                        <p className="text-sm text-amber-800 dark:text-amber-300 mb-8 leading-relaxed">
                            Server permissions are blocking the upload. Fix this in your **Supabase Dashboard**:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            <div className="bg-white/50 dark:bg-black/20 p-4 rounded-2xl text-[11px] font-bold text-amber-900/70">1. Open Storage -> Policies</div>
                            <div className="bg-white/50 dark:bg-black/20 p-4 rounded-2xl text-[11px] font-bold text-amber-900/70">2. Create New INSERT Policy</div>
                            <div className="bg-white/50 dark:bg-black/20 p-4 rounded-2xl text-[11px] font-bold text-amber-900/70">3. Target "authenticated" & "anon"</div>
                            <div className="bg-white/50 dark:bg-black/20 p-4 rounded-2xl text-[11px] font-bold text-amber-900/70">4. Set Expression to "true"</div>
                        </div>
                        <a href="https://supabase.com/dashboard/project/sjptcgmjokirbgeuehhm/storage/policies" target="_blank" className="inline-flex items-center gap-3 px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all">
                            Open Settings <ExternalLink className="h-4 w-4" />
                        </a>
                    </div>
                )}

                <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 md:p-14 shadow-2xl border border-gray-100 dark:border-slate-800 relative">
                    <form onSubmit={handleSubmit} className="space-y-10">
                        
                        {/* Error Banner */}
                        {error && !errorType && (
                            <div className="p-5 bg-red-50 dark:bg-red-900/20 border-2 border-red-100 dark:border-red-900/30 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-2">
                                <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg"><ShieldAlert className="h-5 w-5 text-red-600 dark:text-red-400" /></div>
                                <p className="text-xs text-red-700 dark:text-red-300 font-black uppercase tracking-widest">{error}</p>
                            </div>
                        )}

                        {/* Interactive Dropzone */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-2 block">1. Upload PDF Document</label>
                            <div 
                                className={`group relative h-72 border-4 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center transition-all duration-500 cursor-pointer overflow-hidden ${
                                    dragActive ? 'border-university-accent bg-university-accent/5 scale-[1.02]' : 
                                    file ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 
                                    'border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/50 hover:border-university-accent hover:bg-white dark:hover:bg-slate-900'
                                }`}
                                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                                onClick={() => inputRef.current?.click()}
                            >
                                <input ref={inputRef} type="file" className="hidden" accept="application/pdf" onChange={handleChange} />
                                
                                {file ? (
                                    <div className="flex flex-col items-center animate-in zoom-in-95">
                                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/40 rounded-3xl flex items-center justify-center mb-4 shadow-lg">
                                            <FileCheck className="h-10 w-10 text-green-600" />
                                        </div>
                                        <p className="font-bold text-gray-900 dark:text-white text-lg">{file.name}</p>
                                        <p className="text-[10px] text-green-600 font-black uppercase tracking-widest mt-2">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready for Vault</p>
                                        <button 
                                            type="button" 
                                            onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                            className="mt-6 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors border border-gray-100 dark:border-slate-700 shadow-sm"
                                        >
                                            Change File
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center group-hover:scale-105 transition-transform duration-500">
                                        <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-gray-100 dark:border-slate-700">
                                            <Upload className="h-8 w-8 text-university-accent" />
                                        </div>
                                        <p className="text-xl font-bold text-gray-700 dark:text-gray-300">Drag & Drop PDF here</p>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-3">Or click to select from storage</p>
                                    </div>
                                )}
                                
                                {dragActive && (
                                    <div className="absolute inset-0 bg-university-accent/10 backdrop-blur-[2px] flex items-center justify-center">
                                        <MousePointer2 className="h-12 w-12 text-university-accent animate-bounce" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Metadata Selection */}
                        <div className="space-y-8">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-2 block">2. Categorize Your Material</label>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <CustomSelect 
                                        label="College Institution" 
                                        value={collegeId} 
                                        onChange={(e) => setCollegeId(e.target.value)}
                                        options={COLLEGES.filter(c => c.id !== 'all').map(c => ({ value: c.id, label: c.name }))}
                                        placeholder="Select Source College"
                                    />
                                    <CustomSelect 
                                        label="Honors Subject" 
                                        value={subjectId} 
                                        onChange={(e) => setSubjectId(e.target.value)}
                                        options={SUBJECTS.filter(s => s.id !== 'all').map(s => ({ value: s.id, label: s.name }))}
                                        placeholder="Select Department"
                                    />
                                    <CustomSelect 
                                        label="Target Semester" 
                                        value={semester} 
                                        onChange={(e) => setSemester(e.target.value)}
                                        options={SEMESTERS.map(s => ({ value: s.toString(), label: `Semester ${s}` }))}
                                        placeholder="Select Semester"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <CustomSelect 
                                        label="Degree Level" 
                                        value={degreeLevel} 
                                        onChange={(e) => setDegreeLevel(e.target.value as DegreeLevel)}
                                        options={[{ value: DegreeLevel.UG, label: 'Undergraduate (UG)' }, { value: DegreeLevel.PG, label: 'Postgraduate (PG)' }]}
                                        placeholder="Select Degree Level"
                                    />
                                    <CustomSelect 
                                        label="Curriculum Pattern" 
                                        value={pattern} 
                                        onChange={(e) => setPattern(e.target.value as CoursePattern)}
                                        options={[{ value: CoursePattern.NEP, label: 'NEP (New Policy)' }, { value: CoursePattern.CBCS, label: 'CBCS (Old Pattern)' }]}
                                        placeholder="Select Pattern"
                                    />
                                    
                                    <div>
                                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 block ml-1">Resource Category</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[ResourceType.PYQ, ResourceType.NOTE, ResourceType.SYLLABUS].map((t) => (
                                                <button 
                                                    key={t} 
                                                    type="button" 
                                                    onClick={() => setType(t)} 
                                                    className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 transition-all shadow-sm ${
                                                        type === t 
                                                        ? 'bg-university-900 dark:bg-university-accent text-white border-university-900 dark:border-university-accent' 
                                                        : 'bg-white dark:bg-slate-800 text-gray-500 border-gray-100 dark:border-slate-700 hover:border-university-accent/30'
                                                    }`}
                                                >
                                                    {t.split(' ')[0]}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full relative group h-20 bg-university-900 dark:bg-university-accent rounded-[1.5rem] overflow-hidden shadow-2xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:scale-100"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                <div className="relative z-10 flex items-center justify-center gap-4 text-white">
                                    {isSubmitting ? (
                                        <><Clock className="animate-spin h-6 w-6" /> <span className="font-black text-xs uppercase tracking-[0.3em]">Processing Secure Upload...</span></>
                                    ) : (
                                        <><Award className="h-6 w-6 group-hover:rotate-12 transition-transform" /> <span className="font-black text-xs uppercase tracking-[0.3em]">Authenticate & Upload to Vault</span></>
                                    )}
                                </div>
                            </button>
                            <p className="text-center text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-6">
                                By uploading, you agree to our Terms of Service & educational guidelines.
                            </p>
                        </div>
                    </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={handleLoginSuccess} />
    </div>
  );
};

// --- Helper Components ---

const PerkItem = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
    <div className="flex items-start gap-4 p-5 rounded-[1.5rem] bg-gray-50 dark:bg-slate-800/40 border border-transparent hover:border-gray-200 dark:hover:border-slate-700 transition-all group">
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-md group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <div>
            <h4 className="font-black text-xs uppercase tracking-widest text-slate-900 dark:text-white mb-1">{title}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{desc}</p>
        </div>
    </div>
);

const CustomSelect = ({ label, value, onChange, options, placeholder }: { label: string, value: string, onChange: (e: any) => void, options: {value: string, label: string}[], placeholder: string }) => (
    <div className="space-y-2">
        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">{label}</label>
        <div className="relative group">
            <select 
                className="w-full appearance-none p-4 pr-10 bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-2xl outline-none focus:border-university-accent dark:focus:border-university-accent dark:text-white text-sm font-bold transition-all shadow-sm group-hover:bg-white dark:group-hover:bg-slate-800"
                value={value}
                onChange={onChange}
            >
                <option value="">{placeholder}</option>
                {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-university-accent transition-colors">
                <ArrowRight className="h-4 w-4 rotate-90" />
            </div>
        </div>
    </div>
);

export default SubmitPaper;