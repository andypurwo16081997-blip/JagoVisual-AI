import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FeatureHeader } from '../components/FeatureHeader';
import { ImageUploader } from '../components/ImageUploader';
import { Spinner } from '../components/Spinner';
import { FaceSwapResult } from '../components/FaceSwap/FaceSwapResult';
import { swapFace } from '../services/geminiService';
import type { ImageData } from '../types';

export const FaceSwapStudio: React.FC = () => {
  const { t } = useLanguage();
  const [targetImage, setTargetImage] = useState<ImageData | null>(null);
  const [faceImage, setFaceImage] = useState<ImageData | null>(null);
  
  const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTargetImageUpload = (dataUrl: string, mimeType: string) => {
    setTargetImage({ dataUrl, mimeType });
    setGeneratedImages(null);
    setError(null);
  };
  
  const handleFaceImageUpload = (dataUrl: string, mimeType: string) => {
    setFaceImage({ dataUrl, mimeType });
    setGeneratedImages(null);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!targetImage) {
      setError(t('faceSwapStudio.errors.noTarget'));
      return;
    }
    if (!faceImage) {
      setError(t('faceSwapStudio.errors.noFace'));
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages(null);

    try {
      const result = await swapFace(targetImage, faceImage);
      setGeneratedImages(result.imageUrls);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setTargetImage(null);
    setFaceImage(null);
    setGeneratedImages(null);
    setIsLoading(false);
    setError(null);
  };

  const isGenerateDisabled = isLoading || !targetImage || !faceImage;

  return (
    <div>
      <FeatureHeader
        title={t('faceSwapStudio.page.title')}
        description={t('faceSwapStudio.page.description')}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Uploads & Generate */}
        <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700/50 flex flex-col space-y-8">
          {/* Step 1: Upload Target */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('faceSwapStudio.sections.uploadTarget.title').substring(3)}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('faceSwapStudio.sections.uploadTarget.subtitle')}</p>
              </div>
            </div>
            <ImageUploader 
              onImageUpload={handleTargetImageUpload}
              uploadedImage={targetImage?.dataUrl || null}
              label="Upload Target Image"
              labelKey="uploader.targetImageLabel"
            />
          </div>

          {/* Step 2: Upload Face */}
          <div className="flex-grow flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('faceSwapStudio.sections.uploadFace.title').substring(3)}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('faceSwapStudio.sections.uploadFace.subtitle')}</p>
              </div>
            </div>
            <ImageUploader 
              onImageUpload={handleFaceImageUpload}
              uploadedImage={faceImage?.dataUrl || null}
              label="Upload Face Image"
              labelKey="uploader.faceImageLabel"
            />
            <div className="flex-grow flex flex-col justify-end mt-6">
              <button
                onClick={handleGenerate}
                disabled={isGenerateDisabled}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600 transition-colors"
              >
                {isLoading ? <Spinner className="h-6 w-6 text-white" /> : t('faceSwapStudio.generateButton')}
              </button>
              {error && !isLoading && <p className="text-center text-sm text-red-500 mt-2">{error}</p>}
            </div>
          </div>
        </div>

        {/* Right Column: Results & Editing */}
        <FaceSwapResult
          generatedImages={generatedImages}
          isLoading={isLoading}
          error={error}
          onReset={handleReset}
        />
      </div>
    </div>
  );
};