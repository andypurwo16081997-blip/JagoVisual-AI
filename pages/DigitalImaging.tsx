import React, { useState } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { ResultDisplay } from '../components/ResultDisplay';
import { generateDigitalImaging, generateDigitalImagingConcepts, generateDigitalImagingFromConcept } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import type { ImageData, CustomizationOptions } from '../types';
import { FeatureHeader } from '../components/FeatureHeader';
import { DigitalImagingOptions } from '../components/DigitalImagingOptions';
import { Spinner } from '../components/Spinner';
import { SparklesIcon } from '../components/icons/SparklesIcon';

const ModeButton = ({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex-1 px-5 py-3 rounded-full flex flex-row items-center justify-center gap-x-2.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-fuchsia-500 ${
      isActive
        ? 'bg-fuchsia-600 text-white shadow-md'
        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
    }`}
  >
    <span className="font-semibold text-base">{label}</span>
  </button>
);

const ConceptCard: React.FC<{ concept: string; onGenerate: () => void; isLoading: boolean }> = ({ concept, onGenerate, isLoading }) => {
    const { t } = useLanguage();
    return (
        <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-3 border border-gray-200 dark:border-gray-600/50">
            <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">{concept}</p>
            <button
                onClick={onGenerate}
                disabled={isLoading}
                className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-fuchsia-600 rounded-full hover:bg-fuchsia-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {t('digitalImaging.conceptGenerator.generateImageButton')}
            </button>
        </div>
    );
};

export const DigitalImaging: React.FC = () => {
  const { t } = useLanguage();
  const [productImage, setProductImage] = useState<ImageData | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // New state for concept generation mode
  const [mode, setMode] = useState<'customize' | 'generateConcept'>('customize');
  const [concepts, setConcepts] = useState<string[] | null>(null);
  const [isConceptLoading, setIsConceptLoading] = useState(false);
  const [conceptError, setConceptError] = useState<string | null>(null);


  const handleProductImageUpload = (dataUrl: string, mimeType: string) => {
    setProductImage({ dataUrl, mimeType });
    // Reset everything when a new image is uploaded
    setGeneratedImages(null);
    setSelectedImage(null);
    setError(null);
    setConcepts(null);
    setConceptError(null);
  };

  const handleGenerateCustomize = async (options: CustomizationOptions) => {
    if (!productImage) {
      setError(t('errors.noProductImage'));
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages(null);
    setSelectedImage(null);

    try {
      const result = await generateDigitalImaging(productImage, options);
      setGeneratedImages(result.imageUrls);
      if (result.imageUrls && result.imageUrls.length > 0) {
        setSelectedImage(result.imageUrls[0]);
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateConcepts = async () => {
    if (!productImage) return;
    setIsConceptLoading(true);
    setConceptError(null);
    setConcepts(null);
    try {
        const result = await generateDigitalImagingConcepts(productImage);
        setConcepts(result.concepts);
    } catch (e: any) {
        console.error(e);
        setConceptError(t('digitalImaging.errors.conceptError'));
    } finally {
        setIsConceptLoading(false);
    }
  };

  const handleGenerateFromConcept = async (concept: string) => {
    if (!productImage) {
      setError(t('errors.noProductImage'));
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedImages(null);
    setSelectedImage(null);
    
    try {
        const result = await generateDigitalImagingFromConcept(productImage, concept);
        setGeneratedImages(result.imageUrls);
        if (result.imageUrls.length > 0) {
            setSelectedImage(result.imageUrls[0]);
        }
    } catch (e: any) {
        console.error(e);
        setError(e.message || "An unexpected error occurred. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setProductImage(null);
    setGeneratedImages(null);
    setSelectedImage(null);
    setIsLoading(false);
    setError(null);
    setConcepts(null);
    setConceptError(null);
  };

  const handleDownload = () => {
    if (selectedImage) {
      const link = document.createElement('a');
      link.href = selectedImage;
      link.download = `digital-imaging-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSelectImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  return (
    <div>
      <FeatureHeader 
        title={t('digitalImaging.page.title')}
        description={t('digitalImaging.page.description')}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Upload and Options */}
        <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700/50 space-y-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-fuchsia-600 to-fuchsia-700 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('sections.upload.title').substring(3)}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('sections.upload.subtitle')}</p>
              </div>
            </div>
            <ImageUploader 
              onImageUpload={handleProductImageUpload}
              uploadedImage={productImage?.dataUrl || null}
              label="Upload Product Image"
              labelKey="uploader.productLabel"
            />
          </div>
          
          <div>
             <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-fuchsia-600 to-fuchsia-700 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('digitalImaging.sections.concept.title').substring(3)}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('digitalImaging.sections.concept.subtitle')}</p>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
                <ModeButton label={t('digitalImaging.modes.customize')} isActive={mode === 'customize'} onClick={() => setMode('customize')} />
                <ModeButton label={t('digitalImaging.modes.generateConcept')} isActive={mode === 'generateConcept'} onClick={() => setMode('generateConcept')} />
            </div>
          </div>
          
          {mode === 'customize' ? (
            <div>
              <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-fuchsia-600 to-fuchsia-700 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-lg">3</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('digitalImaging.sections.style.title').substring(3)}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('digitalImaging.sections.style.subtitle')}</p>
                  </div>
              </div>
              <DigitalImagingOptions
                onGenerate={handleGenerateCustomize}
                isLoading={isLoading}
                isProductImageUploaded={!!productImage}
              />
            </div>
          ) : (
             <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-fuchsia-600 to-fuchsia-700 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-lg">3</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('digitalImaging.conceptGenerator.title').substring(3)}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('digitalImaging.conceptGenerator.subtitle')}</p>
                    </div>
                  </div>
                   <button
                        onClick={handleGenerateConcepts}
                        disabled={isConceptLoading || !productImage || isLoading}
                        className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-bold text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600 transition-colors"
                    >
                        {isConceptLoading ? <Spinner className="h-5 w-5" /> : <SparklesIcon className="h-5 w-5" />}
                        {t('digitalImaging.conceptGenerator.button')}
                    </button>
                </div>
                {(isConceptLoading || conceptError || concepts) && (
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-fuchsia-600 to-fuchsia-700 rounded-full flex items-center justify-center shadow-md">
                                <span className="text-white font-bold text-lg">4</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('digitalImaging.conceptGenerator.resultsTitle').substring(3)}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('digitalImaging.conceptGenerator.resultsSubtitle')}</p>
                            </div>
                        </div>
                        {isConceptLoading && <div className="text-center p-8 flex flex-col items-center"><Spinner className="h-8 w-8 text-fuchsia-500" /><p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t('digitalImaging.conceptGenerator.loading')}</p></div>}
                        {conceptError && <p className="text-center text-red-500 p-4">{conceptError}</p>}
                        {concepts && (
                            <div className="space-y-3 max-h-[20rem] overflow-y-auto p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                {concepts.map((concept, index) => (
                                    <ConceptCard key={index} concept={concept} onGenerate={() => handleGenerateFromConcept(concept)} isLoading={isLoading} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
             </div>
          )}
        </div>

        {/* Right Column: Result Display */}
        <ResultDisplay
          originalImage={productImage?.dataUrl || null}
          generatedImages={generatedImages}
          selectedImage={selectedImage}
          isLoading={isLoading}
          error={error}
          onDownload={handleDownload}
          onReset={handleReset}
          onSelectImage={handleSelectImage}
        />
      </div>
    </div>
  );
}