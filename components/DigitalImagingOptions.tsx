import React, { useState, useEffect } from 'react';
import { CustomizationOptions } from '../types';
import { DIGITAL_IMAGING_THEMES } from '../constants';
import { Spinner } from './Spinner';
import { useLanguage } from '../contexts/LanguageContext';

interface DigitalImagingOptionsProps {
  onGenerate: (options: CustomizationOptions) => void;
  isLoading: boolean;
  isProductImageUploaded: boolean;
}

export const DigitalImagingOptions: React.FC<DigitalImagingOptionsProps> = ({ 
  onGenerate, 
  isLoading, 
  isProductImageUploaded
}) => {
  const { t } = useLanguage();
  const [theme, setTheme] = useState(DIGITAL_IMAGING_THEMES[0].key);
  const [customTheme, setCustomTheme] = useState('');
  const [props, setProps] = useState(DIGITAL_IMAGING_THEMES[0].props);
  const [instructions, setInstructions] = useState('');

  const handleGenerateClick = () => {
    if (!isProductImageUploaded) return;
    const options: CustomizationOptions = { theme, customTheme, props, instructions };
    onGenerate(options);
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedThemeKey = e.target.value;
    setTheme(selectedThemeKey);

    if (selectedThemeKey === 'Other') {
      setProps('');
    } else {
      const selectedThemeObject = DIGITAL_IMAGING_THEMES.find(t => t.key === selectedThemeKey);
      if (selectedThemeObject) {
        setProps(selectedThemeObject.props);
      }
    }
  };

  const isGenerateButtonDisabled = isLoading || !isProductImageUploaded;

  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg space-y-4">
        <div>
          <label htmlFor="di-theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('options.customize.theme.label')}</label>
          <select
            id="di-theme"
            name="theme"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            value={theme}
            onChange={handleThemeChange}
          >
            {DIGITAL_IMAGING_THEMES.map(tItem => <option key={tItem.key} value={tItem.key}>{t(`digitalImaging.themes.${tItem.key}`)}</option>)}
            <option value="Other">{t('options.customize.theme.other')}</option>
          </select>
        </div>
        {theme === 'Other' && (
          <div>
            <label htmlFor="di-custom-theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('options.customize.customTheme.label')}</label>
            <input
              type="text"
              id="di-custom-theme"
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder={t('options.customize.customTheme.placeholder')}
              value={customTheme}
              onChange={(e) => setCustomTheme(e.target.value)}
            />
          </div>
        )}
        <div>
          <label htmlFor="di-props" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('options.customize.props.label')}</label>
          <input
            type="text"
            id="di-props"
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder={t('options.customize.props.placeholder')}
            value={props}
            onChange={(e) => setProps(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="di-instructions" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('options.shared.instructions.label')}</label>
          <textarea
            id="di-instructions"
            rows={3}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder={t('options.shared.instructions.placeholderCustomize')}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={handleGenerateClick}
        disabled={isGenerateButtonDisabled}
        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600 transition-colors"
      >
        {isLoading ? <Spinner className="h-6 w-6 text-white" /> : t('digitalImaging.generateButton')}
      </button>
      {!isProductImageUploaded && (
        <p className="text-center text-sm text-red-500">{t('errors.noProductImage')}</p>
      )}
    </div>
  );
};