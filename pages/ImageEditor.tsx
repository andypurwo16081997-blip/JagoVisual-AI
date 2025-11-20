

import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FeatureHeader } from '../components/FeatureHeader';
import { ImageUploader } from '../components/ImageUploader';
import { ResultDisplay } from '../components/ResultDisplay';
import type { ImageData } from '../types';
import { ImageEditorMode } from '../types';
import { resizeImage, editImageWithMask } from '../services/geminiService';

import { ResizeIcon } from '../components/icons/ResizeIcon';
import { MagicBrushIcon } from '../components/icons/MagicBrushIcon';
import { ResizeControls } from '../components/ImageEditor/ResizeControls';
import { MagicBrushCanvas } from '../components/ImageEditor/MagicBrushCanvas';
import { Spinner } from '../components/Spinner';


const ToolButton = ({ Icon, label, isActive, onClick }: { Icon: React.FC, label: string, isActive: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex-1 px-5 py-3 rounded-full flex flex-row items-center justify-center gap-x-2.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-primary-500 ${
      isActive
        ? 'bg-primary-600 text-white shadow-md'
        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
    }`}
  >
    <Icon />
    <span className="font-semibold text-base">{label}</span>
  </button>
);


export const ImageEditor: React.FC = () => {
  const { t } = useLanguage();
  const [uploadedImage, setUploadedImage] = useState<ImageData | null>(null);
  const [activeTool, setActiveTool] = useState<ImageEditorMode>(ImageEditorMode.RESIZE);
  
  const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [actionTrigger, setActionTrigger] = useState<(() => void) | null>(null);

  const handleImageUpload = (dataUrl: string, mimeType: string) => {
    setUploadedImage({ dataUrl, mimeType });
    setGeneratedImages(null);
    setSelectedImage(null);
    setError(null);
  };
  
  const handleGenerate = async () => {
    if (actionTrigger) {
      actionTrigger();
    }
  };

  const handleReset = () => {
    setUploadedImage(null);
    setGeneratedImages(null);
    setSelectedImage(null);
    setIsLoading(false);
    setError(null);
    setActionTrigger(null);
  };

  const handleDownload = () => {
    if (selectedImage) {
      const link = document.createElement('a');
      link.href = selectedImage;
      link.download = `edited-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const isGenerateDisabled = isLoading || !uploadedImage;

  return (
    <div>
      <FeatureHeader
        title={t('imageEditor.page.title')}
        description={t('imageEditor.page.description')}
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
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('sections.upload.title').substring(3)}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('sections.upload.subtitle')}</p>
                </div>
              </div>
              <ImageUploader 
                onImageUpload={handleImageUpload}
                uploadedImage={uploadedImage?.dataUrl || null}
                label="Upload Image"
                labelKey="uploader.imageLabel"
              />
            </div>

            {/* Step 2: Choose Tool */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-lg">2</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('sections.tools.title').substring(3)}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('sections.tools.subtitle')}</p>
                  </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <ToolButton Icon={ResizeIcon} label={t('imageEditor.tools.resize.title')} isActive={activeTool === ImageEditorMode.RESIZE} onClick={() => setActiveTool(ImageEditorMode.RESIZE)} />
                <ToolButton Icon={MagicBrushIcon} label={t('imageEditor.tools.magicBrush.title')} isActive={activeTool === ImageEditorMode.MAGIC_BRUSH} onClick={() => setActiveTool(ImageEditorMode.MAGIC_BRUSH)} />
              </div>
            </div>

            {/* Step 3: Tool Options */}
            <div className="flex-grow flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-lg">3</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('sections.tools.options.title').substring(3)}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('sections.tools.options.subtitle')}</p>
                    </div>
                </div>
                
                <div className="flex-grow">
                  {activeTool === ImageEditorMode.RESIZE && uploadedImage && (
                    <ResizeControls 
                      originalImage={uploadedImage} 
                      setIsLoading={setIsLoading}
                      setError={setError}
                      setGeneratedImages={setGeneratedImages}
                      setSelectedImage={setSelectedImage}
                      setActionTrigger={setActionTrigger}
                     />
                  )}
                   {activeTool === ImageEditorMode.MAGIC_BRUSH && uploadedImage && (
                    <MagicBrushCanvas
                      originalImage={uploadedImage} 
                      setIsLoading={setIsLoading}
                      setError={setError}
                      setGeneratedImages={setGeneratedImages}
                      setSelectedImage={setSelectedImage}
                      setActionTrigger={setActionTrigger}
                    />
                  )}
                  {!uploadedImage && (
                     <div className="flex items-center justify-center h-full text-center text-gray-400 dark:text-gray-500 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <p>{t('errors.noImage')}</p>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerateDisabled}
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600 transition-colors"
                    >
                        {isLoading ? <Spinner className="h-6 w-6 text-white" /> : t('imageEditor.generateButton')}
                    </button>
                    {error && !isLoading && (
                        <p className="text-center text-sm text-red-500 mt-2">{error}</p>
                    )}
                </div>
            </div>

        </div>

        {/* Right Column */}
        <ResultDisplay
          originalImage={uploadedImage?.dataUrl || null}
          generatedImages={generatedImages}
          selectedImage={selectedImage}
          isLoading={isLoading}
          error={error}
          onDownload={handleDownload}
          onReset={handleReset}
          onSelectImage={setSelectedImage}
          loadingTitleKey='results.loading.titleEditor'
          resultTitleKey='results.titleEditor'
          resultDescriptionKey='results.descriptionEditor'
        />
      </div>
    </div>
  );
};