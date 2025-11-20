import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Spinner } from '../Spinner';
import { DownloadIcon } from '../icons/DownloadIcon';
import { ZoomIcon } from '../icons/ZoomIcon';
import { ZoomModal } from '../ZoomModal';
import { MagicBrushCanvas } from '../ImageEditor/MagicBrushCanvas';
import { editImageWithMask } from '../../services/geminiService';
import type { ImageData } from '../../types';
import { MagicBrushIcon } from '../icons/MagicBrushIcon';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { ResultDisplay } from '../ResultDisplay';

interface FaceSwapResultProps {
  generatedImages: string[] | null;
  isLoading: boolean;
  error: string | null;
  onReset: () => void;
}

export const FaceSwapResult: React.FC<FaceSwapResultProps> = ({
  generatedImages,
  isLoading,
  error,
  onReset,
}) => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  
  // State for view mode
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  // State for edit mode
  const [imageToEdit, setImageToEdit] = useState<ImageData | null>(null);
  const [editedImages, setEditedImages] = useState<string[] | null>(null);
  const [selectedEditedImage, setSelectedEditedImage] = useState<string | null>(null);
  const [isEditingLoading, setIsEditingLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editActionTrigger, setEditActionTrigger] = useState<(() => void) | null>(null);

  useEffect(() => {
    if (generatedImages && generatedImages.length > 0) {
      setSelectedImage(generatedImages[0]);
    } else {
      setSelectedImage(null);
    }
  }, [generatedImages]);

  const handleDownload = (imageUrl: string | null) => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `pixelcraft-faceswap-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleEditClick = () => {
    if (selectedImage) {
      setImageToEdit({ dataUrl: selectedImage, mimeType: 'image/png' });
      setMode('edit');
      setEditedImages(null);
      setSelectedEditedImage(null);
      setEditError(null);
    }
  };

  const handleBackToView = () => {
    setMode('view');
    setImageToEdit(null);
  };
  
  const handleProcessEdit = () => {
      if (editActionTrigger) {
          editActionTrigger();
      }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center h-full">
          <Spinner className="h-12 w-12 text-primary-600" />
          <h3 className="mt-4 text-xl font-bold">{t('results.loading.title')}</h3>
          <p className="text-gray-500 dark:text-gray-400">{t('results.loading.subtitle')}</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center h-full text-red-500">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h3 className="text-xl font-bold">{t('results.error.title')}</h3>
          <p className="text-sm mb-4">{error}</p>
          <button onClick={onReset} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
            {t('results.error.button')}
          </button>
        </div>
      );
    }

    if (!generatedImages || generatedImages.length === 0) {
      return (
        <div className="flex items-center justify-center text-center h-full text-gray-400 dark:text-gray-500">
          <p>{t('results.placeholder')}</p>
        </div>
      );
    }

    // --- VIEW MODE ---
    return (
      <div className="h-full flex flex-col">
        <div className="flex-grow relative bg-black/80 dark:bg-black/90 rounded-lg mb-4 cursor-pointer group" onClick={() => setIsZoomModalOpen(true)}>
          {selectedImage && <img src={selectedImage} alt={t('results.imageAlt')} className="object-contain w-full h-full rounded-lg" />}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
            <ZoomIcon className="w-12 h-12 text-white" />
          </div>
        </div>
        <div className="flex justify-center space-x-2">
          {generatedImages.map((img, index) => (
            <div key={index} onClick={() => setSelectedImage(img)} className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-md cursor-pointer overflow-hidden transition-all duration-200 ${selectedImage === img ? 'ring-4 ring-primary-500' : 'ring-2 ring-transparent hover:ring-primary-400'}`}>
              <img src={img} alt={`${t('results.variantLabel')} ${index + 1}`} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-0.5">{t('results.variantLabel')} {index + 1}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  if (mode === 'edit' && imageToEdit) {
    return (
        <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700/50 flex flex-col space-y-4 h-full">
            <div className="flex items-center gap-2">
                <button onClick={handleBackToView} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <ArrowLeftIcon className="w-5 h-5" />
                </button>
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('imageEditor.tools.magicBrush.title')}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('imageEditor.tools.magicBrush.description')}</p>
                </div>
            </div>
             <MagicBrushCanvas
                originalImage={imageToEdit}
                setIsLoading={setIsEditingLoading}
                setError={setEditError}
                setGeneratedImages={setEditedImages}
                setSelectedImage={setSelectedEditedImage}
                setActionTrigger={setEditActionTrigger}
             />
             <div className="flex-grow flex flex-col justify-end mt-6">
                <button onClick={handleProcessEdit} disabled={isEditingLoading} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600 transition-colors">
                    {isEditingLoading ? <Spinner className="h-6 w-6 text-white" /> : t('imageEditor.generateButton')}
                </button>
             </div>
             { (editedImages || editError) && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <ResultDisplay
                        originalImage={imageToEdit.dataUrl}
                        generatedImages={editedImages}
                        selectedImage={selectedEditedImage}
                        isLoading={isEditingLoading}
                        error={editError}
                        onDownload={() => handleDownload(selectedEditedImage)}
                        onReset={() => { setEditedImages(null); setEditError(null); }}
                        onSelectImage={setSelectedEditedImage}
                        resultTitleKey="results.titleEditor"
                    />
                </div>
             )}
        </div>
    )
  }

  return (
    <>
      <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700/50 flex flex-col space-y-4 h-full">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">3</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('faceSwapStudio.sections.results.title').substring(3)}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('faceSwapStudio.sections.results.description')}</p>
          </div>
        </div>
        <div className="flex-grow aspect-[4/3] w-full bg-gray-100 dark:bg-gray-900/50 rounded-lg p-2">
          {renderContent()}
        </div>
        {generatedImages && generatedImages.length > 0 && !isLoading && !error && (
          <div className="flex flex-col gap-4">
            <button onClick={handleEditClick} disabled={!selectedImage} className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-primary-600 rounded-md shadow-sm text-base font-bold text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50">
                <MagicBrushIcon /> {t('faceSwapStudio.editButton')}
            </button>
            <button onClick={() => handleDownload(selectedImage)} disabled={!selectedImage} className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
              <DownloadIcon className="w-6 h-6" /> {t('results.downloadButton')}
            </button>
            <button onClick={onReset} className="w-full text-center text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500 hover:underline">
              {t('results.resetButton')}
            </button>
          </div>
        )}
      </div>
      <ZoomModal isOpen={isZoomModalOpen} onClose={() => setIsZoomModalOpen(false)} imageUrl={selectedImage || ''} />
    </>
  );
};
