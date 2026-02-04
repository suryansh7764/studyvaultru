
import React, { useState } from 'react';
import { SUBJECTS, SEMESTERS } from '../constants';
import { User, Question, TestConfig, AssessmentResult } from '../types';
import { generateAssessmentQuestions, evaluateAssessment } from '../services/geminiService';
import { PenTool, Clock, CheckCircle, AlertCircle, Loader2, Brain, Save, ArrowRight, RotateCcw } from 'lucide-react';

interface AssessmentSectionProps {
  user: User | null;
  onLoginRequest: () => void;
  onCompleteAssessment: (result: AssessmentResult) => void;
}

const AssessmentSection: React.FC<AssessmentSectionProps> = ({ user, onLoginRequest, onCompleteAssessment }) => {
  const [step, setStep] = useState<'config' | 'test' | 'evaluating' | 'result'>('config');
  
  // Configuration State
  const [config, setConfig] = useState<TestConfig>({
    subjectId: '',
    subjectName: '',
    semester: 1,
    paperName: '',
    examType: 'Mid-Sem'
  });

  // Test State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  
  // Result State
  const [result, setResult] = useState<{score: number, total: number, feedback: string} | null>(null);

  const handleStartTest = async () => {
    if (!user) {
      onLoginRequest();
      return;
    }
    if (!config.subjectId || !config.paperName) {
      alert("Please fill all details to start.");
      return;
    }

    setLoading(true);
    const generatedQuestions = await generateAssessmentQuestions(config.subjectName, config.semester, config.paperName);
    setLoading(false);

    if (generatedQuestions.length > 0) {
      setQuestions(generatedQuestions);
      setStep('test');
    } else {
      alert("Failed to generate test. Please try again.");
    }
  };

  const handleAnswerChange = (qId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleSubmitTest = async () => {
    setStep('evaluating');
    const evalResult = await evaluateAssessment(questions, answers);
    setResult(evalResult);
    setStep('result');
    
    // Save to user profile
    const newResult: AssessmentResult = {
      id: Date.now().toString(),
      subjectName: config.subjectName,
      score: evalResult.score,
      totalMarks: evalResult.total,
      date: Date.now(),
      feedback: evalResult.feedback
    };
    onCompleteAssessment(newResult);
  };

  const reset = () => {
    setStep('config');
    setQuestions([]);
    setAnswers({});
    setResult(null);
  };

  if (!user && step === 'config') {
      return (
          <div className="max-w-4xl mx-auto py-16 px-4 text-center">
             <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 shadow-xl border border-gray-100 dark:border-slate-800">
                <div className="bg-university-accent/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <PenTool className="h-10 w-10 text-university-accent" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-university-900 dark:text-white mb-4">Check Assessment</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-8 text-lg">
                    Take AI-generated tests for your specific course and semester. Get instant evaluation and scores to track your progress.
                </p>
                <button 
                  onClick={onLoginRequest}
                  className="bg-university-900 hover:bg-university-800 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all"
                >
                  Login to Start Assessment
                </button>
             </div>
          </div>
      );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="text-center mb-10">
         <span className="inline-block py-1 px-3 rounded-full bg-university-accent/10 text-university-accent text-xs font-bold tracking-widest uppercase mb-4">
            AI Powered Testing
         </span>
         <h1 className="text-4xl font-serif font-bold text-university-900 dark:text-white mb-2">
            Check Assessment
         </h1>
         {step === 'config' && (
            <p className="text-gray-500 dark:text-gray-400">Configure your test parameters and get started.</p>
         )}
      </div>

      {/* Step 1: Configuration */}
      {step === 'config' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase">Subject</label>
                   <select 
                      className="w-full p-4 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:border-university-accent outline-none dark:text-white transition-colors"
                      value={config.subjectId}
                      onChange={(e) => {
                          const sub = SUBJECTS.find(s => s.id === e.target.value);
                          setConfig({ ...config, subjectId: e.target.value, subjectName: sub?.name || '' });
                      }}
                   >
                      <option value="">Select Subject</option>
                      {SUBJECTS.filter(s => s.id !== 'all').map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                   </select>
                </div>

                <div>
                   <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase">Semester</label>
                   <select 
                      className="w-full p-4 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:border-university-accent outline-none dark:text-white transition-colors"
                      value={config.semester}
                      onChange={(e) => setConfig({ ...config, semester: parseInt(e.target.value) })}
                   >
                      {SEMESTERS.map(s => (
                          <option key={s} value={s}>Semester {s}</option>
                      ))}
                   </select>
                </div>

                <div className="md:col-span-2">
                   <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase">Paper Name / Topic</label>
                   <input 
                      type="text"
                      className="w-full p-4 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:border-university-accent outline-none dark:text-white transition-colors"
                      placeholder="e.g. Classical Mechanics, Indian Economy, Organic Chemistry..."
                      value={config.paperName}
                      onChange={(e) => setConfig({ ...config, paperName: e.target.value })}
                   />
                </div>

                <div className="md:col-span-2">
                   <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase">Exam Type</label>
                   <div className="flex gap-4">
                      {['Mid-Sem', 'End-Sem', 'Mock'].map(type => (
                         <button
                            key={type}
                            onClick={() => setConfig({ ...config, examType: type as any })}
                            className={`flex-1 py-3 rounded-xl border font-bold text-sm transition-all ${
                                config.examType === type 
                                ? 'bg-university-accent text-white border-university-accent' 
                                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-slate-700 hover:border-university-accent'
                            }`}
                         >
                            {type}
                         </button>
                      ))}
                   </div>
                </div>
            </div>

            <button 
               onClick={handleStartTest}
               disabled={loading}
               className="w-full mt-8 bg-university-900 hover:bg-university-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
               {loading ? (
                  <><Loader2 className="animate-spin" /> Generating Questions with AI...</>
               ) : (
                  <><Brain className="h-5 w-5" /> Generate Assessment</>
               )}
            </button>
        </div>
      )}

      {/* Step 2: Test Interface */}
      {step === 'test' && (
         <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-slate-800">
             <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-slate-800 pb-4">
                 <div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white">{config.subjectName}</h3>
                    <p className="text-sm text-gray-500">{config.paperName} • {config.examType}</p>
                 </div>
                 <div className="flex items-center gap-2 text-university-accent bg-university-accent/10 px-3 py-1 rounded-lg">
                    <Clock className="h-4 w-4" />
                    <span className="font-bold text-sm">Live Test</span>
                 </div>
             </div>

             <div className="space-y-8">
                 {questions.map((q, index) => (
                    <div key={q.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="flex gap-3 mb-3">
                           <span className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 text-sm">
                              {index + 1}
                           </span>
                           <div className="flex-1">
                              <p className="font-medium text-lg text-gray-900 dark:text-white mb-1">{q.text}</p>
                              <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">{q.type} • {q.maxMarks} Marks</span>
                           </div>
                        </div>

                        <div className="ml-11">
                           {q.type === 'MCQ' && q.options ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                 {q.options.map((option, idx) => (
                                    <label key={idx} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                       answers[q.id] === option 
                                       ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' 
                                       : 'bg-gray-50 dark:bg-slate-800 border-transparent hover:bg-gray-100 dark:hover:bg-slate-700'
                                    }`}>
                                       <input 
                                          type="radio" 
                                          name={`q-${q.id}`} 
                                          value={option}
                                          checked={answers[q.id] === option}
                                          onChange={() => handleAnswerChange(q.id, option)}
                                          className="text-blue-600 focus:ring-blue-500"
                                       />
                                       <span className="text-gray-700 dark:text-gray-200">{option}</span>
                                    </label>
                                 ))}
                              </div>
                           ) : (
                              <textarea 
                                 rows={4}
                                 className="w-full p-4 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:border-university-accent outline-none dark:text-white transition-colors text-sm"
                                 placeholder="Type your detailed answer here for AI evaluation..."
                                 value={answers[q.id] || ''}
                                 onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                              />
                           )}
                        </div>
                    </div>
                 ))}
             </div>

             <div className="mt-10 border-t border-gray-100 dark:border-slate-800 pt-6">
                <button 
                  onClick={handleSubmitTest}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Save className="h-5 w-5" /> Submit Assessment
                </button>
             </div>
         </div>
      )}

      {/* Step 3: Loading / Evaluating */}
      {step === 'evaluating' && (
         <div className="bg-white dark:bg-slate-900 rounded-3xl p-16 shadow-xl border border-gray-100 dark:border-slate-800 text-center">
            <div className="relative mb-6">
               <div className="w-24 h-24 border-4 border-gray-200 dark:border-slate-700 rounded-full mx-auto"></div>
               <div className="w-24 h-24 border-4 border-university-accent border-t-transparent rounded-full mx-auto absolute top-0 left-1/2 -translate-x-1/2 animate-spin"></div>
               <Brain className="h-8 w-8 text-university-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">AI is Evaluating Your Paper</h3>
            <p className="text-gray-500 dark:text-gray-400">Checking answers, grading relevance, and calculating score...</p>
         </div>
      )}

      {/* Step 4: Result */}
      {step === 'result' && result && (
         <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-slate-800 text-center animate-in zoom-in-95 duration-500">
             <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
             </div>
             <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Assessment Complete!</h2>
             
             <div className="my-8 grid grid-cols-2 gap-4 max-w-sm mx-auto">
                <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                   <p className="text-xs text-gray-500 uppercase font-bold">Your Score</p>
                   <p className="text-3xl font-bold text-university-accent">{result.score} <span className="text-base text-gray-400">/ {result.total}</span></p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                   <p className="text-xs text-gray-500 uppercase font-bold">Percentage</p>
                   <p className="text-3xl font-bold text-blue-600">{Math.round((result.score / result.total) * 100)}%</p>
                </div>
             </div>

             <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-xl text-left border border-blue-100 dark:border-blue-900/30 mb-8">
                <div className="flex items-center gap-2 mb-2 text-blue-800 dark:text-blue-300 font-bold">
                   <AlertCircle className="h-5 w-5" />
                   AI Feedback
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                   "{result.feedback}"
                </p>
             </div>

             <div className="flex gap-4 justify-center">
                <button 
                   onClick={reset}
                   className="px-6 py-3 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                   <RotateCcw className="h-4 w-4" /> Take Another Test
                </button>
             </div>
             
             <p className="mt-6 text-xs text-gray-400">Score has been added to your student profile.</p>
         </div>
      )}

    </div>
  );
};

export default AssessmentSection;
