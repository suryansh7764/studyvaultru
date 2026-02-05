
import React, { useState, useRef, useEffect } from 'react';
import { Submission, Resource, ResourceType, CoursePattern, DegreeLevel, LoginRecord } from '../types';
import { 
  CheckCircle, XCircle, FileText, User as UserIcon, ShieldCheck, Mail, 
  Inbox, Archive, ArrowLeft, Paperclip, Check, X, LogOut, 
  LayoutDashboard, Users, Settings, Lock, Key, Loader2, 
  Stamp, FolderOpen, Trash2, Plus, Upload, Eye, Edit2, 
  Save, ExternalLink, Activity, Smartphone, ShieldAlert, AlertCircle, Download, Clock, HardDrive, Database, Copy, Terminal,
  ArrowRight
} from 'lucide-react';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { SUBJECTS, SEMESTERS, PATTERNS, DEGREE_LEVELS, COLLEGES } from '../constants';
import { db } from '../services/db';

interface AdminDashboardProps {
  submissions: Submission[];
  resources: Resource[];
  loginRecords: LoginRecord[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onUpdateSubmission: (id: string, updates: Partial<Submission>) => void;
  onDeleteSubmission: (id: string) => void;
  onAddResource: (resource: Resource) => void;
  onDeleteResource: (id: string) => void;
  onExit: () => void;
}

type AdminView = 'dashboard' | 'inbox' | 'resources' | 'users' | 'activity' | 'settings' | 'setup';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ submissions, resources, loginRecords, onApprove, onReject, onUpdateSubmission, onDeleteSubmission, onAddResource, onDeleteResource, onExit }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('admin');
  const [error, setError] = useState('');

  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [inboxStatusFilter, setInboxStatusFilter] = useState<'pending' | 'approved'>('pending');
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Health State
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  // Manual Upload State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadSubject, setUploadSubject] = useState('');
  const [uploadSemester, setUploadSemester] = useState('');
  const [uploadType, setUploadType] = useState<ResourceType | ''>('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadPattern, setUploadPattern] = useState('');
  const [uploadDegree, setUploadDegree] = useState('');
  const [uploadCollege, setUploadCollege] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const uploadFileInputRef = useRef<HTMLInputElement>(null);

  // Settings State
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [settingsMsg, setSettingsMsg] = useState<{type: 'success'|'error', text: string} | null>(null);

  const filteredInboxSubmissions = submissions.filter(s => s.status === inboxStatusFilter);
  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  
  const uniqueUsers = Array.from(new Set(submissions.map(s => s.userIdentifier))).map((id: string) => {
      const userSubs = submissions.filter(s => s.userIdentifier === id);
      return {
          identifier: id,
          totalSubmissions: userSubs.length,
          approved: userSubs.filter(s => s.status === 'approved').length,
          rejected: userSubs.filter(s => s.status === 'rejected').length,
          lastActive: Math.max(...userSubs.map(s => s.timestamp))
      };
  });

  useEffect(() => {
    if (isAuthenticated) {
        checkSystemHealth();
    }
  }, [isAuthenticated]);

  const checkSystemHealth = async () => {
      setCheckingHealth(true);
      const status = await db.checkSystemHealth();
      setHealthStatus(status);
      setCheckingHealth(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'suryanshkishor@gmail.com' && password === adminPassword) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    setActiveView('dashboard');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const MASTER_SQL = `-- 1. Create Tables (Safe)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  name TEXT,
  college_id TEXT,
  credits INTEGER DEFAULT 0,
  assessment_history JSONB DEFAULT '[]',
  saved_resources TEXT[] DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  title TEXT,
  college_id TEXT,
  subject_id TEXT,
  semester INTEGER,
  year INTEGER,
  type TEXT,
  pattern TEXT,
  degree_level TEXT,
  download_url TEXT,
  size TEXT,
  download_count INTEGER DEFAULT 0,
  created_at BIGINT
);

CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  user_identifier TEXT,
  file_name TEXT,
  file_path TEXT,
  subject_id TEXT,
  subject_name TEXT,
  semester INTEGER,
  type TEXT,
  status TEXT DEFAULT 'pending',
  timestamp BIGINT,
  credits_earned INTEGER DEFAULT 0,
  pattern TEXT,
  degree_level TEXT,
  college_id TEXT
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  email TEXT,
  item_name TEXT,
  subject TEXT,
  semester TEXT,
  details TEXT,
  status TEXT DEFAULT 'pending',
  timestamp BIGINT
);

CREATE TABLE IF NOT EXISTS login_history (
  id TEXT PRIMARY KEY,
  identifier TEXT,
  timestamp BIGINT,
  method TEXT
);

-- 2. Enable RLS (Safe to re-run)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 3. Cleanup & Create Policies (Prevents 'Policy already exists' errors)

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Resources Policies
DROP POLICY IF EXISTS "Resources are public" ON resources;
CREATE POLICY "Resources are public" ON resources FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can modify resources" ON resources;
CREATE POLICY "Admin can modify resources" ON resources FOR ALL USING (auth.jwt()->>'email' = 'suryanshkishor@gmail.com');

-- Submissions Policies
DROP POLICY IF EXISTS "Anyone can submit papers" ON submissions;
CREATE POLICY "Anyone can submit papers" ON submissions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view submissions" ON submissions;
CREATE POLICY "Anyone can view submissions" ON submissions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can update submissions" ON submissions;
CREATE POLICY "Admin can update submissions" ON submissions FOR UPDATE USING (auth.jwt()->>'email' = 'suryanshkishor@gmail.com');

-- Storage Policies (Buckets must be created manually first)
DROP POLICY IF EXISTS "Storage - Allow Public Uploads" ON storage.objects;
CREATE POLICY "Storage - Allow Public Uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('resources', 'submissions'));

DROP POLICY IF EXISTS "Storage - Allow Public Access" ON storage.objects;
CREATE POLICY "Storage - Allow Public Access" ON storage.objects FOR SELECT USING (bucket_id IN ('resources', 'submissions'));
`;

  const copySql = () => {
    navigator.clipboard.writeText(MASTER_SQL);
    showToast("SQL Script Copied to Clipboard!");
  };

  const handleSubmissionAction = async (id: string, action: 'approve' | 'reject') => {
    if (action === 'approve') {
       setIsProcessing(id);
       await onApprove(id);
       setIsProcessing(null);
       setSelectedSubmissionId(null);
       showToast("Student Rewarded. Verification Complete.");
    } else {
       onReject(id);
       setSelectedSubmissionId(null);
       showToast("Submission Rejected.");
    }
  };

  const handleDeleteResourceAction = (id: string) => {
      if(window.confirm("Are you sure you want to delete this resource permanently?")) {
          onDeleteResource(id);
          showToast("Resource removed from Library.");
      }
  };

  const handleUploadDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleUploadDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleUploadFile = (file: File) => {
    if (file.type === "application/pdf") {
      setUploadFile(file);
      if (!uploadTitle) setUploadTitle(file.name.replace('.pdf', ''));
    } else {
      alert("Please upload a PDF file.");
    }
  };

  const applyWatermark = async (fileUrl: string): Promise<string> => {
    try {
        const pdfBytes = await fetch(fileUrl).then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const pages = pdfDoc.getPages();
        const watermarkText = 'STUDYVAULT';
        const textSize = 50;

        pages.forEach(page => {
            const { width, height } = page.getSize();
            const textWidth = font.widthOfTextAtSize(watermarkText, textSize);
            page.drawText(watermarkText, {
                x: width / 2 - textWidth / 2,
                y: height / 2 - 50,
                size: textSize,
                font: font,
                color: rgb(0.9, 0.1, 0.1),
                opacity: 0.1,
                rotate: degrees(45),
            });
        });

        const modifiedPdfBytes = await pdfDoc.save();
        const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
        return URL.createObjectURL(blob);
    } catch (e) {
        console.error("Watermark failed", e);
        return fileUrl;
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadSubject || !uploadSemester || !uploadType || !uploadTitle || !uploadPattern || !uploadDegree || !uploadCollege) {
        alert("All metadata fields are mandatory.");
        return;
    }
    
    setIsProcessing('upload');
    try {
        const tempUrl = URL.createObjectURL(uploadFile);
        const finalUrl = await applyWatermark(tempUrl);
        const response = await fetch(finalUrl);
        const blob = await response.blob();
        
        const resourceId = `admin-up-${Date.now()}`;
        const publicUrl = await db.saveFile(resourceId, blob);
        
        if (!publicUrl) {
            throw new Error("Storage upload failed. Check if 'resources' bucket exists.");
        }

        const newResource: Resource = {
            id: resourceId,
            title: uploadTitle,
            collegeId: uploadCollege,
            subjectId: uploadSubject,
            semester: parseInt(uploadSemester),
            year: new Date().getFullYear(),
            type: uploadType as ResourceType,
            pattern: uploadPattern as CoursePattern,
            degreeLevel: uploadDegree as DegreeLevel,
            downloadUrl: publicUrl,
            size: `${(uploadFile.size / 1024 / 1024).toFixed(2)} MB`,
            downloadCount: 0,
            createdAt: Date.now()
        };

        await onAddResource(newResource);
        
        showToast("Success! Published to public library.");
        setIsUploadModalOpen(false);
        resetForm();
    } catch (err: any) {
        console.error(err);
        alert(`Failed to publish: ${err.message}`);
    } finally {
        setIsProcessing(null);
    }
  };

  const resetForm = () => {
    setUploadFile(null);
    setUploadTitle('');
    setUploadSubject('');
    setUploadSemester('');
    setUploadType('');
    setUploadPattern('');
    setUploadDegree('');
    setUploadCollege('');
  };

  const handleReviewDownload = async (subId: string) => {
      const url = await db.getFileUrl(`sub-${subId}`);
      if (url) {
          window.open(url, '_blank');
      } else {
          alert("File link missing.");
      }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsMsg(null);

    if (currentPwd !== adminPassword) {
      setSettingsMsg({ type: 'error', text: 'Current password is incorrect.' });
      return;
    }
    if (newPwd.length < 4) {
      setSettingsMsg({ type: 'error', text: 'Minimum 4 characters required.' });
      return;
    }
    if (newPwd !== confirmPwd) {
      setSettingsMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setAdminPassword(newPwd);
    setSettingsMsg({ type: 'success', text: 'Password changed.' });
    setCurrentPwd('');
    setNewPwd('');
    setConfirmPwd('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-white/5">
          <div className="bg-university-900 p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-university-accent/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/10">
               <ShieldCheck className="h-10 w-10 text-university-accent" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-white tracking-tight">Admin Console</h2>
            <p className="text-slate-400 text-sm mt-2 font-medium">Verify Identity</p>
          </div>
          
          <form onSubmit={handleLogin} className="p-10 space-y-6">
            <div>
               <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Admin Email</label>
               <input 
                 type="email" 
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-university-accent rounded-xl focus:outline-none transition-all dark:text-white"
                 placeholder="admin@studyvault.com"
               />
            </div>
            <div>
               <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Secret Key</label>
               <input 
                 type="password" 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-university-accent rounded-xl focus:outline-none transition-all dark:text-white"
                 placeholder="••••••••"
               />
            </div>

            {error && (
               <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl flex items-center gap-2 border border-red-100 dark:border-red-900/30">
                  <XCircle className="h-4 w-4" /> {error}
               </div>
            )}

            <button 
              type="submit"
              className="w-full bg-university-900 hover:bg-black text-white font-bold py-4 rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 group"
            >
              <Lock className="h-4 w-4 group-hover:scale-110 transition-transform" /> Sign In
            </button>
            
            <button 
                type="button" 
                onClick={onExit}
                className="w-full text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 uppercase tracking-widest"
            >
                Back to Site
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex relative transition-colors">
      
      {toastMessage && (
         <div className="fixed top-6 right-6 z-[100] animate-in slide-in-from-top-4 fade-in">
             <div className="bg-university-900 text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-xl">
                 <CheckCircle className="h-6 w-6 text-green-400" />
                 <p className="font-bold text-sm">{toastMessage}</p>
             </div>
         </div>
      )}

      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-2xl shadow-2xl border border-gray-200 dark:border-slate-800 scale-100 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100 dark:border-slate-800">
                 <div className="flex items-center gap-3">
                    <div className="bg-university-accent p-2 rounded-xl text-white">
                       <Plus className="h-5 w-5" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-university-900 dark:text-white">Manual Library Upload</h3>
                 </div>
                 <button onClick={() => setIsUploadModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2">
                    <X className="h-6 w-6" />
                 </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-6">
                 <div 
                   onDragEnter={handleUploadDrag} 
                   onDragOver={handleUploadDrag} 
                   onDragLeave={handleUploadDrag} 
                   onDrop={handleUploadDrop}
                   onClick={() => uploadFileInputRef.current?.click()}
                   className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
                     dragActive ? 'border-university-accent bg-university-accent/5' : 
                     uploadFile ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 
                     'border-gray-300 dark:border-slate-700 hover:border-university-accent'
                   }`}
                 >
                    <input ref={uploadFileInputRef} type="file" className="hidden" accept="application/pdf" onChange={(e) => e.target.files && handleUploadFile(e.target.files[0])} />
                    {uploadFile ? (
                      <div className="flex flex-col items-center">
                         <FileText className="h-12 w-12 text-green-500 mb-2" />
                         <p className="font-bold text-gray-900 dark:text-white">{uploadFile.name}</p>
                         <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-widest">{(uploadFile.size / 1024 / 1024).toFixed(2)} MB • Ready</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                         <Upload className="h-10 w-10 text-gray-400 mb-3" />
                         <p className="font-bold text-gray-600 dark:text-gray-300">Drag PDF or Click to Select</p>
                         <p className="text-xs text-gray-400 mt-2">Maximum file size: 20MB</p>
                      </div>
                    )}
                 </div>

                 <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Resource Display Title</label>
                    <input 
                      type="text" 
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-university-accent rounded-xl focus:outline-none transition-all dark:text-white"
                      placeholder="e.g. Physics CC-3 (2024) - Mechanics"
                    />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Select College</label>
                        <select value={uploadCollege} onChange={(e) => setUploadCollege(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border-none outline-none dark:text-white">
                           <option value="">Choose Institution</option>
                           {COLLEGES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Subject Honors</label>
                        <select value={uploadSubject} onChange={(e) => setUploadSubject(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border-none outline-none dark:text-white">
                           <option value="">Choose Department</option>
                           {SUBJECTS.filter(s => s.id !== 'all').map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Target Semester</label>
                        <select value={uploadSemester} onChange={(e) => setUploadSemester(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border-none outline-none dark:text-white">
                           <option value="">Choose Semester</option>
                           {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Material Type</label>
                        <select value={uploadType} onChange={(e) => setUploadType(e.target.value as any)} className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border-none outline-none dark:text-white">
                           <option value="">Choose Type</option>
                           <option value={ResourceType.PYQ}>Question Paper</option>
                           <option value={ResourceType.NOTE}>Lecture Notes</option>
                           <option value={ResourceType.SYLLABUS}>Syllabus</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Degree Level</label>
                        <select value={uploadDegree} onChange={(e) => setUploadDegree(e.target.value as any)} className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border-none outline-none dark:text-white">
                           <option value="">Choose Level</option>
                           <option value={DegreeLevel.UG}>Undergraduate (UG)</option>
                           <option value={DegreeLevel.PG}>Postgraduate (PG)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Curriculum Pattern</label>
                        <select value={uploadPattern} onChange={(e) => setUploadPattern(e.target.value as any)} className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border-none outline-none dark:text-white">
                           <option value="">Choose Pattern</option>
                           <option value={CoursePattern.CBCS}>CBCS (Old)</option>
                           <option value={CoursePattern.NEP}>NEP (New)</option>
                        </select>
                    </div>
                 </div>

                 <button 
                    type="submit" 
                    disabled={isProcessing === 'upload' || !uploadFile}
                    className="w-full py-5 bg-university-900 hover:bg-black text-white font-bold rounded-2xl shadow-xl shadow-university-900/20 flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                 >
                    {isProcessing === 'upload' ? <><Loader2 className="h-5 w-5 animate-spin" /> Watermarking & Uploading...</> : <><Stamp className="h-5 w-5" /> Authenticate & Publish</>}
                 </button>
              </form>
           </div>
        </div>
      )}

      <aside className="w-72 bg-university-900 text-white flex flex-col fixed inset-y-0 left-0 z-50 border-r border-white/5">
         <div className="p-8 flex items-center gap-4 border-b border-white/5">
            <div className="bg-university-accent p-2 rounded-xl shadow-lg shadow-university-accent/20">
               <ShieldCheck className="h-7 w-7 text-white" />
            </div>
            <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight">Admin</span>
                <span className="text-[10px] text-university-accent uppercase tracking-[0.2em] font-bold">Controller</span>
            </div>
         </div>
         
         <nav className="flex-1 p-6 space-y-3">
            <SidebarItem icon={<LayoutDashboard />} label="Summary" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
            <SidebarItem icon={<Inbox />} label="Submission Inbox" active={activeView === 'inbox'} onClick={() => setActiveView('inbox')} badge={pendingCount} />
            <SidebarItem icon={<FolderOpen />} label="Manage Library" active={activeView === 'resources'} onClick={() => setActiveView('resources')} />
            <SidebarItem icon={<Users />} label="Student Base" active={activeView === 'users'} onClick={() => setActiveView('users')} />
            <SidebarItem icon={<Activity />} label="Security Logs" active={activeView === 'activity'} onClick={() => setActiveView('activity')} />
            <SidebarItem icon={<Terminal />} label="Infrastructure Setup" active={activeView === 'setup'} onClick={() => setActiveView('setup')} />
            <SidebarItem icon={<Settings />} label="System Config" active={activeView === 'settings'} onClick={() => setActiveView('settings')} />
         </nav>
         
         <div className="p-6 border-t border-white/5 bg-black/20">
            <div className="flex items-center gap-4 mb-6 px-2">
               <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-university-accent to-orange-600 flex items-center justify-center font-bold text-xl shadow-xl">S</div>
               <div className="overflow-hidden">
                  <p className="text-sm font-bold truncate">Suryansh</p>
                  <p className="text-[10px] text-slate-400 truncate">suryanshkishor@gmail.com</p>
               </div>
            </div>
            <button 
               onClick={handleLogout}
               className="w-full flex items-center justify-center gap-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-3 rounded-2xl transition-all text-xs font-bold border border-red-500/20"
            >
               <LogOut className="h-4 w-4" /> Terminate Session
            </button>
         </div>
      </aside>

      <main className="flex-1 ml-72 p-12 overflow-y-auto">
         {activeView === 'dashboard' && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
               <div className="mb-12 flex justify-between items-start">
                   <div>
                       <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-white">Admin Summary</h1>
                       <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Status of system-wide operations</p>
                   </div>
                   <button 
                    onClick={checkSystemHealth}
                    className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-slate-500 hover:text-university-accent transition-all"
                    title="Refresh System Health"
                   >
                     <Activity className={`h-5 w-5 ${checkingHealth ? 'animate-pulse text-university-accent' : ''}`} />
                   </button>
               </div>
               
               {/* Health Alert Section */}
               {healthStatus && (
                   <div className="mb-12 p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-xl overflow-hidden relative">
                       <div className="flex items-center gap-4 mb-8">
                           <div className="p-3 rounded-2xl bg-university-accent/10 text-university-accent">
                               <ShieldAlert className="h-6 w-6" />
                           </div>
                           <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white">Supabase Infrastructure Health</h3>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           <HealthPill label="Storage: resources" status={healthStatus.resourcesBucket} type="bucket" />
                           <HealthPill label="Storage: submissions" status={healthStatus.submissionsBucket} type="bucket" />
                           <HealthPill label="Table: profiles" status={healthStatus.profilesTable} type="table" />
                           <HealthPill label="Table: resources" status={healthStatus.resourcesTable} type="table" />
                           <HealthPill label="Table: submissions" status={healthStatus.submissionsTable} type="table" />
                           <HealthPill label="Table: orders" status={healthStatus.ordersTable} type="table" />
                       </div>

                       {Object.values(healthStatus).some(v => v === false) && (
                           <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-900/10 border-2 border-dashed border-amber-200 dark:border-amber-900/30 rounded-3xl flex items-start gap-4">
                               <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400 mt-1 shrink-0" />
                               <div>
                                   <p className="text-sm font-black text-amber-900 dark:text-amber-200 uppercase tracking-widest">Configuration Required</p>
                                   <p className="text-xs text-amber-700 dark:text-amber-400 mt-2 leading-relaxed">
                                       Some database components or storage buckets are missing. You can fix this instantly using our <strong>Setup SQL Generator</strong>.
                                   </p>
                                   <button 
                                      onClick={() => setActiveView('setup')}
                                      className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-university-900 text-white rounded-xl text-xs font-bold shadow-lg transition-all hover:scale-105"
                                   >
                                       Go to Setup Tool <ArrowRight className="h-3 w-3" />
                                   </button>
                               </div>
                           </div>
                       )}
                   </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                  <StatCard label="Review Queue" value={pendingCount} icon={<Inbox className="text-blue-500" />} onClick={() => setActiveView('inbox')} />
                  <StatCard label="Total PDFs" value={resources.length} icon={<FileText className="text-amber-500" />} onClick={() => setActiveView('resources')} />
                  <StatCard label="Total Students" value={uniqueUsers.length} icon={<Users className="text-purple-500" />} onClick={() => setActiveView('users')} />
                  <StatCard label="Recent Logins" value={loginRecords.length} icon={<Activity className="text-green-500" />} onClick={() => setActiveView('activity')} />
               </div>

               <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-white/5 p-10">
                  <h3 className="font-serif font-bold text-2xl mb-8 text-slate-900 dark:text-white">Recent Student Activity</h3>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                        <thead className="bg-gray-50 dark:bg-slate-800/50 text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400 border-b border-gray-100 dark:border-white/5">
                           <tr>
                              <th className="px-6 py-4">Submission</th>
                              <th className="px-6 py-4">Uploader</th>
                              <th className="px-6 py-4">Received</th>
                              <th className="px-6 py-4 text-right">Status</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                           {submissions.sort((a,b) => b.timestamp - a.timestamp).slice(0, 6).map(sub => (
                              <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                 <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{sub.fileName}</td>
                                 <td className="px-6 py-4 font-medium">{sub.userIdentifier}</td>
                                 <td className="px-6 py-4">{new Date(sub.timestamp).toLocaleDateString()}</td>
                                 <td className="px-6 py-4 text-right">
                                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                       sub.status === 'approved' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                                       sub.status === 'rejected' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' :
                                       'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                                    }`}>
                                       {sub.status === 'approved' ? 'Verified' : sub.status}
                                    </span>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
         )}

         {activeView === 'setup' && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
               <div className="mb-10">
                   <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-white">Infrastructure Setup</h1>
                   <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Fix all database, storage, and permission issues at once.</p>
               </div>

               <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-slate-800 p-10">
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                       <div className="space-y-8">
                           <div>
                               <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                                   <Terminal className="h-6 w-6 text-university-accent" />
                                   Database Setup SQL
                               </h3>
                               <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                                   This script will create all required tables (<code className="text-xs bg-gray-100 dark:bg-slate-800 px-1 rounded">resources</code>, <code className="text-xs bg-gray-100 dark:bg-slate-800 px-1 rounded">submissions</code>, etc.) and set up <strong>Row Level Security (RLS)</strong> policies so files can be uploaded.
                               </p>
                               <div className="bg-slate-950 rounded-2xl p-6 relative group overflow-hidden">
                                   <pre className="text-[10px] text-emerald-400 overflow-x-auto h-64 no-scrollbar opacity-60 group-hover:opacity-100 transition-opacity">
                                       {MASTER_SQL}
                                   </pre>
                                   <button 
                                      onClick={copySql}
                                      className="absolute top-4 right-4 bg-university-accent text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                                   >
                                       <Copy className="h-4 w-4" /> Copy SQL
                                   </button>
                               </div>
                           </div>

                           <div className="p-6 bg-blue-50 dark:bg-blue-900/10 border-2 border-dashed border-blue-200 dark:border-blue-900/30 rounded-3xl">
                               <h4 className="font-black text-[10px] text-blue-900 dark:text-blue-200 uppercase tracking-widest mb-3">How to use:</h4>
                               <ol className="text-xs text-blue-800 dark:text-blue-300 space-y-2">
                                   <li>1. Click <strong>Copy SQL</strong> above.</li>
                                   <li>2. Open your <a href="https://supabase.com/dashboard/project/sjptcgmjokirbgeuehhm/sql/new" target="_blank" className="underline font-bold">Supabase SQL Editor</a>.</li>
                                   <li>3. Paste the code and click <strong>Run</strong>.</li>
                               </ol>
                           </div>
                       </div>

                       <div className="space-y-8">
                           <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                               <HardDrive className="h-6 w-6 text-university-accent" />
                               Storage Bucket Setup
                           </h3>
                           <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                               Supabase SQL doesn't create buckets automatically. You must create them manually in the Dashboard.
                           </p>

                           <div className="space-y-4">
                               <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
                                   <div className="flex items-center gap-4">
                                       <div className={`p-2 rounded-lg ${healthStatus?.resourcesBucket ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                           <FolderOpen className="h-5 w-5" />
                                       </div>
                                       <div>
                                           <p className="font-bold text-slate-900 dark:text-white">resources</p>
                                           <p className="text-[10px] text-slate-400 uppercase font-black">Material Library</p>
                                       </div>
                                   </div>
                                   {healthStatus?.resourcesBucket ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                               </div>

                               <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
                                   <div className="flex items-center gap-4">
                                       <div className={`p-2 rounded-lg ${healthStatus?.submissionsBucket ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                           <Upload className="h-5 w-5" />
                                       </div>
                                       <div>
                                           <p className="font-bold text-slate-900 dark:text-white">submissions</p>
                                           <p className="text-[10px] text-slate-400 uppercase font-black">Student Uploads</p>
                                       </div>
                                   </div>
                                   {healthStatus?.submissionsBucket ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                               </div>
                           </div>

                           <div className="p-8 bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-200 dark:border-amber-900/30 rounded-3xl">
                               <h4 className="font-black text-[10px] text-amber-900 dark:text-amber-200 uppercase tracking-widest mb-4">Mandatory Storage Settings:</h4>
                               <ul className="text-xs text-amber-800 dark:text-amber-300 space-y-3">
                                   <li className="flex gap-2">
                                       <div className="w-4 h-4 rounded bg-amber-200 text-amber-800 flex items-center justify-center font-bold text-[8px] shrink-0">1</div>
                                       <span>Create both buckets named exactly as above.</span>
                                   </li>
                                   <li className="flex gap-2">
                                       <div className="w-4 h-4 rounded bg-amber-200 text-amber-800 flex items-center justify-center font-bold text-[8px] shrink-0">2</div>
                                       <span>Set <strong>"Public bucket"</strong> to <strong className="text-amber-900">ON</strong> for both.</span>
                                   </li>
                               </ul>
                               <a 
                                  href="https://supabase.com/dashboard/project/sjptcgmjokirbgeuehhm/storage" 
                                  target="_blank"
                                  className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-amber-600 text-white rounded-xl text-xs font-bold shadow-lg hover:bg-amber-700 transition-all"
                               >
                                   Open Storage Dashboard <ExternalLink className="h-3 w-3" />
                               </a>
                           </div>
                       </div>
                   </div>
               </div>
            </div>
         )}

         {activeView === 'inbox' && (
            <div className="h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-500">
               <div className="flex justify-between items-end mb-10">
                  <div>
                    <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-white">Review Inbox</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Reward students for their contributions</p>
                  </div>
                  
                  <div className="flex bg-gray-200 dark:bg-slate-800 p-1 rounded-2xl border border-gray-300 dark:border-slate-700">
                      <button 
                         onClick={() => { setInboxStatusFilter('pending'); setSelectedSubmissionId(null); }}
                         className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${inboxStatusFilter === 'pending' ? 'bg-white dark:bg-slate-700 text-university-900 dark:text-white shadow-lg' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                      >
                         <Clock className="h-4 w-4" /> Pending Review
                      </button>
                      <button 
                         onClick={() => { setInboxStatusFilter('approved'); setSelectedSubmissionId(null); }}
                         className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${inboxStatusFilter === 'approved' ? 'bg-white dark:bg-slate-700 text-university-900 dark:text-white shadow-lg' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                      >
                         <CheckCircle className="h-4 w-4" /> Verified (Unpublished)
                      </button>
                  </div>
               </div>
               
               <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden flex-1 flex">
                  <div className={`w-1/3 border-r border-gray-100 dark:border-white/5 flex flex-col bg-gray-50/50 dark:bg-slate-900/50 ${selectedSubmissionId ? 'hidden md:flex' : 'flex'}`}>
                      <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-slate-900 flex justify-between items-center">
                          <span className="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-xs">Queue</span>
                          <span className="bg-university-accent text-white px-3 py-1 rounded-full text-[10px] font-bold">{filteredInboxSubmissions.length}</span>
                      </div>
                      <div className="flex-1 overflow-y-auto">
                         {filteredInboxSubmissions.length === 0 ? (
                            <div className="p-20 text-center text-slate-300">
                               <Inbox className="h-16 w-16 mx-auto mb-4 opacity-20" />
                               <p className="font-serif text-xl">Inbox is Empty</p>
                            </div>
                         ) : (
                            filteredInboxSubmissions.map(sub => (
                               <button
                                  key={sub.id}
                                  onClick={() => setSelectedSubmissionId(sub.id)}
                                  className={`w-full text-left p-6 border-b border-gray-100 dark:border-white/5 hover:bg-white dark:hover:bg-slate-800 transition-all ${selectedSubmissionId === sub.id ? 'bg-white dark:bg-slate-800 border-l-8 border-l-university-accent shadow-2xl z-10' : 'border-l-8 border-l-transparent'}`}
                               >
                                  <div className="flex justify-between items-start mb-2">
                                      <span className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Submission</span>
                                      <span className="text-[10px] font-bold text-slate-400">{new Date(sub.timestamp).toLocaleDateString()}</span>
                                  </div>
                                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{sub.fileName}</h4>
                                  <p className="text-xs text-slate-500 font-medium truncate">By: {sub.userIdentifier}</p>
                               </button>
                            ))
                         )}
                      </div>
                  </div>

                  <div className={`w-2/3 flex flex-col bg-white dark:bg-slate-900 ${!selectedSubmissionId ? 'hidden md:flex' : 'flex'}`}>
                     {selectedSubmissionId ? (
                        (() => {
                           const activeSub = submissions.find(s => s.id === selectedSubmissionId);
                           if (!activeSub) return null;
                           return (
                              <div className="flex flex-col h-full animate-in fade-in duration-500">
                                 <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                                    <button onClick={() => setSelectedSubmissionId(null)} className="md:hidden p-3 hover:bg-gray-100 rounded-2xl">
                                       <ArrowLeft className="h-6 w-6" />
                                    </button>
                                    <div className="flex gap-2">
                                       <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${activeSub.status === 'pending' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-200' : 'bg-green-50 dark:bg-green-900/20 text-green-600 border-green-200'}`}>
                                          {activeSub.status === 'pending' ? 'Verification Required' : 'Verified & Credited'}
                                       </div>
                                    </div>
                                 </div>

                                 <div className="flex-1 overflow-y-auto p-12">
                                    <div className="flex items-center gap-6 mb-12">
                                       <div className="h-16 w-16 rounded-[1.5rem] bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-2xl shadow-xl">S</div>
                                       <div>
                                          <p className="text-lg font-bold text-slate-900 dark:text-white">{activeSub.fileName}</p>
                                          <p className="text-sm text-slate-500 font-medium">Uploader: {activeSub.userIdentifier}</p>
                                       </div>
                                       <span className="ml-auto text-xs font-bold text-slate-400 uppercase tracking-widest">{new Date(activeSub.timestamp).toLocaleString()}</span>
                                    </div>

                                    <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
                                       <div className="grid grid-cols-2 gap-8 mb-12">
                                          <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-gray-100 dark:border-white/5">
                                             <span className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.2em] block mb-2">Department</span>
                                             <span className="font-bold text-lg text-slate-900 dark:text-white">{activeSub.subjectName}</span>
                                          </div>
                                          <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-gray-100 dark:border-white/5">
                                             <span className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.2em] block mb-2">Category</span>
                                             <span className="font-bold text-lg text-slate-900 dark:text-white">Semester {activeSub.semester} &bull; {activeSub.type}</span>
                                          </div>
                                       </div>

                                       <h4 className="font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-widest text-xs">Review & Download</h4>
                                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                                          <button 
                                              onClick={() => handleReviewDownload(activeSub.id)}
                                              className="flex items-center gap-6 p-6 border-2 border-university-accent/20 bg-university-accent/5 rounded-3xl group hover:border-university-accent transition-all text-left"
                                          >
                                              <div className="p-4 bg-university-accent rounded-2xl text-white group-hover:scale-110 transition-transform">
                                                  <Download className="h-8 w-8" />
                                              </div>
                                              <div>
                                                  <p className="font-bold text-lg text-university-900 dark:text-white">Download PDF</p>
                                                  <p className="text-xs text-university-600 dark:text-university-400 font-bold uppercase tracking-widest">Review file locally</p>
                                              </div>
                                          </button>
                                          
                                          <div className="flex items-center gap-6 p-6 border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-slate-800/50 rounded-3xl text-left">
                                              <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
                                                  <FileText className="h-8 w-8 text-gray-400" />
                                              </div>
                                              <div>
                                                  <p className="font-bold text-lg text-slate-900 dark:text-white">Metadata</p>
                                                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{activeSub.pattern || 'Pattern Unknown'}</p>
                                              </div>
                                          </div>
                                       </div>
                                       
                                       {activeSub.status === 'pending' ? (
                                          <div className="flex gap-6">
                                             <button 
                                                onClick={() => handleSubmissionAction(activeSub.id, 'approve')}
                                                disabled={!!isProcessing}
                                                className="flex-[2] bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-5 rounded-[1.5rem] font-bold flex flex-col items-center justify-center transition-all shadow-2xl shadow-green-500/20"
                                             >
                                                <div className="flex items-center gap-3 mb-1"><CheckCircle className="h-5 w-5" /> Approve & Reward</div>
                                                <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">+5 Credits to Student Account</span>
                                             </button>
                                             <button 
                                                onClick={() => handleSubmissionAction(activeSub.id, 'reject')}
                                                disabled={!!isProcessing}
                                                className="flex-1 border-2 border-red-500/20 text-red-500 hover:bg-red-500/10 py-5 rounded-[1.5rem] font-bold flex items-center justify-center gap-3 transition-all"
                                             >
                                                <XCircle className="h-5 w-5" /> Decline
                                             </button>
                                          </div>
                                       ) : (
                                          <div className="bg-university-accent/10 border-2 border-dashed border-university-accent/30 p-10 rounded-[2.5rem] text-center">
                                              <Stamp className="h-12 w-12 text-university-accent mx-auto mb-4" />
                                              <h3 className="text-xl font-bold text-university-900 dark:text-white mb-2">Already Verified</h3>
                                              <p className="text-gray-600 dark:text-gray-400 mb-6 max-sm mx-auto">
                                                 This file has been approved and credited. To publish it publicly, use the Manual Upload tool with the data below.
                                              </p>
                                              <button 
                                                 onClick={() => {
                                                    setUploadSubject(activeSub.subjectId);
                                                    setUploadSemester(activeSub.semester.toString());
                                                    setUploadType(activeSub.type);
                                                    setUploadPattern(activeSub.pattern || '');
                                                    setUploadDegree(activeSub.degreeLevel || '');
                                                    setUploadCollege(activeSub.collegeId || '');
                                                    setUploadTitle(activeSub.fileName.replace('.pdf', ''));
                                                    setIsUploadModalOpen(true);
                                                 }}
                                                 className="bg-university-900 dark:bg-university-accent text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-all"
                                              >
                                                 Populate Manual Upload
                                              </button>
                                          </div>
                                       )}
                                    </div>
                                 </div>
                              </div>
                           );
                        })()
                     ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                           <Inbox className="h-24 w-24 mb-6 opacity-10" />
                           <p className="font-serif text-2xl font-bold opacity-30 uppercase tracking-widest">Select entry to moderate</p>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         )}
         
         {activeView === 'resources' && (
             <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                   <div>
                       <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-white">Active Library</h1>
                       <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Live resources currently accessible by students</p>
                   </div>
                   <button 
                     onClick={() => { resetForm(); setIsUploadModalOpen(true); }}
                     className="w-full md:w-auto bg-university-accent hover:bg-amber-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-university-accent/20 flex items-center justify-center gap-3 transition-all active:scale-95"
                   >
                     <Plus className="h-6 w-6" /> Manual Upload
                   </button>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-white/5 overflow-hidden">
                   <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                         <thead className="bg-gray-50 dark:bg-slate-800/50 text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400 border-b border-gray-100 dark:border-white/5">
                            <tr>
                               <th className="px-8 py-5">Title Descriptor</th>
                               <th className="px-8 py-5">Subject Area</th>
                               <th className="px-8 py-5">Resource Type</th>
                               <th className="px-8 py-5 text-center">Impressions</th>
                               <th className="px-8 py-5 text-right">Action</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-slate-600 dark:text-slate-400">
                            {resources.map(res => {
                                const subjectName = SUBJECTS.find(s => s.id === res.subjectId)?.name || res.subjectId;
                                return (
                                   <tr key={res.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                      <td className="px-8 py-5 font-bold text-slate-900 dark:text-white">
                                         <button 
                                            onClick={async () => {
                                                const url = await db.getFileUrl(`res-${res.id}`);
                                                if(url) window.open(url, '_blank');
                                                else alert("File missing");
                                            }}
                                            className="flex items-center gap-3 hover:text-university-accent transition-colors text-left"
                                         >
                                             <FileText className="h-5 w-5 text-slate-300 group-hover:text-university-accent" />
                                             <span className="line-clamp-1">{res.title}</span>
                                         </button>
                                      </td>
                                      <td className="px-8 py-5 font-medium">{subjectName}</td>
                                      <td className="px-8 py-5">
                                         <span className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full tracking-widest ${
                                            res.type === ResourceType.PYQ ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' :
                                            res.type === ResourceType.NOTE ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' :
                                            'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400'
                                         }`}>
                                           {res.type === ResourceType.PYQ ? 'Paper' : res.type === ResourceType.NOTE ? 'Notes' : 'Syllabus'}
                                         </span>
                                      </td>
                                      <td className="px-8 py-5 text-center font-bold text-slate-900 dark:text-white">{res.downloadCount.toLocaleString()}</td>
                                      <td className="px-8 py-5 text-right">
                                         <button 
                                           onClick={() => handleDeleteResourceAction(res.id)}
                                           className="text-slate-300 hover:text-red-500 transition-colors p-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl"
                                         >
                                            <Trash2 className="h-5 w-5" />
                                         </button>
                                      </td>
                                   </tr>
                                );
                            })}
                         </tbody>
                      </table>
                   </div>
                </div>
             </div>
         )}

         {activeView === 'users' && (
             <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                 <div className="mb-12">
                    <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-white">Student Base</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Registered students and their contribution metrics</p>
                 </div>
                 <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-white/5 overflow-hidden">
                     <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 dark:bg-slate-800/50 text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400 border-b border-gray-100 dark:border-white/5">
                                <tr>
                                    <th className="px-8 py-5">Student</th>
                                    <th className="px-8 py-5">Submissions</th>
                                    <th className="px-8 py-5">Verified</th>
                                    <th className="px-8 py-5">Last Activity</th>
                                    <th className="px-8 py-5 text-right">Trust Score</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-slate-600 dark:text-slate-400">
                                {uniqueUsers.map(user => (
                                    <tr key={user.identifier} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-8 py-5 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-university-accent to-orange-600 flex items-center justify-center text-white font-bold text-lg">
                                                {user.identifier.charAt(0).toUpperCase()}
                                            </div>
                                            {user.identifier}
                                        </td>
                                        <td className="px-8 py-5 font-medium">{user.totalSubmissions}</td>
                                        <td className="px-8 py-5 text-green-600 dark:text-green-400 font-bold">{user.approved}</td>
                                        <td className="px-8 py-5">{new Date(user.lastActive).toLocaleDateString()}</td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex justify-end gap-1">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <CheckCircle key={star} className={`h-3 w-3 ${star <= Math.ceil((user.approved / Math.max(1, user.totalSubmissions)) * 5) ? 'text-university-accent' : 'text-slate-200'}`} />
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                 </div>
             </div>
         )}
         
         {activeView === 'activity' && (
             <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                 <div className="mb-12">
                    <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-white">Security Logs</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Audit trail of student authentications</p>
                 </div>
                 <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-white/5 overflow-hidden">
                     <table className="w-full text-left text-sm">
                         <thead className="bg-gray-50 dark:bg-slate-800/50 text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400 border-b border-gray-100 dark:border-white/5">
                             <tr>
                                 <th className="px-8 py-5">User</th>
                                 <th className="px-8 py-5">Method</th>
                                 <th className="px-8 py-5">Timestamp</th>
                                 <th className="px-8 py-5 text-right">Status</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-slate-600 dark:text-slate-400">
                             {loginRecords.sort((a,b) => b.timestamp - a.timestamp).map(record => (
                                 <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                     <td className="px-8 py-5 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                         {record.identifier}
                                     </td>
                                     <td className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                         {record.method}
                                     </td>
                                     <td className="px-8 py-5 font-medium">
                                         {new Date(record.timestamp).toLocaleString()}
                                     </td>
                                     <td className="px-8 py-5 text-right">
                                         <span className="text-green-600 dark:text-green-400 text-[10px] font-bold uppercase tracking-widest">
                                             Success
                                         </span>
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
             </div>
         )}

         {activeView === 'settings' && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 max-w-2xl">
               <div className="mb-12">
                   <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-white">System Config</h1>
                   <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Manage administrator security</p>
               </div>
               
               <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-white/5 p-10">
                  <form onSubmit={handleChangePassword} className="space-y-6">
                     <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Current Passcode</label>
                        <input 
                           type="password"
                           value={currentPwd}
                           onChange={(e) => setCurrentPwd(e.target.value)}
                           className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-university-accent rounded-xl focus:outline-none transition-all dark:text-white"
                        />
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">New Passcode</label>
                           <input 
                              type="password"
                              value={newPwd}
                              onChange={(e) => setNewPwd(e.target.value)}
                              className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-university-accent rounded-xl focus:outline-none transition-all dark:text-white"
                           />
                        </div>
                        <div>
                           <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Confirm New Passcode</label>
                           <input 
                              type="password"
                              value={confirmPwd}
                              onChange={(e) => setConfirmPwd(e.target.value)}
                              className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-university-accent rounded-xl focus:outline-none transition-all dark:text-white"
                           />
                        </div>
                     </div>
                     {settingsMsg && (
                        <div className={`p-4 rounded-xl text-xs font-bold ${settingsMsg.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                           {settingsMsg.text}
                        </div>
                     )}
                     <button 
                        type="submit"
                        className="w-full bg-university-900 hover:bg-black text-white font-bold py-4 rounded-xl shadow-xl transition-all"
                     >
                        Update Security Credentials
                     </button>
                  </form>
               </div>
            </div>
         )}
      </main>
    </div>
  );
};

const HealthPill = ({ label, status, type }: { label: string, status: boolean, type: 'bucket' | 'table' }) => (
    <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${status ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30' : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30'}`}>
        <div className="flex items-center gap-3">
            {type === 'bucket' ? <HardDrive className={`h-4 w-4 ${status ? 'text-green-600' : 'text-red-600'}`} /> : <Database className={`h-4 w-4 ${status ? 'text-green-600' : 'text-red-600'}`} />}
            <span className={`text-[10px] font-black uppercase tracking-widest ${status ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400'}`}>{label}</span>
        </div>
        {status ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
    </div>
);

const SidebarItem = ({ icon, label, active, onClick, badge }: { icon: any, label: string, active: boolean, onClick: () => void, badge?: number }) => (
   <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 group ${active ? 'bg-university-accent text-white shadow-xl shadow-university-accent/20 scale-[1.02]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
   >
      <div className="flex items-center gap-4">
         {React.cloneElement(icon, { size: 20, className: `transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-slate-500 group-hover:text-university-accent'}` })}
         <span className="font-bold text-sm tracking-tight">{label}</span>
      </div>
      {badge ? (
         <span className="bg-university-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[1.5rem] h-6 flex items-center justify-center shadow-lg border border-white/20">{badge}</span>
      ) : null}
   </button>
);

const StatCard = ({ label, value, icon, onClick }: { label: string, value: number, icon: any, onClick?: () => void }) => (
   <div 
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl border border-gray-100 dark:border-white/5 flex items-center justify-between group ${onClick ? 'cursor-pointer hover:border-university-accent transition-all hover:scale-[1.02]' : ''}`}
   >
      <div>
         <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold mb-2 group-hover:text-university-accent transition-colors">{label}</p>
         <p className="text-4xl font-serif font-bold text-slate-900 dark:text-white">{value}</p>
      </div>
      <div className="p-5 bg-gray-50 dark:bg-slate-800 rounded-3xl group-hover:bg-university-accent/5 group-hover:scale-110 transition-all">{icon}</div>
   </div>
);

export default AdminDashboard;
