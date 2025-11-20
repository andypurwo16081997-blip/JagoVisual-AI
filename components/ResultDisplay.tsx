

import React, { useState } from 'react';
import { Spinner } from './Spinner';
import { DownloadIcon } from './icons/DownloadIcon';
import { ZoomIcon } from './icons/ZoomIcon';
import { ZoomModal } from './ZoomModal';
import { useLanguage } from '../contexts/LanguageContext';
import { InfoIcon } from './icons/InfoIcon';

interface ResultDisplayProps {
  originalImage: string | null;
  generatedImages: string[] | null;
  selectedImage: string | null;
  isLoading: boolean;
  error: string | null;
  onDownload: () => void;
  onReset: () => void;
  onSelectImage: (imageUrl: string) => void;
  loadingTitleKey?: string;
  resultTitleKey?: string;
  resultDescriptionKey?: string;
  specialContent?: React.ReactNode;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  originalImage,
  generatedImages,
  selectedImage,
  isLoading,
  error,
  onDownload,
  onReset,
  onSelectImage,
  loadingTitleKey = 'results.loading.title',
  resultTitleKey = 'results.title',
  resultDescriptionKey = 'results.description',
  specialContent = null,
}) => {
  const { t } = useLanguage();
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center h-full">
          <Spinner className="h-12 w-12 text-primary-600" />
          <h3 className="mt-4 text-xl font-bold">{t(loadingTitleKey)}</h3>
          <p className="text-gray-500 dark:text-gray-400">{t('results.loading.subtitle')}</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center h-full text-red-500">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h3 className="text-xl font-bold">{t('results.error.title')}</h3>
          <p className="text-sm mb-4">{error}</p>
          <button
            onClick={onReset}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            {t('results.error.button')}
          </button>
        </div>
      );
    }
    
    if (specialContent) {
      return specialContent;
    }

    if (!generatedImages || generatedImages.length === 0) {
      return (
        <div className="flex items-center justify-center text-center h-full text-gray-400 dark:text-gray-500">
          <p>{t('results.placeholder')}</p>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col">
        {/* Main selected image */}
        <div 
          className="flex-grow relative bg-black/80 dark:bg-black/90 rounded-lg mb-4 cursor-pointer group"
          onClick={() => setIsZoomModalOpen(true)}
        >
          {selectedImage && (
            <img
              src={selectedImage}
              alt={t('results.imageAlt')}
              className="object-contain w-full h-full rounded-lg"
            />
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
            <ZoomIcon className="w-12 h-12 text-white" />
          </div>
        </div>
        
        {/* Thumbnails */}
        <div className="flex justify-center space-x-2">
          {generatedImages.map((img, index) => (
            <div
              key={index}
              onClick={(e) => {
                e.stopPropagation(); // Prevent modal from opening when clicking thumbnail
                onSelectImage(img);
              }}
              className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-md cursor-pointer overflow-hidden transition-all duration-200
                ${selectedImage === img ? 'ring-4 ring-primary-500' : 'ring-2 ring-transparent hover:ring-primary-400'}`}
            >
              <img
                src={img}
                alt={`${t('results.variantLabel')} ${index + 1}`}
                className="w-full h-full object-cover"
              />
               <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-0.5">{t('results.variantLabel')} {index + 1}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const stepNumber = resultTitleKey.includes('Editor') ? '4' : '3';

  return (
    <>
      <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700/50 flex flex-col space-y-4 h-full">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">{stepNumber}</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t(resultTitleKey).substring(3)}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t(resultDescriptionKey)}</p>
          </div>
        </div>
        <div className="flex-grow aspect-[4/3] w-full bg-gray-100 dark:bg-gray-900/50 rounded-lg p-2">
          {renderContent()}
        </div>
        {(generatedImages && generatedImages.length > 0) && !isLoading && !error && (
          <div className="flex flex-col gap-4">
             <button
              onClick={onDownload}
              disabled={!selectedImage}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <DownloadIcon className="w-6 h-6" />
              {t('results.downloadButton')}
            </button>
            <button
              onClick={onReset}
              className="w-full text-center text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500 hover:underline"
            >
              {t('results.resetButton')}
            </button>
          </div>
        )}

        {/* Note section */}
        {isLoading && (
          <div className="text-center">
            <div className="inline-flex items-center text-left justify-center gap-2 text-xs text-yellow-800 dark:text-yellow-300 p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
                <InfoIcon className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">{t('notes.navigationWarning')}</span>
            </div>
          </div>
        )}
        {generatedImages && generatedImages.length > 0 && !isLoading && !error && !specialContent && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <InfoIcon className="w-4 h-4 flex-shrink-0" />
                <span>{t('notes.staticWarning')}</span>
            </div>
          </div>
        )}
      </div>
      <ZoomModal 
        isOpen={isZoomModalOpen}
        onClose={() => setIsZoomModalOpen(false)}
        imageUrl={selectedImage || ''}
      />
    </>
  );
};
