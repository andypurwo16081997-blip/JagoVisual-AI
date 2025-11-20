
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FeatureHeader } from '../components/FeatureHeader';
import { ImageUploader } from '../components/ImageUploader';
import { ResultDisplay } from '../components/ResultDisplay';
import { Spinner } from '../components/Spinner';
import { generateDesignFromSketch } from '../services/geminiService';
import type { ImageData, SketchDesignOptions } from '../types';
import { SketchDesignCategory, SketchDesignMode } from '../types';
import { SKETCH_CATEGORIES, FASHION_PLACEMENTS } from '../constants';
import { SmartIcon } from '../components/icons/SmartIcon';
import { CustomizeIcon } from '../components/icons/CustomizeIcon';
import { ReferenceIcon } from '../components/icons/ReferenceIcon';
import { MagicBrushCanvas } from '../components/ImageEditor/MagicBrushCanvas';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import { MagicBrushIcon } from '../components/icons/MagicBrushIcon';

const ModeButton = ({ Icon, label, isActive, onClick }: { Icon: React.FC, label: string, isActive: boolean, onClick: () => void }) => (
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

export const SketchDesignStudio: React.FC = () => {
  const { t } = useLanguage();
  const [sketchImage, setSketchImage] = useState<ImageData | null>(null);
  const [referenceImage, setReferenceImage] = useState<ImageData | null>(null);
  
  const [category, setCategory] = useState<SketchDesignCategory>(SketchDesignCategory.FASHION);
  const [mode, setMode] = useState<SketchDesignMode>(SketchDesignMode.SMART);
  const [prompt, setPrompt] = useState('');
  
  // Fashion specific state
  const [fashionPattern, setFashionPattern] = useState('');
  const [fashionPlacement, setFashionPlacement] = useState('ALL');

  const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [imageToEdit, setImageToEdit] = useState<ImageData | null>(null);
  const [editedImages, setEditedImages] = useState<string[] | null>(null);
  const [selectedEditedImage, setSelectedEditedImage] = useState<string | null>(null);
  const [isEditingLoading, setIsEditingLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editActionTrigger, setEditActionTrigger] = useState<(() => void) | null>(null);

  const handleImageUpload = (dataUrl: string, mimeType: string) => {
    setSketchImage({ dataUrl, mimeType });
    setGeneratedImages(null);
    setSelectedImage(null);
    setError(null);
    setIsEditing(false); // Reset edit mode on new upload
  };

  const handleReferenceImageUpload = (dataUrl: string, mimeType: string) => {
    setReferenceImage({ dataUrl, mimeType });
  };

  const handleGenerate = async () => {
    if (!sketchImage) {
      setError(t('sketchDesignStudio.errors.noImage'));
      return;
    }
    if (mode === SketchDesignMode.CUSTOMIZE && !prompt.trim() && category !== SketchDesignCategory.FASHION) {
      setError(t('sketchDesignStudio.errors.noPrompt'));
      return;
    }
    if (mode === SketchDesignMode.REFERENCE && !referenceImage) {
        setError(t('sketchDesignStudio.errors.noReference'));
        return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages(null);
    setSelectedImage(null);
    setIsEditing(false);
    setEditedImages(null);

    const options: SketchDesignOptions = {
      category,
      mode,
      prompt: mode === SketchDesignMode.CUSTOMIZE ? prompt : undefined,
      referenceImage: mode === SketchDesignMode.REFERENCE && referenceImage ? referenceImage : undefined,
      fashionPattern: (category === SketchDesignCategory.FASHION && (mode !== SketchDesignMode.SMART) && fashionPattern) ? fashionPattern : undefined,
      fashionPlacement: (category === SketchDesignCategory.FASHION && (mode !== SketchDesignMode.SMART) && fashionPlacement) ? fashionPlacement : undefined,
    };

    try {
      const result = await generateDesignFromSketch(sketchImage, options);
      setGeneratedImages(result.imageUrls);
      if (result.imageUrls && result.imageUrls.length > 0) {
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
    setSketchImage(null);
    setReferenceImage(null);
    setCategory(SketchDesignCategory.FASHION);
    setMode(SketchDesignMode.SMART);
    setPrompt('');
    setFashionPattern('');
    setFashionPlacement('ALL');
    setGeneratedImages(null);
    setSelectedImage(null);
    setIsLoading(false);
    setError(null);
    setIsEditing(false);
    setEditedImages(null);
    setImageToEdit(null);
  };

  const handleDownload = (url: string | null) => {
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = `sketch-design-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSelectImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };
  
  const handleEditClick = () => {
    if (selectedImage) {
      setImageToEdit({ dataUrl: selectedImage, mimeType: 'image/png' });
      setIsEditing(true);
      setEditedImages(null);
      setSelectedEditedImage(null);
      setEditError(null);
    }
  };

  const handleBackToView = () => {
    setIsEditing(false);
    setImageToEdit(null);
  };
  
  const handleProcessEdit = () => {
      if (editActionTrigger) {
          editActionTrigger();
      }
  };

  const isGenerateDisabled = isLoading || !sketchImage || 
    (mode === SketchDesignMode.CUSTOMIZE && !prompt.trim() && category !== SketchDesignCategory.FASHION) ||
    (mode === SketchDesignMode.REFERENCE && !referenceImage);

  return (
    <div>
      <FeatureHeader
        title={t('sketchDesignStudio.page.title')}
        description={t('sketchDesignStudio.page.description')}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700/50 flex flex-col space-y-8">
          
          {/* Render Edit Mode UI if active */}
          {isEditing && imageToEdit ? (
            <div className="flex flex-col space-y-4 h-full">
                <div className="flex items-center gap-2">
                    <button onClick={handleBackToView} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('sketchDesignStudio.editor.title')}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('sketchDesignStudio.editor.description')}</p>
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
                        {isEditingLoading ? <Spinner className="h-6 w-6 text-white" /> : t('sketchDesignStudio.generateEditButton')}
                    </button>
                 </div>
            </div>
          ) : (
          /* Render Normal Generation UI */
          <>
            {/* Step 1: Upload */}
            <div>
                <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-lg">1</span>
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('sketchDesignStudio.sections.upload.title').substring(3)}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('sketchDesignStudio.sections.upload.subtitle')}</p>
                </div>
                </div>
                <ImageUploader 
                onImageUpload={handleImageUpload}
                uploadedImage={sketchImage?.dataUrl || null}
                label="Upload Sketch"
                labelKey="uploader.sketchLabel"
                />
            </div>
            
            {/* Step 2: Details */}
            <div className="flex-grow flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-lg">2</span>
                    </div>
                    <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('sketchDesignStudio.sections.details.title').substring(3)}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('sketchDesignStudio.sections.details.subtitle')}</p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    {/* Category Selection */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('sketchDesignStudio.form.category.label')}</label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value as SketchDesignCategory)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                        >
                            {SKETCH_CATEGORIES.map(cat => (
                                <option key={cat.key} value={cat.name}>{t(`sketchDesignStudio.categories.${cat.key}`)}</option>
                            ))}
                        </select>
                    </div>

                    {/* Mode Selection */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <ModeButton Icon={SmartIcon} label={t('sketchDesignStudio.modes.smart.title')} isActive={mode === SketchDesignMode.SMART} onClick={() => setMode(SketchDesignMode.SMART)} />
                        <ModeButton Icon={CustomizeIcon} label={t('sketchDesignStudio.modes.customize.title')} isActive={mode === SketchDesignMode.CUSTOMIZE} onClick={() => setMode(SketchDesignMode.CUSTOMIZE)} />
                        <ModeButton Icon={ReferenceIcon} label={t('sketchDesignStudio.modes.reference.title')} isActive={mode === SketchDesignMode.REFERENCE} onClick={() => setMode(SketchDesignMode.REFERENCE)} />
                    </div>

                    {/* Mode Specific Content */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg min-h-[120px] flex flex-col justify-center">
                        {mode === SketchDesignMode.SMART && (
                            <p className="text-center text-gray-600 dark:text-gray-400">{t('sketchDesignStudio.modes.smart.description')}</p>
                        )}

                        {mode === SketchDesignMode.CUSTOMIZE && (
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('sketchDesignStudio.form.prompt.label')}</label>
                                    <textarea
                                        id="prompt"
                                        rows={4}
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder={t('sketchDesignStudio.form.prompt.placeholder')}
                                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                        )}

                        {mode === SketchDesignMode.REFERENCE && (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('sketchDesignStudio.modes.reference.description')}</p>
                                <ImageUploader 
                                    onImageUpload={handleReferenceImageUpload} 
                                    uploadedImage={referenceImage?.dataUrl || null}
                                    label="Upload Reference Image"
                                    labelKey="uploader.referenceLabel"
                                />
                            </div>
                        )}

                        {/* Fashion Specific Options (Visible in Customize and Reference modes) */}
                        {category === SketchDesignCategory.FASHION && mode !== SketchDesignMode.SMART && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                                <div>
                                    <label htmlFor="fashionPattern" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('sketchDesignStudio.form.fashionPattern.label')}</label>
                                    <input
                                        type="text"
                                        id="fashionPattern"
                                        value={fashionPattern}
                                        onChange={(e) => setFashionPattern(e.target.value)}
                                        placeholder={t('sketchDesignStudio.form.fashionPattern.placeholder')}
                                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="fashionPlacement" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('sketchDesignStudio.form.fashionPlacement.label')}</label>
                                    <select
                                        id="fashionPlacement"
                                        value={fashionPlacement}
                                        onChange={(e) => setFashionPlacement(e.target.value)}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                                    >
                                        {FASHION_PLACEMENTS.map(fp => (
                                            <option key={fp.key} value={fp.key}>{t(`sketchDesignStudio.fashionPlacements.${fp.key}`)}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-grow flex flex-col justify-end mt-6">
                <button
                    onClick={handleGenerate}
                    disabled={isGenerateDisabled}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600 transition-colors"
                >
                    {isLoading ? <Spinner className="h-6 w-6 text-white" /> : t('sketchDesignStudio.generateButton')}
                </button>
                {error && !isLoading && (
                    <p className="text-center text-sm text-red-500 mt-2">{error}</p>
                )}
                </div>
            </div>
          </>
          )}
        </div>
        
        {/* Right Column: Result */}
        <div className="flex flex-col h-full">
            <div className="flex-grow">
                 {/* Show Edited Results if editing has produced results */}
                 {isEditing ? (
                    <ResultDisplay
                        originalImage={imageToEdit?.dataUrl || null}
                        generatedImages={editedImages}
                        selectedImage={selectedEditedImage}
                        isLoading={isEditingLoading}
                        error={editError}
                        onDownload={() => handleDownload(selectedEditedImage)}
                        onReset={() => { setEditedImages(null); setEditError(null); }}
                        onSelectImage={setSelectedEditedImage}
                        loadingTitleKey="results.loading.titleEditor"
                        resultTitleKey="results.titleEditor"
                    />
                 ) : (
                     /* Show Original Generation Results */
                    <ResultDisplay
                        originalImage={sketchImage?.dataUrl || null}
                        generatedImages={generatedImages}
                        selectedImage={selectedImage}
                        isLoading={isLoading}
                        error={error}
                        onDownload={() => handleDownload(selectedImage)}
                        onReset={handleReset}
                        onSelectImage={handleSelectImage}
                    />
                 )}
            </div>
            
             {/* Edit Button Trigger - Only show when we have a generated result and NOT editing */}
            {!isEditing && generatedImages && generatedImages.length > 0 && !isLoading && !error && (
                <div className="mt-4">
                    <button 
                        onClick={handleEditClick} 
                        disabled={!selectedImage} 
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-primary-600 rounded-md shadow-sm text-base font-bold text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50"
                    >
                        <MagicBrushIcon /> {t('sketchDesignStudio.editButton')}
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
