import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FeatureHeader } from '../components/FeatureHeader';
import { ImageUploader } from '../components/ImageUploader';
import { ResultDisplay } from '../components/ResultDisplay';
import { Spinner } from '../components/Spinner';
import { removeBackground, replaceBackground } from '../services/geminiService';
import type { ImageData } from '../types';
import { RemoveIcon } from '../components/icons/RemoveIcon';
import { ReplaceIcon } from '../components/icons/ReplaceIcon';

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

const TransparentResultDisplay: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
    const { t } = useLanguage();
    return (
        <div className="flex flex-col items-center justify-center text-center h-full">
            <h3 className="text-xl font-bold mb-2">{t('backgroundStudio.results.transparent')}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('backgroundStudio.results.description')}</p>
            <div 
                className="w-full h-full max-h-80 rounded-lg"
                style={{
                    backgroundImage: `
                        linear-gradient(45deg, #ccc 25%, transparent 25%), 
                        linear-gradient(-45deg, #ccc 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, #ccc 75%),
                        linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                }}
            >
                <img src={imageUrl} alt={t('backgroundStudio.results.transparent')} className="w-full h-full object-contain" />
            </div>
        </div>
    );
}

export const BackgroundStudio: React.FC = () => {
    const { t } = useLanguage();
    const [image, setImage] = useState<ImageData | null>(null);
    const [mode, setMode] = useState<'remove' | 'replace'>('remove');
    const [backgroundPrompt, setBackgroundPrompt] = useState('');
    
    const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = (dataUrl: string, mimeType: string) => {
        setImage({ dataUrl, mimeType });
        setGeneratedImages(null);
        setSelectedImage(null);
        setError(null);
    };

    const handleGenerate = async () => {
        if (!image) {
            setError(t('errors.noProductImage'));
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImages(null);
        setSelectedImage(null);

        try {
            let result;
            if (mode === 'remove') {
                result = await removeBackground(image);
            } else {
                if (!backgroundPrompt.trim()) {
                   throw new Error("Please enter a background description.");
                }
                result = await replaceBackground(image, backgroundPrompt);
            }

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
        setImage(null);
        setMode('remove');
        setBackgroundPrompt('');
        setGeneratedImages(null);
        setSelectedImage(null);
        setIsLoading(false);
        setError(null);
    };

    const handleDownload = () => {
        if (selectedImage) {
            const link = document.createElement('a');
            link.href = selectedImage;
            link.download = `background-studio-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    
    const isGenerateDisabled = isLoading || !image || (mode === 'replace' && !backgroundPrompt.trim());
    const generateButtonText = mode === 'remove' 
        ? t('backgroundStudio.generateButton.remove') 
        : t('backgroundStudio.generateButton.replace');

    const renderSpecialResult = () => {
        if (mode === 'remove' && selectedImage && !isLoading && !error) {
            return <TransparentResultDisplay imageUrl={selectedImage} />
        }
        return null;
    }

    return (
        <div>
            <FeatureHeader
                title={t('backgroundStudio.page.title')}
                description={t('backgroundStudio.page.description')}
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
                            uploadedImage={image?.dataUrl || null}
                            label="Upload Image"
                            labelKey="uploader.imageLabel"
                        />
                    </div>

                    {/* Step 2: Choose Tool */}
                    <div className="flex-grow flex flex-col">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-md">
                                <span className="text-white font-bold text-lg">2</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('backgroundStudio.sections.chooseTool.title').substring(3)}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('backgroundStudio.sections.chooseTool.subtitle')}</p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <ToolButton Icon={RemoveIcon} label={t('backgroundStudio.tools.remove.title')} isActive={mode === 'remove'} onClick={() => setMode('remove')} />
                            <ToolButton Icon={ReplaceIcon} label={t('backgroundStudio.tools.replace.title')} isActive={mode === 'replace'} onClick={() => setMode('replace')} />
                        </div>

                        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg min-h-[150px] flex flex-col justify-center">
                            {mode === 'remove' ? (
                                <p className="text-sm text-center text-gray-600 dark:text-gray-400">{t('backgroundStudio.tools.remove.description')}</p>
                            ) : (
                                <div>
                                    <label htmlFor="backgroundPrompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('backgroundStudio.tools.replace.description')}</label>
                                    <textarea
                                        id="backgroundPrompt"
                                        rows={4}
                                        value={backgroundPrompt}
                                        onChange={(e) => setBackgroundPrompt(e.target.value)}
                                        placeholder={t('backgroundStudio.tools.replace.placeholder')}
                                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    />
                                </div>
                            )}
                        </div>
                        
                        <div className="flex-grow flex flex-col justify-end mt-6">
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerateDisabled}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600 transition-colors"
                            >
                                {isLoading ? <Spinner className="h-6 w-6 text-white" /> : generateButtonText}
                            </button>
                            {error && !isLoading && <p className="text-center text-sm text-red-500 mt-2">{error}</p>}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <ResultDisplay
                    originalImage={image?.dataUrl || null}
                    generatedImages={generatedImages}
                    selectedImage={selectedImage}
                    isLoading={isLoading}
                    error={error}
                    onDownload={handleDownload}
                    onReset={handleReset}
                    onSelectImage={setSelectedImage}
                    specialContent={renderSpecialResult()}
                />
            </div>
        </div>
    );
};
