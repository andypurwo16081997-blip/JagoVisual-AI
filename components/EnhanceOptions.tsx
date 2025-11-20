import React, { useState, useEffect } from 'react';
import { EnhanceMethod, CustomizationOptions } from '../types';
import { THEMES } from '../constants';
import { ImageUploader } from './ImageUploader';
import { SmartIcon } from './icons/SmartIcon';
import { CustomizeIcon } from './icons/CustomizeIcon';
import { ReferenceIcon } from './icons/ReferenceIcon';
import { Spinner } from './Spinner';
import { useLanguage } from '../contexts/LanguageContext';

interface EnhanceOptionsProps {
  onEnhance: (method: EnhanceMethod, options: CustomizationOptions) => void;
  isLoading: boolean;
  onReferenceImageUpload: (dataUrl: string, mimeType: string) => void;
  referenceImage: string | null;
  isProductImageUploaded: boolean;
}

const MethodButton = ({ Icon, label, isActive, onClick }: { Icon: React.FC, label: string, isActive: boolean, onClick: () => void }) => (
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

export const EnhanceOptions: React.FC<EnhanceOptionsProps> = ({ 
  onEnhance, 
  isLoading, 
  onReferenceImageUpload,
  referenceImage,
  isProductImageUploaded
}) => {
  const { t } = useLanguage();
  const [activeMethod, setActiveMethod] = useState<EnhanceMethod>(EnhanceMethod.SMART);
  const [theme, setTheme] = useState(THEMES[0].key);
  const [customTheme, setCustomTheme] = useState('');
  const [props, setProps] = useState(THEMES[0].props);
  const [instructions, setInstructions] = useState('');
  
  // Reset instructions when method changes to avoid carrying over text between tabs
  useEffect(() => {
    setInstructions('');
  }, [activeMethod]);


  const handleEnhanceClick = () => {
    if (!isProductImageUploaded) return;

    const options: CustomizationOptions = {
      theme,
      customTheme,
      props,
      instructions
    };
    onEnhance(activeMethod, options);
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedThemeKey = e.target.value;
    setTheme(selectedThemeKey);

    if (selectedThemeKey === 'Other') {
      setProps('');
    } else {
      const selectedThemeObject = THEMES.find(t => t.key === selectedThemeKey);
      if (selectedThemeObject) {
        setProps(selectedThemeObject.props);
      }
    }
  };

  const isEnhanceButtonDisabled = isLoading || !isProductImageUploaded || (activeMethod === EnhanceMethod.REFERENCE && !referenceImage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row gap-3">
        <MethodButton 
          Icon={SmartIcon} 
          label={EnhanceMethod.SMART} 
          isActive={activeMethod === EnhanceMethod.SMART} 
          onClick={() => setActiveMethod(EnhanceMethod.SMART)} 
        />
        <MethodButton 
          Icon={CustomizeIcon} 
          label={EnhanceMethod.CUSTOMIZE} 
          isActive={activeMethod === EnhanceMethod.CUSTOMIZE} 
          onClick={() => setActiveMethod(EnhanceMethod.CUSTOMIZE)} 
        />
        <MethodButton 
          Icon={ReferenceIcon} 
          label={EnhanceMethod.REFERENCE} 
          isActive={activeMethod === EnhanceMethod.REFERENCE} 
          onClick={() => setActiveMethod(EnhanceMethod.REFERENCE)} 
        />
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg min-h-[220px]">
        {activeMethod === EnhanceMethod.SMART && (
          <div className="text-center text-gray-600 dark:text-gray-400 p-4">
            <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200">{t('options.smart.title')}</h3>
            <p>{t('options.smart.description')}</p>
          </div>
        )}
        {activeMethod === EnhanceMethod.CUSTOMIZE && (
          <div className="space-y-4">
            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('options.customize.theme.label')}</label>
              <select
                id="theme"
                name="theme"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                value={theme}
                onChange={handleThemeChange}
              >
                {THEMES.map(tItem => <option key={tItem.key} value={tItem.key}>{t(`themes.${tItem.key}`)}</option>)}
                <option value="Other">{t('options.customize.theme.other')}</option>
              </select>
            </div>
            {theme === 'Other' && (
              <div>
                <label htmlFor="custom-theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('options.customize.customTheme.label')}</label>
                <input
                  type="text"
                  id="custom-theme"
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder={t('options.customize.customTheme.placeholder')}
                  value={customTheme}
                  onChange={(e) => setCustomTheme(e.target.value)}
                />
              </div>
            )}
             <div>
              <label htmlFor="props" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('options.customize.props.label')}</label>
              <input
                type="text"
                id="props"
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder={t('options.customize.props.placeholder')}
                value={props}
                onChange={(e) => setProps(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('options.shared.instructions.label')}</label>
              <textarea
                id="instructions"
                rows={3}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder={t('options.shared.instructions.placeholderCustomize')}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>
          </div>
        )}
        {activeMethod === EnhanceMethod.REFERENCE && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('options.reference.description')}</p>
               <ImageUploader 
                onImageUpload={onReferenceImageUpload} 
                uploadedImage={referenceImage}
                label="Upload Reference Image"
                labelKey="uploader.referenceLabel"
              />
            </div>
            <div>
              <label htmlFor="instructions-ref" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('options.shared.instructions.label')}</label>
              <textarea
                id="instructions-ref"
                rows={3}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder={t('options.shared.instructions.placeholderReference')}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleEnhanceClick}
        disabled={isEnhanceButtonDisabled}
        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600 transition-colors"
      >
        {isLoading ? <Spinner className="h-6 w-6 text-white" /> : `✨ ${t('options.enhanceButton')}`}
      </button>
      {!isProductImageUploaded && (
        <p className="text-center text-sm text-red-500">{t('errors.noProductImage')}</p>
      )}
      {activeMethod === EnhanceMethod.REFERENCE && !referenceImage && isProductImageUploaded && (
        <p className="text-center text-sm text-yellow-600 dark:text-yellow-400">{t('errors.noReferenceImage')}</p>
      )}
    </div>
  );
};