
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 animate-fade-in" 
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('about.title')}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" aria-label="Close">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <div className="mt-4 text-gray-600 dark:text-gray-300 space-y-4">
            <p>{t('about.description')}</p>
            
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 pt-2">{t('about.techStack')}</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>React & TypeScript</li>
              <li>Tailwind CSS</li>
              <li>Google Gemini API</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 pt-2">{t('about.geminiModels')}</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>gemini-2.5-flash-image:</strong> {t('about.geminiFlashImage')}</li>
              <li><strong>gemini-2.5-flash:</strong> {t('about.geminiFlash')}</li>
              <li><strong>veo-3.1-fast-generate-preview:</strong> {t('about.geminiVeo')}</li>
            </ul>
            
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 pt-2">Features</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>{t('sidebar.productStudio')}:</strong> {t('about.productStudio')}</li>
              <li><strong>{t('sidebar.sketchDesignStudio')}:</strong> {t('about.sketchDesignStudio')}</li>
              <li><strong>{t('sidebar.virtualTryOn')}:</strong> {t('about.virtualTryOn')}</li>
              <li><strong>{t('sidebar.lifestylePhotoshoot')}:</strong> {t('about.lifestylePhotoshoot')}</li>
              <li><strong>{t('sidebar.mergeProduct')}:</strong> {t('about.mergeProduct')}</li>
              <li><strong>{t('sidebar.poseStudio')}:</strong> {t('about.poseStudio')}</li>
              <li><strong>{t('sidebar.adCreator')}:</strong> {t('about.adCreator')}</li>
              <li><strong>{t('sidebar.imageEditor')}:</strong> {t('about.imageEditor')}</li>
              <li><strong>{t('sidebar.motionPromptStudio')}:</strong> {t('about.motionPromptStudio')}</li>
              <li><strong>{t('sidebar.videoStudio')}:</strong> {t('about.videoStudio')}</li>
            </ul>

            <div className="pt-4 text-sm text-center">
              {t('about.developedBy')}{' '}
              <a href="https://www.instagram.com/jagoskilldigital" target="_blank" rel="noopener noreferrer" className="font-medium text-primary-600 dark:text-primary-500 hover:underline">
                @jagoskilldigital
              </a>.
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {t('about.closeButton')}
          </button>
        </div>
      </div>
    </div>
  );
};
