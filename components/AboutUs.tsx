import React from 'react';
import { Target, Eye, BookOpen, Layers, GraduationCap, CheckCircle } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header Section */}
        <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-university-accent/10 text-university-accent text-xs font-bold tracking-widest uppercase mb-4">
                Who We Are
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-university-900 dark:text-white mb-6">
                About Us
            </h1>
            <div className="w-24 h-1.5 bg-university-accent mx-auto rounded-full mb-8"></div>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
                <span className="font-bold text-university-900 dark:text-white">StudyVault</span> is a student-focused academic platform created to make learning simpler, smarter, and stress-free for students under <span className="font-semibold text-university-accent">Ranchi University</span>.
            </p>
        </div>

        {/* Introduction */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-slate-800 mb-16 relative overflow-hidden">
             <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-university-accent/5 rounded-full blur-3xl"></div>
             <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl"></div>
             
             <div className="relative z-10">
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
                    We bring together <span className="font-semibold text-gray-900 dark:text-white">Previous Year Question Papers (PYQs)</span> and <span className="font-semibold text-gray-900 dark:text-white">high-quality notes</span> for <span className="font-semibold">all Honors subjects</span>, <span className="font-semibold">all semesters</span>, and <span className="font-semibold">all colleges</span> affiliated with Ranchi University — all in one easy-to-use place.
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                    We understand how challenging it can be to find reliable study material at the right time. That’s why <span className="font-bold text-university-900 dark:text-white">StudyVault</span> exists: to save your time, guide your preparation, and help you perform better in exams.
                </p>
             </div>
        </div>

        {/* What We Offer */}
        <div className="mb-20">
            <h2 className="text-3xl font-serif font-bold text-university-900 dark:text-white mb-10 text-center">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    { text: "Previous Year Question Papers for better exam understanding", icon: <BookOpen className="h-6 w-6" /> },
                    { text: "Well-organized Notes curated for clarity and quick revision", icon: <Layers className="h-6 w-6" /> },
                    { text: "Coverage of all Honors papers & semesters", icon: <GraduationCap className="h-6 w-6" /> },
                    { text: "Content relevant to all Ranchi University colleges", icon: <Target className="h-6 w-6" /> },
                    { text: "Simple, clean, and student-friendly experience", icon: <CheckCircle className="h-6 w-6" /> }
                ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-6 bg-gray-50 dark:bg-slate-800 rounded-2xl hover:bg-white dark:hover:bg-slate-700 hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-100 dark:hover:border-slate-600">
                        <div className="bg-university-accent/10 p-3 rounded-xl text-university-accent">
                            {item.icon}
                        </div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 text-lg pt-1">{item.text}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-university-900 dark:bg-slate-800 text-white p-8 md:p-10 rounded-3xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-university-900 to-black opacity-90 z-0"></div>
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Target className="h-32 w-32" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-university-accent rounded-lg">
                            <Target className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-serif font-bold">Our Mission</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed text-lg">
                        Our mission is to <span className="text-white font-semibold">empower students with accessible and reliable academic resources</span>, so no student is left behind due to lack of study material.
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-8 md:p-10 rounded-3xl relative overflow-hidden group hover:border-university-accent/30 transition-colors">
                <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <Eye className="h-32 w-32 text-university-900 dark:text-white" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-100 dark:bg-slate-700 rounded-lg">
                            <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-university-900 dark:text-white">Our Vision</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                        To become the <span className="text-university-900 dark:text-white font-semibold">most trusted academic resource hub</span> for Ranchi University students and continuously grow with updated, accurate, and exam-oriented content.
                    </p>
                </div>
            </div>
        </div>

        {/* Footer Statement */}
        <div className="text-center bg-gradient-to-r from-university-accent to-orange-600 rounded-3xl p-10 md:p-12 text-white shadow-2xl transform hover:scale-[1.01] transition-transform duration-300">
            <h3 className="text-2xl md:text-3xl font-serif font-bold mb-6">
                "Knowledge Secured. Success Assured." 🚀
            </h3>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
                At <span className="font-bold">StudyVault</span>, we believe that the right resources can change results.
            </p>
        </div>
    </div>
  );
};

export default AboutUs;