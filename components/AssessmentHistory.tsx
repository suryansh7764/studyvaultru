
import React from 'react';
import { AssessmentResult } from '../types';
import { ArrowLeft, Brain, Calendar, Clock } from 'lucide-react';

interface AssessmentHistoryProps {
  history: AssessmentResult[];
  onBack: () => void;
}

const AssessmentHistory: React.FC<AssessmentHistoryProps> = ({ history, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </button>
        <h1 className="text-3xl font-serif font-bold text-university-900 dark:text-white">Assessment History</h1>
      </div>

      {history.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-gray-100 dark:border-slate-800">
           <div className="bg-gray-100 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="h-10 w-10 text-gray-400" />
           </div>
           <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Assessments Yet</h3>
           <p className="text-gray-500 dark:text-gray-400">Complete a test in the Assessment section to see your results here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.sort((a, b) => b.date - a.date).map((result) => (
            <div key={result.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-university-900 dark:text-white mb-1">{result.subjectName}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(result.date).toLocaleDateString()}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-1">
                       <Clock className="h-3 w-3" />
                       {new Date(result.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                   <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Score</p>
                      <p className="text-2xl font-bold text-university-accent">
                        {result.score} <span className="text-sm text-gray-400">/ {result.totalMarks}</span>
                      </p>
                   </div>
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-md ${
                      (result.score / result.totalMarks) >= 0.7 ? 'bg-green-500' : 
                      (result.score / result.totalMarks) >= 0.4 ? 'bg-amber-500' : 'bg-red-500'
                   }`}>
                      {Math.round((result.score / result.totalMarks) * 100)}%
                   </div>
                </div>
              </div>
              
              {result.feedback && (
                <div className="mt-4 pt-4 border-t border-gray-50 dark:border-slate-800">
                   <p className="text-sm text-gray-600 dark:text-gray-300 italic flex gap-2">
                      <span className="font-bold text-university-accent">Feedback:</span> "{result.feedback}"
                   </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssessmentHistory;
