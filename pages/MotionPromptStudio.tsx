import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FeatureHeader } from '../components/FeatureHeader';
import { ImageUploader } from '../components/ImageUploader';
import { Spinner } from '../components/Spinner';
import { generateMotionPrompt } from '../services/geminiService';
import type { ImageData } from '../types';
import { CopyIcon } from '../components/icons/CopyIcon';
import { CheckIcon } from '../components/icons/CheckIcon';
import { InfoIcon } from '../components/icons/InfoIcon';

const PromptResultCard: React.FC<{ prompt: string }> = ({ prompt }) => {
    const { t } = useLanguage();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 flex-grow">{prompt}</p>
            <button
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-primary-500"
            >
                {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                {copied ? t('motionPromptStudio.results.copied') : t('motionPromptStudio.results.copyButton')}
            </button>
        </div>
    );
};


export const MotionPromptStudio: React.FC = () => {
  const { t } = useLanguage();
  const [image, setImage] = useState<ImageData | null>(null);
  const [keywords, setKeywords] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPrompts, setGeneratedPrompts] = useState<string[] | null>(null);

  const handleImageUpload = (dataUrl: string, mimeType: string) => {
    setImage({ dataUrl, mimeType });
    setGeneratedPrompts(null);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!image) {
      setError(t('motionPromptStudio.errors.noImage'));
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedPrompts(null);

    try {
      const { prompts } = await generateMotionPrompt(image, keywords);
      setGeneratedPrompts(prompts);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setKeywords('');
    setIsLoading(false);
    setError(null);
    setGeneratedPrompts(null);
  };

  const isGenerateDisabled = isLoading || !image;

  const renderResultContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center h-full">
          <Spinner className="h-12 w-12 text-primary-600" />
          <h3 className="mt-4 text-xl font-bold">{t('motionPromptStudio.loading.title')}</h3>
          <div className="mt-4 inline-flex items-center text-left justify-center gap-2 text-xs text-yellow-800 dark:text-yellow-300 p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
            <InfoIcon className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">{t('notes.navigationWarning')}</span>
          </div>
        </div>
      );
    }

    if (error) {
       return (
        <div className="flex flex-col items-center justify-center text-center h-full text-red-500">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h3 className="text-xl font-bold">{t('results.error.title')}</h3>
          <p className="text-sm mb-4">{error}</p>
          <button onClick={handleReset} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
            {t('results.error.button')}
          </button>
        </div>
      );
    }

    if (generatedPrompts) {
      return (
        <div className="space-y-4">
            {generatedPrompts.map((prompt, index) => (
                <PromptResultCard key={index} prompt={prompt} />
            ))}
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center text-center h-full text-gray-400 dark:text-gray-500">
        <p>{t('motionPromptStudio.results.placeholder')}</p>
      </div>
    );
  };

  return (
    <div>
      <FeatureHeader
        title={t('sidebar.motionPromptStudio')}
        description={t('motionPromptStudio.page.description')}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700/50 flex flex-col space-y-8">
          {/* Step 1: Upload */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('motionPromptStudio.sections.upload.title').substring(3)}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('motionPromptStudio.sections.upload.subtitle')}</p>
              </div>
            </div>
            <ImageUploader 
              onImageUpload={handleImageUpload}
              uploadedImage={image?.dataUrl || null}
              label="Upload Image"
              labelKey="uploader.imageLabel"
            />
          </div>
          
          {/* Step 2: Keywords */}
          <div className="flex flex-col flex-grow">
            <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('motionPromptStudio.sections.keywords.title').substring(3)}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('motionPromptStudio.sections.keywords.subtitle')}</p>
                </div>
            </div>
            <textarea
              rows={3}
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder={t('motionPromptStudio.form.placeholder')}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
            <div className="flex-grow flex flex-col justify-end mt-6">
              <button
                onClick={handleGenerate}
                disabled={isGenerateDisabled}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600 transition-colors"
              >
                {isLoading ? <Spinner className="h-6 w-6 text-white" /> : t('motionPromptStudio.generateButton')}
              </button>
              {error && !isLoading && (
                <p className="text-center text-sm text-red-500 mt-2">{error}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Right Column: Result */}
        <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700/50 flex flex-col space-y-4 h-full">
            <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-lg">3</span>
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('motionPromptStudio.results.title').substring(3)}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('motionPromptStudio.results.description')}</p>
                </div>
            </div>
            <div className="flex-grow w-full rounded-lg p-2 overflow-y-auto">
                {renderResultContent()}
            </div>
            {generatedPrompts && !isLoading && !error && (
            <div className="flex flex-col gap-4">
                <button
                    onClick={handleGenerate}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-primary-600 rounded-md shadow-sm text-base font-bold text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                    {t('motionPromptStudio.results.regenerateButton')}
                </button>
                <button
                    onClick={handleReset}
                    className="w-full text-center text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500 hover:underline"
                >
                    {t('results.resetButton')}
                </button>
                <div className="text-center pt-2 border-t border-gray-200 dark:border-gray-700/50">
                    <div className="inline-flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <InfoIcon className="w-4 h-4 flex-shrink-0" />
                        <span>{t('notes.staticWarning')}</span>
                    </div>
                </div>
            </div>
            )}
        </div>

      </div>
    </div>
  );
};