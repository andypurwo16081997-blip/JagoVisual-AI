import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { ImageData, ModelGenerationOptions } from '../types';
import { ImageUploader } from '../components/ImageUploader';
import { ResultDisplay } from '../components/ResultDisplay';
import { PlusIcon } from '../components/icons/PlusIcon';
import { TrashIcon } from '../components/icons/TrashIcon';
import { Spinner } from '../components/Spinner';
import { FeatureHeader } from '../components/FeatureHeader';
import { ModelOptions } from '../components/ModelOptions';
import { generateVirtualTryOn } from '../services/geminiService';

export const VirtualTryOn: React.FC = () => {
    const { t } = useLanguage();
    // State
    const [productImages, setProductImages] = useState<(ImageData | null)[]>([null]);
    const [modelImage, setModelImage] = useState<ImageData | null>(null);
    const [modelOption, setModelOption] = useState<'upload' | 'generate'>('upload');
    const [generationParams, setGenerationParams] = useState<ModelGenerationOptions>({ gender: 'Female', ethnicity: 'Caucasian', customEthnicity: '', details: '' });
    
    const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Handlers for product images
    const handleAddProductSlot = () => {
        if (productImages.length < 4) {
            setProductImages(prev => [...prev, null]);
        }
    };
    const handleProductImageUpload = (dataUrl: string, mimeType: string, index: number) => {
        setProductImages(prev => {
            const newImages = [...prev];
            newImages[index] = { dataUrl, mimeType };
            return newImages;
        });
        setGeneratedImages(null);
        setSelectedImage(null);
        setError(null);
    };
    const handleRemoveProductSlot = (index: number) => {
        const newImages = productImages.filter((_, i) => i !== index);
        if (newImages.length === 0) {
            setProductImages([null]);
        } else {
            setProductImages(newImages);
        }
    };

    // Handlers for model
    const handleModelImageUpload = (dataUrl: string, mimeType: string) => {
        setModelImage({ dataUrl, mimeType });
    };

    // Main generation handler
    const handleGenerate = async () => {
        const validProductImages = productImages.filter(p => p !== null) as ImageData[];
        if (validProductImages.length === 0) {
            setError(t('virtualTryOn.errors.noProducts'));
            return;
        }
        if (modelOption === 'upload' && !modelImage) {
            setError(t('virtualTryOn.errors.noModel'));
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImages(null);
        setSelectedImage(null);

        try {
            const result = await generateVirtualTryOn(
                validProductImages,
                modelOption === 'upload' ? modelImage : null,
                modelOption === 'generate' ? generationParams : null,
            );
            
            setGeneratedImages(result.imageUrls);
            if (result.imageUrls.length > 0) {
                setSelectedImage(result.imageUrls[0]);
            }
        } catch (e: any) {
            console.error(e);
            setError(e.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };
    
    // Reset and download handlers
    const handleReset = () => {
        setProductImages([null]);
        setModelImage(null);
        setGeneratedImages(null);
        setSelectedImage(null);
        setIsLoading(false);
        setError(null);
    };

    const handleDownload = () => {
        if (selectedImage) {
            const link = document.createElement('a');
            link.href = selectedImage;
            link.download = `virtual-try-on-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const isGenerateDisabled = isLoading ||
      (productImages.filter(p => p).length === 0) ||
      (modelOption === 'upload' && !modelImage);
      
    return (
      <div>
        <FeatureHeader
          title={t('virtualTryOn.page.title')}
          description={t('virtualTryOn.page.description')}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700/50 flex flex-col space-y-8">
                {/* Product Upload */}
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-lg">1</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('virtualTryOn.sections.uploadProduct.title').substring(3)}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('virtualTryOn.sections.uploadProduct.subtitle')}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {productImages.map((img, index) => (
                            <div key={index} className="relative group">
                                <ImageUploader
                                    onImageUpload={(dataUrl, mimeType) => handleProductImageUpload(dataUrl, mimeType, index)}
                                    uploadedImage={img?.dataUrl || null}
                                    label={`Product Image ${index + 1}`}
                                    labelKey="uploader.productLabel"
                                />
                                {productImages.length > 1 && (
                                    <button
                                        onClick={() => handleRemoveProductSlot(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label="Remove product"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                        {productImages.length < 4 && (
                            <button
                                onClick={handleAddProductSlot}
                                className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-primary-500 hover:text-primary-500 transition-colors"
                            >
                                <PlusIcon className="w-8 h-8 mb-2" />
                                <span className="text-sm font-semibold">{t('virtualTryOn.sections.uploadProduct.addProduct')}</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Model Options */}
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-lg">2</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('virtualTryOn.sections.provideModel.title').substring(3)}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('virtualTryOn.sections.provideModel.subtitle')}</p>
                        </div>
                    </div>
                    <ModelOptions
                        modelOption={modelOption}
                        setModelOption={setModelOption}
                        modelImage={modelImage}
                        handleModelImageUpload={handleModelImageUpload}
                        generationParams={generationParams}
                        setGenerationParams={setGenerationParams}
                    />
                </div>
                
                 <div className="flex-grow flex flex-col justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerateDisabled}
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600 transition-colors"
                      >
                        {isLoading ? <Spinner className="h-6 w-6 text-white" /> : t('virtualTryOn.generateButton')}
                      </button>
                      {error && (
                         <p className="text-center text-sm text-red-500 mt-2">{error}</p>
                      )}
                 </div>
            </div>

            {/* Right Column */}
            <ResultDisplay
                originalImage={modelImage?.dataUrl || productImages.find(p => p)?.dataUrl || null}
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
    );
};