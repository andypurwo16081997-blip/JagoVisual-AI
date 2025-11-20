import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { ImageData, ModelGenerationOptions } from '../types';
import { ImageUploader } from '../components/ImageUploader';
import { ResultDisplay } from '../components/ResultDisplay';
import { Spinner } from '../components/Spinner';
import { FeatureHeader } from '../components/FeatureHeader';
import { ModelOptions } from '../components/ModelOptions';
import { generateLifestylePhotoshoot } from '../services/geminiService';


export const LifestylePhotoshoot: React.FC = () => {
    const { t } = useLanguage();
    
    // State
    const [productImage, setProductImage] = useState<ImageData | null>(null);
    const [modelImage, setModelImage] = useState<ImageData | null>(null);
    const [modelOption, setModelOption] = useState<'upload' | 'generate'>('upload');
    const [generationParams, setGenerationParams] = useState<ModelGenerationOptions>({ gender: 'Female', ethnicity: 'Caucasian', customEthnicity: '', details: '' });
    const [interactionPrompt, setInteractionPrompt] = useState('');
    
    const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Handlers
    const handleProductImageUpload = (dataUrl: string, mimeType: string) => {
        setProductImage({ dataUrl, mimeType });
        setGeneratedImages(null);
        setSelectedImage(null);
        setError(null);
    };

    const handleModelImageUpload = (dataUrl: string, mimeType: string) => {
        setModelImage({ dataUrl, mimeType });
    };

    const handleGenerate = async () => {
        if (!productImage) {
            setError(t('lifestylePhotoshoot.errors.noProduct'));
            return;
        }
        if (modelOption === 'upload' && !modelImage) {
            setError(t('lifestylePhotoshoot.errors.noModel'));
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImages(null);
        setSelectedImage(null);

        try {
            const result = await generateLifestylePhotoshoot(
                productImage,
                modelOption === 'upload' ? modelImage : null,
                modelOption === 'generate' ? generationParams : null,
                interactionPrompt
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
    
    const handleReset = () => {
        setProductImage(null);
        setModelImage(null);
        setInteractionPrompt('');
        setGeneratedImages(null);
        setSelectedImage(null);
        setIsLoading(false);
        setError(null);
    };

    const handleDownload = () => {
        if (selectedImage) {
            const link = document.createElement('a');
            link.href = selectedImage;
            link.download = `lifestyle-photoshoot-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const isGenerateDisabled = isLoading || !productImage || (modelOption === 'upload' && !modelImage);
      
    return (
      <div>
        <FeatureHeader
          title={t('lifestylePhotoshoot.page.title')}
          description={t('lifestylePhotoshoot.page.description')}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700/50 flex flex-col space-y-8">
                {/* 1. Product Upload */}
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-lg">1</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('lifestylePhotoshoot.sections.uploadProduct.title').substring(3)}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('lifestylePhotoshoot.sections.uploadProduct.subtitle')}</p>
                        </div>
                    </div>
                    <ImageUploader
                        onImageUpload={handleProductImageUpload}
                        uploadedImage={productImage?.dataUrl || null}
                        label="Product Image"
                        labelKey="uploader.productLabel"
                    />
                </div>

                {/* 2. Model Options */}
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-lg">2</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('lifestylePhotoshoot.sections.provideModel.title').substring(3)}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('lifestylePhotoshoot.sections.provideModel.subtitle')}</p>
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

                {/* 3. Direct Photoshoot */}
                <div className="flex-grow flex flex-col">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-lg">3</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('lifestylePhotoshoot.sections.direct.title').substring(3)}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('lifestylePhotoshoot.sections.direct.subtitle')}</p>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="interactionPrompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('lifestylePhotoshoot.form.interaction.label')}</label>
                        <textarea
                            id="interactionPrompt"
                            rows={4}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            placeholder={t('lifestylePhotoshoot.form.interaction.placeholder')}
                            value={interactionPrompt}
                            onChange={(e) => setInteractionPrompt(e.target.value)}
                        />
                    </div>
                
                    <div className="flex-grow flex flex-col justify-end mt-6">
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerateDisabled}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600 transition-colors"
                        >
                            {isLoading ? <Spinner className="h-6 w-6 text-white" /> : t('lifestylePhotoshoot.generateButton')}
                        </button>
                        {error && (
                            <p className="text-center text-sm text-red-500 mt-2">{error}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column */}
            <ResultDisplay
                originalImage={modelImage?.dataUrl || productImage?.dataUrl || null}
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