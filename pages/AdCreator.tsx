import React, { useState } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { ResultDisplay } from '../components/ResultDisplay';
import { generateAdImage } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import type { ImageData, AdCopyOptions } from '../types';
import { Spinner } from '../components/Spinner';
import { AICopywriterModal } from '../components/AICopywriterModal';
import { SparklesIcon } from '../components/icons/SparklesIcon';
import { FeatureHeader } from '../components/FeatureHeader';

export const AdCreator: React.FC = () => {
  const { t } = useLanguage();
  const [productImage, setProductImage] = useState<ImageData | null>(null);
  const [referenceImage, setReferenceImage] = useState<ImageData | null>(null);
  const [adCopy, setAdCopy] = useState<AdCopyOptions>({
    headline: '',
    description: '',
    cta: '',
    instructions: '',
  });
  const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopywriterModalOpen, setIsCopywriterModalOpen] = useState(false);


  const handleProductImageUpload = (dataUrl: string, mimeType: string) => {
    setProductImage({ dataUrl, mimeType });
    setGeneratedImages(null);
    setSelectedImage(null);
    setError(null);
  };

  const handleReferenceImageUpload = (dataUrl: string, mimeType: string) => {
    setReferenceImage({ dataUrl, mimeType });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAdCopy(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectCopy = (text: string, field: keyof Omit<AdCopyOptions, 'instructions'>) => {
    setAdCopy(prev => ({ ...prev, [field]: text }));
    setIsCopywriterModalOpen(false);
  };

  const handleGenerate = async () => {
    if (!productImage) {
      setError(t('adCreator.errors.noProductImage'));
      return;
    }
    if (!adCopy.headline.trim()) {
      setError(t('adCreator.errors.noHeadline'));
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages(null);
    setSelectedImage(null);

    try {
      const result = await generateAdImage(productImage, adCopy, referenceImage);
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
  
  const handleReset = () => {
    setProductImage(null);
    setReferenceImage(null);
    setAdCopy({ headline: '', description: '', cta: '', instructions: '' });
    setGeneratedImages(null);
    setSelectedImage(null);
    setIsLoading(false);
    setError(null);
  };

  const handleDownload = () => {
    if (selectedImage) {
      const link = document.createElement('a');
      link.href = selectedImage;
      link.download = `ad-poster-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const isGenerateDisabled = isLoading || !productImage || !adCopy.headline.trim();

  return (
    <>
      <div>
        <FeatureHeader
          title={t('adCreator.page.title')}
          description={t('adCreator.page.description')}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Upload and Options */}
          <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700/50 flex flex-col space-y-8">
            {/* Product Upload */}
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
                onImageUpload={handleProductImageUpload}
                uploadedImage={productImage?.dataUrl || null}
                label="Upload Product Image"
                labelKey="uploader.productLabel"
              />
            </div>
            
            {/* Ad Copy Form */}
            <div className="flex flex-col flex-grow">
                <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-lg">2</span>
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('adCreator.sections.addCopy.title').substring(3)}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('adCreator.sections.addCopy.subtitle')}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsCopywriterModalOpen(true)}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/50 rounded-full hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-colors"
                    >
                      <SparklesIcon className="w-4 h-4" />
                      {t('adCreator.copywriter.button').split(' ')[0]}
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="headline" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('adCreator.form.headline.label')}</label>
                        <input
                            type="text"
                            name="headline"
                            id="headline"
                            value={adCopy.headline}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            placeholder={t('adCreator.form.headline.placeholder')}
                        />
                    </div>
                     <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('adCreator.form.description.label')}</label>
                        <textarea
                            name="description"
                            id="description"
                            rows={3}
                            value={adCopy.description}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            placeholder={t('adCreator.form.description.placeholder')}
                        />
                    </div>
                     <div>
                        <label htmlFor="cta" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('adCreator.form.cta.label')}</label>
                        <input
                            type="text"
                            name="cta"
                            id="cta"
                            value={adCopy.cta}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            placeholder={t('adCreator.form.cta.placeholder')}
                        />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('adCreator.form.reference.label')}</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t('adCreator.form.reference.description')}</p>
                      <ImageUploader 
                          onImageUpload={handleReferenceImageUpload}
                          uploadedImage={referenceImage?.dataUrl || null}
                          label="Upload Style Reference"
                          labelKey="uploader.styleReferenceLabel"
                      />
                    </div>
                     <div>
                        <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('adCreator.form.instructions.label')}</label>
                        <textarea
                            name="instructions"
                            id="instructions"
                            rows={2}
                            value={adCopy.instructions}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            placeholder={t('adCreator.form.instructions.placeholder')}
                        />
                    </div>
                </div>
                <div className="flex-grow flex flex-col justify-end mt-6">
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerateDisabled}
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600 transition-colors"
                    >
                        {isLoading ? <Spinner className="h-6 w-6 text-white" /> : t('adCreator.generateButton')}
                    </button>
                    {error && (
                        <p className="text-center text-sm text-red-500 mt-2">{error}</p>
                    )}
                </div>
            </div>
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
            onSelectImage={setSelectedImage}
          />
        </div>
      </div>
      <AICopywriterModal 
        isOpen={isCopywriterModalOpen}
        onClose={() => setIsCopywriterModalOpen(false)}
        onSelectCopy={handleSelectCopy}
      />
    </>
  );
}