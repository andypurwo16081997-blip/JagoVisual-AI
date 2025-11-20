import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { ImageData, ModelGenerationOptions } from '../types';
import { ImageUploader } from './ImageUploader';

// Constants for model generation
const GENDERS = ['Female', 'Male', 'Other'];
const ETHNICITIES = ['Caucasian', 'Asian', 'African', 'Hispanic', 'Middle Eastern', 'Other'];

interface ModelOptionsProps {
    modelOption: 'upload' | 'generate';
    setModelOption: (option: 'upload' | 'generate') => void;
    modelImage: ImageData | null;
    handleModelImageUpload: (dataUrl: string, mimeType: string) => void;
    generationParams: ModelGenerationOptions;
    setGenerationParams: (params: ModelGenerationOptions) => void;
}

export const ModelOptions: React.FC<ModelOptionsProps> = ({ 
    modelOption, 
    setModelOption, 
    modelImage, 
    handleModelImageUpload, 
    generationParams, 
    setGenerationParams 
}) => {
  const { t } = useLanguage();
  
  const translatedEthnicities = ETHNICITIES.map(key => ({
    key,
    name: t(`virtualTryOn.modelOptions.ethnicities.${key.charAt(0).toLowerCase() + key.slice(1).replace(' ', '')}`) || key
  }));

  const handleEthnicityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newEthnicity = e.target.value;
    // If the user selects something other than "Other", clear the custom field.
    if (newEthnicity !== 'Other') {
        setGenerationParams({ ...generationParams, ethnicity: newEthnicity, customEthnicity: '' });
    } else {
        setGenerationParams({ ...generationParams, ethnicity: newEthnicity });
    }
  };

  const handleCustomEthnicityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setGenerationParams({ ...generationParams, customEthnicity: e.target.value });
  };


  return (
    <div className="space-y-4">
      <div className="flex bg-gray-100 dark:bg-gray-700 rounded-full p-1">
        <button
          onClick={() => setModelOption('upload')}
          className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-colors ${modelOption === 'upload' ? 'bg-white dark:bg-gray-900 text-primary-600 shadow' : 'text-gray-600 dark:text-gray-300'}`}
        >
          {t('virtualTryOn.modelOptions.upload')}
        </button>
        <button
          onClick={() => setModelOption('generate')}
          className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-colors ${modelOption === 'generate' ? 'bg-white dark:bg-gray-900 text-primary-600 shadow' : 'text-gray-600 dark:text-gray-300'}`}
        >
          {t('virtualTryOn.modelOptions.generate')}
        </button>
      </div>

      {modelOption === 'upload' ? (
        <ImageUploader
          onImageUpload={handleModelImageUpload}
          uploadedImage={modelImage?.dataUrl || null}
          label="Upload Model Image"
          labelKey="uploader.modelLabel"
        />
      ) : (
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('virtualTryOn.modelOptions.gender')}</label>
            <select
              value={generationParams.gender}
              onChange={(e) => setGenerationParams({ ...generationParams, gender: e.target.value })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              {GENDERS.map(gender => <option key={gender} value={gender}>{t(`virtualTryOn.modelOptions.${gender.toLowerCase()}`)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('virtualTryOn.modelOptions.ethnicity')}</label>
            <select
              value={generationParams.ethnicity}
              onChange={handleEthnicityChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              {translatedEthnicities.map(eth => <option key={eth.key} value={eth.key}>{eth.name}</option>)}
            </select>
          </div>
          {generationParams.ethnicity === 'Other' && (
            <div>
              <label htmlFor="custom-ethnicity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('virtualTryOn.modelOptions.customEthnicity.label')}</label>
              <input
                type="text"
                id="custom-ethnicity"
                value={generationParams.customEthnicity || ''}
                onChange={handleCustomEthnicityChange}
                placeholder={t('virtualTryOn.modelOptions.customEthnicity.placeholder')}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('virtualTryOn.modelOptions.details')}</label>
            <textarea
              rows={3}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder={t('virtualTryOn.modelOptions.detailsPlaceholder')}
              value={generationParams.details}
              onChange={(e) => setGenerationParams({ ...generationParams, details: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  );
};