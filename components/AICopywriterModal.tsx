import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { AdCopySuggestions } from '../types';
import { generateAdCopySuggestions } from '../services/geminiService';
import { Spinner } from './Spinner';
import { SparklesIcon } from './icons/SparklesIcon';

interface AICopywriterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCopy: (text: string, field: 'headline' | 'description' | 'cta') => void;
}

export const AICopywriterModal: React.FC<AICopywriterModalProps> = ({ isOpen, onClose, onSelectCopy }) => {
  const { t } = useLanguage();
  const [productName, setProductName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [suggestions, setSuggestions] = useState<AdCopySuggestions | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!productName.trim()) return;
    setIsLoading(true);
    setError(null);
    setSuggestions(null);

    try {
      const result = await generateAdCopySuggestions(productName, keywords);
      setSuggestions(result);
    } catch (e) {
      console.error(e);
      setError(t('adCreator.copywriter.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseSuggestion = (text: string, field: 'headline' | 'description' | 'cta') => {
    onSelectCopy(text, field);
  };

  const SuggestionSection: React.FC<{ title: string; items: string[]; field: 'headline' | 'description' | 'cta' }> = ({ title, items, field }) => (
    <div>
        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{title}</h4>
        <ul className="space-y-2">
            {items.map((item, index) => (
                <li key={index} className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-md flex justify-between items-center gap-2">
                    <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">{item}</p>
                    <button 
                        onClick={() => handleUseSuggestion(item, field)}
                        className="px-3 py-1 text-xs font-bold text-white bg-primary-600 rounded-full hover:bg-primary-700 transition-colors flex-shrink-0"
                    >
                       {t('adCreator.copywriter.useButton')}
                    </button>
                </li>
            ))}
        </ul>
    </div>
  );

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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('adCreator.copywriter.modalTitle')}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" aria-label="Close">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          
          <div className="mt-4 space-y-4">
            <div>
                <label htmlFor="productName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('adCreator.copywriter.productNameLabel')}</label>
                <input
                    type="text"
                    id="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder={t('adCreator.copywriter.productNamePlaceholder')}
                />
            </div>
             <div>
                <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('adCreator.copywriter.keywordsLabel')}</label>
                <input
                    type="text"
                    id="keywords"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder={t('adCreator.copywriter.keywordsPlaceholder')}
                />
            </div>
            <button
              onClick={handleGenerate}
              disabled={isLoading || !productName.trim()}
              className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600 transition-colors"
            >
              {isLoading ? <Spinner className="h-5 w-5" /> : <SparklesIcon className="w-5 h-5" />}
              {t('adCreator.copywriter.generateButton')}
            </button>
          </div>
          
          <div className="mt-6">
            {isLoading && (
              <div className="text-center p-8">
                <Spinner className="h-8 w-8 mx-auto text-primary-500" />
                <p className="mt-2 text-gray-500 dark:text-gray-400">{t('adCreator.copywriter.loading')}</p>
              </div>
            )}
            {error && <p className="text-center text-red-500">{error}</p>}
            {suggestions && (
              <div className="space-y-6">
                <SuggestionSection title={t('adCreator.copywriter.suggestionsFor.headline')} items={suggestions.headlines} field="headline" />
                <SuggestionSection title={t('adCreator.copywriter.suggestionsFor.description')} items={suggestions.descriptions} field="description" />
                <SuggestionSection title={t('adCreator.copywriter.suggestionsFor.cta')} items={suggestions.ctas} field="cta" />
              </div>
            )}
          </div>

        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {t('about.closeButton')}
          </button>
        </div>
      </div>
    </div>
  );
};