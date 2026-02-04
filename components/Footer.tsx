import React, { useState } from 'react';
import { BookOpen, Shield, Github, Twitter, Mail, Phone, X, Instagram, Linkedin, Facebook, Youtube } from 'lucide-react';

interface FooterProps {
  onNavigate: (section: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [showContactModal, setShowContactModal] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowContactModal(true);
  };

  const handleLinkClick = (e: React.MouseEvent, section: string) => {
    e.preventDefault();
    onNavigate(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-br from-university-900 via-slate-900 to-black text-white pt-16 pb-8 border-t border-slate-800 relative">
      
      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-gray-200 dark:border-slate-700 relative scale-100 animate-in zoom-in-95 duration-200">
             <button 
                onClick={() => setShowContactModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
             >
               <X className="h-5 w-5" />
             </button>
             <h3 className="text-2xl font-serif font-bold text-university-900 dark:text-white mb-6">Contact Us</h3>
             
             <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors group">
                   <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                      <Phone className="h-5 w-5" />
                   </div>
                   <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Phone</p>
                      <a href="tel:6203577553" className="text-gray-900 dark:text-white font-medium hover:text-university-accent text-lg block">+91 6203577553</a>
                   </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-slate-800 rounded-xl hover:bg-blue-100 dark:hover:bg-slate-700/50 transition-colors group">
                   <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                      <Mail className="h-5 w-5" />
                   </div>
                   <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Email</p>
                      <a href="mailto:suryanshkishor@gmail.com" className="text-gray-900 dark:text-white font-medium hover:text-university-accent text-base block break-all">suryanshkishor@gmail.com</a>
                   </div>
                </div>
             </div>
             
             <div className="mt-6 text-center">
               <p className="text-xs text-gray-400">We usually reply within 24 hours.</p>
             </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
               {!logoError ? (
                  <img 
                    src="/logo.png" 
                    alt="StudyVault Logo" 
                    className="h-10 w-10 object-contain drop-shadow-md"
                    onError={() => setLogoError(true)}
                  />
               ) : (
                  <div className="bg-university-accent p-1.5 rounded-lg flex items-center justify-center">
                      <Shield className="h-5 w-5 text-white" />
                      <BookOpen className="h-3 w-3 text-white -ml-2.5 mt-2" />
                  </div>
               )}
               <span className="font-serif text-xl font-bold">StudyVault</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
              "Knowledge Secured. Success Assured." <br/>
              An open-source initiative to help Ranchi University students excel in their academics.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-university-accent mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><button onClick={handleContactClick} className="hover:text-white transition-colors text-left font-medium text-university-accent hover:underline">Contact Us</button></li>
              <li><button onClick={(e) => handleLinkClick(e, 'about')} className="hover:text-white transition-colors">About Us</button></li>
              <li><button onClick={(e) => handleLinkClick(e, 'submit')} className="hover:text-white transition-colors">Submit a Paper</button></li>
              <li><button onClick={(e) => handleLinkClick(e, 'terms')} className="hover:text-white transition-colors">Terms of Service</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-university-accent mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2 group">
                <Mail className="h-4 w-4 group-hover:text-white transition-colors" />
                <a href="mailto:suryanshkishor@gmail.com" className="hover:text-white transition-colors">suryanshkishor@gmail.com</a>
              </li>
              <li className="flex items-center gap-2 group">
                <Phone className="h-4 w-4 group-hover:text-white transition-colors" />
                <a href="tel:6203577553" className="hover:text-white transition-colors">+91 6203577553</a>
              </li>
              <li className="flex items-center gap-2 pt-2">
                 <span className="text-xs text-slate-400">Ranchi, Jharkhand, India</span>
              </li>
            </ul>
            <div className="flex flex-wrap gap-4 mt-6">
              <a href="#" className="bg-slate-800 p-2 rounded-full text-slate-400 hover:text-white hover:bg-university-accent transition-all hover:scale-110 transform" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://www.instagram.com/suryanshthakur_77/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-slate-800 p-2 rounded-full text-slate-400 hover:text-white hover:bg-pink-600 transition-all hover:scale-110 transform" 
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-slate-800 p-2 rounded-full text-slate-400 hover:text-white hover:bg-sky-500 transition-all hover:scale-110 transform" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-slate-800 p-2 rounded-full text-slate-400 hover:text-white hover:bg-blue-700 transition-all hover:scale-110 transform" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="bg-slate-800 p-2 rounded-full text-slate-400 hover:text-white hover:bg-red-600 transition-all hover:scale-110 transform" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex justify-center items-center text-xs text-slate-400">
          <p>&copy; 2026 StudyVault. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;