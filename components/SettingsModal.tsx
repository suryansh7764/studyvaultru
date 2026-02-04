
import React, { useState, useEffect } from 'react';
import { X, Key, Save, AlertCircle, CheckCircle } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const storedKey = localStorage.getItem('ru_api_key') || '';
      setApiKey(storedKey);
      setIsSaved(false);
    }
  }, [isOpen]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('ru_api_key', apiKey.trim());
    } else {
      localStorage.removeItem('ru_api_key');
    }
    setIsSaved(true);
    setTimeout(() => {
        setIsSaved(false);
        onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
       <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-200 dark:border-slate-700 scale-100 animate-in zoom-in-95 duration-200 relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
             <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3 mb-6">
             <div className="bg-university-accent/10 p-3 rounded-xl text-university-accent">
                <Key className="h-6 w-6" />
             </div>
             <div>
                <h3 className="text-xl font-serif font-bold text-university-900 dark:text-white">Settings</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Configure Global Parameters</p>
             </div>
          </div>
          
          <form onSubmit={handleSave} className="space-y-4">
             <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Gemini API Key</label>
                <input 
                  type="password" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-university-accent focus:ring-1 focus:ring-university-accent dark:text-white text-sm transition-all"
                  placeholder="AIzaSy..."
                />
                <p className="mt-2 text-[10px] text-gray-400 leading-relaxed flex items-start gap-1.5">
                   <AlertCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />
                   Required for AI Chat, Assessment Generation, and Auto-Feedback. Key is stored locally in your browser.
                </p>
             </div>

             <button 
                type="submit" 
                className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                    isSaved ? 'bg-green-600' : 'bg-university-900 dark:bg-university-accent hover:bg-university-800'
                }`}
              >
                {isSaved ? (
                    <>
                        <CheckCircle className="h-4 w-4" /> Saved!
                    </>
                ) : (
                    <>
                        <Save className="h-4 w-4" /> Save Configuration
                    </>
                )}
              </button>
          </form>
       </div>
    </div>
  );
};

export default SettingsModal;
