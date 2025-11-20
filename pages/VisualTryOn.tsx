import React, { useState } from 'react';
import { GoogleGenAI, Modality, Part } from '@google/genai';
import { useLanguage } from '../contexts/LanguageContext';
import type { ImageData, ModelGenerationOptions } from '../types';
import { ImageUploader } from '../components/ImageUploader';
import { ResultDisplay } from '../components/ResultDisplay';
import { PlusIcon } from '../components/icons/PlusIcon';
import { TrashIcon } from '../components/icons/TrashIcon';
import { Spinner } from '../components/Spinner';

// Constants for model generation
const GENDERS = ['Female', 'Male', 'Other'];
const ETHNICITIES = ['Caucasian', 'Asian', 'African', 'Hispanic', 'Middle Eastern', 'Other'];

// Conditional API key check
let ai = null;
try {
  if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  } else {
    console.warn("API_KEY environment variable not set. Gemini API calls will be disabled.");
  }
} catch (e) {
  console.error("Error initializing GoogleGenAI:", e);
}


// Model options component (local to this file)
const ModelOptions = ({ modelOption, setModelOption, modelImage, handleModelImageUpload, generationParams, setGenerationParams }) => {
  const { t } = useLanguage();
  
  const translatedEthnicities = ETHNICITIES.map(key => ({
    key,
    name: t(`visualTryOn.modelOptions.ethnicities.${key.charAt(0).toLowerCase() + key.slice(1).replace(' ', '')}`) || key
  }));


  return (
    <div className="space-y-4">
      <div className="flex bg-gray-100 dark:bg-gray-700 rounded-full p-1">
        <button
          onClick={() => setModelOption('upload')}
          className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-colors ${modelOption === 'upload' ? 'bg-white dark:bg-gray-900 text-fuchsia-600 shadow' : 'text-gray-600 dark:text-gray-300'}`}
        >
          {t('visualTryOn.modelOptions.upload')}
        </button>
        <button
          onClick={() => setModelOption('generate')}
          className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-colors ${modelOption === 'generate' ? 'bg-white dark:bg-gray-900 text-fuchsia-600 shadow' : 'text-gray-600 dark:text-gray-300'}`}
        >
          {t('visualTryOn.modelOptions.generate')}
        </button>
      </div>

      {modelOption === 'upload' ? (
        <ImageUploader
          onImageUpload={handleModelImageUpload}
          uploadedImage={modelImage?.dataUrl || null}
          label="Upload Model Image"
          labelKey="uploader.referenceLabel"
        />
      ) : (
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('visualTryOn.modelOptions.gender')}</label>
            <select
              value={generationParams.gender}
              onChange={(e) => setGenerationParams({ ...generationParams, gender: e.target.value })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm rounded-md"
            >
              {GENDERS.map(gender => <option key={gender} value={gender}>{t(`visualTryOn.modelOptions.${gender.toLowerCase()}`)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('visualTryOn.modelOptions.ethnicity')}</label>
            <select
              value={generationParams.ethnicity}
              onChange={(e) => setGenerationParams({ ...generationParams, ethnicity: e.target.value })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm rounded-md"
            >
              {translatedEthnicities.map(eth => <option key={eth.key} value={eth.key}>{eth.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('visualTryOn.modelOptions.details')}</label>
            <textarea
              rows={3}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
              placeholder={t('visualTryOn.modelOptions.detailsPlaceholder')}
              value={generationParams.details}
              onChange={(e) => setGenerationParams({ ...generationParams, details: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  );
};


export const VisualTryOn: React.FC = () => {
    const { t } = useLanguage();
    // State
    const [productImages, setProductImages] = useState<(ImageData | null)[]>([null]);
    const [modelImage, setModelImage] = useState<ImageData | null>(null);
    const [modelOption, setModelOption] = useState<'upload' | 'generate'>('upload');
    const [generationParams, setGenerationParams] = useState<ModelGenerationOptions>({ gender: 'Female', ethnicity: 'Caucasian', details: '' });
    
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

    const dataUrlToGeminiPart = (imageData: ImageData): Part => ({
        inlineData: {
            mimeType: imageData.mimeType,
            data: imageData.dataUrl.split(',')[1]
        }
    });

    // Main generation handler
    const handleGenerate = async () => {
        if (!ai) {
            setError("API Key is not configured. Cannot generate images.");
            return;
        }

        const validProductImages = productImages.filter(p => p !== null) as ImageData[];
        if (validProductImages.length === 0) {
            setError(t('visualTryOn.errors.noProducts'));
            return;
        }
        if (modelOption === 'upload' && !modelImage) {
            setError(t('visualTryOn.errors.noModel'));
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImages(null);
        setSelectedImage(null);

        try {
            const contentParts: Part[] = [];
            let prompt = "You are a world-class fashion AI assistant. ";

            if (modelOption === 'upload' && modelImage) {
                prompt += "Take the product(s) from the subsequent images and realistically place them on the model in the first image. Maintain the model's pose and the background. Ensure the fit, lighting, and shadows are natural and photorealistic.";
                contentParts.push(dataUrlToGeminiPart(modelImage));
                validProductImages.forEach(p => contentParts.push(dataUrlToGeminiPart(p)));
                contentParts.push({ text: prompt });
            } else {
                prompt += `First, generate a photorealistic, full-body image of a model with these characteristics: Gender: ${generationParams.gender}, Ethnicity: ${generationParams.ethnicity}, Details: ${generationParams.details}. Then, dress the generated model in the product(s) from the subsequent images. The final image should be a high-quality, professional fashion photo.`;
                validProductImages.forEach(p => contentParts.push(dataUrlToGeminiPart(p)));
                contentParts.push({ text: prompt });
            }
            
            const apiPromises = Array(3).fill(null).map(() => 
              ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: contentParts },
                config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
              })
            );

            const results = await Promise.all(apiPromises);

            const imageUrls: string[] = [];
            for (const result of results) {
                const candidate = result.candidates?.[0];
                const imagePart = candidate?.content.parts.find(p => p.inlineData);
                if (imagePart?.inlineData) {
                    imageUrls.push(`data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`);
                }
            }

            if (imageUrls.length === 0) {
                throw new Error("API did not return any images. They may have been blocked for safety reasons.");
            }
            
            setGeneratedImages(imageUrls);
            setSelectedImage(imageUrls[0]);

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
            link.download = `visual-try-on-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const isGenerateDisabled = isLoading ||
      (productImages.filter(p => p).length === 0) ||
      (modelOption === 'upload' && !modelImage);
      
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700/50 flex flex-col space-y-8">
                {/* Product Upload */}
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-fuchsia-600 to-fuchsia-700 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-lg">1</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('visualTryOn.sections.uploadProduct.title').substring(3)}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('visualTryOn.sections.uploadProduct.subtitle')}</p>
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
                                className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-fuchsia-500 hover:text-fuchsia-500 transition-colors"
                            >
                                <PlusIcon className="w-8 h-8 mb-2" />
                                <span className="text-sm font-semibold">{t('visualTryOn.sections.uploadProduct.addProduct')}</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Model Options */}
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-fuchsia-600 to-fuchsia-700 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-lg">2</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('visualTryOn.sections.provideModel.title').substring(3)}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('visualTryOn.sections.provideModel.subtitle')}</p>
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
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600 transition-colors"
                      >
                        {isLoading ? <Spinner className="h-6 w-6 text-white" /> : t('visualTryOn.generateButton')}
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
    );
};