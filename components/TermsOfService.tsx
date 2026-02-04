import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-slate-800">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-university-900 dark:text-white mb-8 text-center">
          Terms of Service
        </h1>

        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
          <p className="text-lg mb-6">
            Welcome to <strong>StudyVault</strong>. By accessing or using this website, you agree to comply with and be bound by the following Terms of Service. Please read them carefully.
          </p>

          <h3 className="text-xl font-bold text-university-900 dark:text-white mt-8 mb-4">1. Acceptance of Terms</h3>
          <p>By using StudyVault, you acknowledge that you have read, understood, and agreed to these Terms of Service. If you do not agree with any part of these terms, please do not use our website.</p>

          <h3 className="text-xl font-bold text-university-900 dark:text-white mt-8 mb-4">2. Purpose of the Website</h3>
          <p>StudyVault is an educational platform designed to provide <strong>Previous Year Question Papers (PYQs)</strong> and <strong>study notes</strong> for students of <strong>Ranchi University</strong>. All materials are shared strictly for <strong>educational and reference purposes only</strong>.</p>

          <h3 className="text-xl font-bold text-university-900 dark:text-white mt-8 mb-4">3. Use of Content</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>All content available on this website is intended for <strong>personal and non-commercial use</strong> only.</li>
            <li>You may <strong>download, view, and use</strong> the materials for your own study and exam preparation.</li>
            <li>You may <strong>not reproduce, redistribute, sell, modify, or publish</strong> any content from this website without prior written permission.</li>
          </ul>

          <h3 className="text-xl font-bold text-university-900 dark:text-white mt-8 mb-4">4. Content Accuracy</h3>
          <p>While we strive to keep all materials accurate, updated, and relevant, <strong>StudyVault does not guarantee</strong> the completeness, correctness, or reliability of any content. Syllabus, question patterns, and exam formats may change over time.</p>

          <h3 className="text-xl font-bold text-university-900 dark:text-white mt-8 mb-4">5. Intellectual Property</h3>
          <p>All website content, including text, design, layout, logos, and uploaded materials, is the property of <strong>StudyVault</strong> or respective content contributors unless stated otherwise. Unauthorized use may result in legal action.</p>

          <h3 className="text-xl font-bold text-university-900 dark:text-white mt-8 mb-4">6. User Responsibility</h3>
          <p>Users agree to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use the website only for lawful purposes</li>
            <li>Not attempt to harm, hack, or disrupt the website</li>
            <li>Not upload or share false, offensive, or copyrighted material without permission</li>
          </ul>

          <h3 className="text-xl font-bold text-university-900 dark:text-white mt-8 mb-4">7. External Links</h3>
          <p>This website may contain links to third-party websites. StudyVault is <strong>not responsible</strong> for the content, policies, or practices of any external sites.</p>

          <h3 className="text-xl font-bold text-university-900 dark:text-white mt-8 mb-4">8. Disclaimer</h3>
          <p>StudyVault is <strong>not officially affiliated with Ranchi University</strong>. All names and references are used strictly for informational and academic purposes.</p>

          <h3 className="text-xl font-bold text-university-900 dark:text-white mt-8 mb-4">9. Limitation of Liability</h3>
          <p>StudyVault shall not be held liable for any direct or indirect loss, damage, or inconvenience arising from the use of this website or its content.</p>

          <h3 className="text-xl font-bold text-university-900 dark:text-white mt-8 mb-4">10. Changes to Terms</h3>
          <p>We reserve the right to <strong>update or modify these Terms of Service at any time</strong> without prior notice. Continued use of the website after changes indicates acceptance of the updated terms.</p>

          <h3 className="text-xl font-bold text-university-900 dark:text-white mt-8 mb-4">11. Contact Us</h3>
          <p>If you have any questions or concerns regarding these Terms of Service, please contact us through the website’s contact section.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;