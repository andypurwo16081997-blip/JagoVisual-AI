

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ImageUploader } from '../components/ImageUploader';
import { ResultDisplay } from '../components/ResultDisplay';
import { Spinner } from '../components/Spinner';
import { FeatureHeader } from '../components/FeatureHeader';
import { generateStudioPoses } from '../services/geminiService';
import type { ImageData, PoseStudioOptions } from '../types';
import { PoseStudioMode } from '../types';
import { THEMES } from '../constants';
import { SmartIcon } from '../components/icons/SmartIcon';
import { CustomizeIcon } from '../components/icons/CustomizeIcon';

const ANGLES = ['eyeLevel', 'highAngle', 'lowAngle', 'dutchAngle', 'wormsEyeView'];
const FRAMES = ['fullBody', 'mediumShot', 'cowboyShot', 'closeup'];
const DEPTHS_OF_FIELD = ['shallow', 'medium', 'deep'];
const LIGHTING_STYLES = ['softbox', 'rim', 'goldenHour', 'neon'];


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

const PoseStyleOptions: React.FC<{
  onGenerate: (mode: PoseStudioMode, options: PoseStudioOptions) => void;
  isLoading: boolean;
  isModelImageUploaded: boolean;
}> = ({ onGenerate, isLoading, isModelImageUploaded }) => {
  const { t } = useLanguage();
  const [activeMode, setActiveMode] = useState<PoseStudioMode>(PoseStudioMode.SMART);
  const [theme, setTheme] = useState(THEMES[0].key);
  const [customTheme, setCustomTheme] = useState('');
  const [angle, setAngle] = useState(ANGLES[0]);
  const [framing, setFraming] = useState(FRAMES[0]);
  const [depthOfField, setDepthOfField] = useState(DEPTHS_OF_FIELD[0]);
  const [lighting, setLighting] = useState(LIGHTING_STYLES[0]);
  const [instructions, setInstructions] = useState('');
  
  useEffect(() => {
    setInstructions('');
  }, [activeMode]);

  const handleGenerateClick = () => {
    if (!isModelImageUploaded) return;
    const options: PoseStudioOptions = { theme, customTheme, angle, framing, depthOfField, lighting, instructions };
    onGenerate(activeMode, options);
  };

  const isButtonDisabled = isLoading || !isModelImageUploaded;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <ModeButton Icon={SmartIcon} label={t('poseStudio.modes.smart.title')} isActive={activeMode === PoseStudioMode.SMART} onClick={() => setActiveMode(PoseStudioMode.SMART)} />
        <ModeButton Icon={CustomizeIcon} label={t('poseStudio.modes.customize.title')} isActive={activeMode === PoseStudioMode.CUSTOMIZE} onClick={() => setActiveMode(PoseStudioMode.CUSTOMIZE)} />
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg min-h-[250px] flex flex-col justify-center">
        {activeMode === PoseStudioMode.SMART && (
          <div className="text-center text-gray-600 dark:text-gray-400 p-4">
            <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200">{t('poseStudio.modes.smart.title')}</h3>
            <p>{t('poseStudio.modes.smart.description')}</p>
          </div>
        )}
        {activeMode === PoseStudioMode.CUSTOMIZE && (
          <div className="space-y-4">
             <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('poseStudio.form.theme.label')}</label>
              <select id="theme" value={theme} onChange={(e) => setTheme(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                {THEMES.map(tItem => <option key={tItem.key} value={tItem.key}>{t(`themes.${tItem.key}`)}</option>)}
                <option value="Other">{t('options.customize.theme.other')}</option>
              </select>
            </div>
            {theme === 'Other' && (
              <div>
                <label htmlFor="custom-theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('options.customize.customTheme.label')}</label>
                <input type="text" id="custom-theme" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder={t('options.customize.customTheme.placeholder')} value={customTheme} onChange={(e) => setCustomTheme(e.target.value)} />
              </div>
            )}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="angle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('poseStudio.form.angle.label')}</label>
                    <select id="angle" value={angle} onChange={(e) => setAngle(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                        {ANGLES.map(a => <option key={a} value={a}>{t(`poseStudio.angles.${a}`)}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="framing" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('poseStudio.form.framing.label')}</label>
                    <select id="framing" value={framing} onChange={(e) => setFraming(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                        {FRAMES.map(f => <option key={f} value={f}>{t(`poseStudio.frames.${f}`)}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="depthOfField" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('poseStudio.form.depthOfField.label')}</label>
                    <select id="depthOfField" value={depthOfField} onChange={(e) => setDepthOfField(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                        {DEPTHS_OF_FIELD.map(d => <option key={d} value={d}>{t(`poseStudio.dof.${d}`)}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="lighting" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('poseStudio.form.lighting.label')}</label>
                    <select id="lighting" value={lighting} onChange={(e) => setLighting(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                        {LIGHTING_STYLES.map(l => <option key={l} value={l}>{t(`poseStudio.lighting.${l}`)}</option>)}
                    </select>
                </div>
             </div>
             <div>
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('poseStudio.form.instructions.label')}</label>
              <textarea id="instructions" rows={2} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder={t('poseStudio.form.instructions.placeholder')} value={instructions} onChange={(e) => setInstructions(e.target.value)} />
            </div>
          </div>
        )}
      </div>

      <button onClick={handleGenerateClick} disabled={isButtonDisabled} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600 transition-colors">
        {isLoading ? <Spinner className="h-6 w-6 text-white" /> : t('poseStudio.generateButton')}
      </button>
      {!isModelImageUploaded && (
        <p className="text-center text-sm text-red-500">{t('poseStudio.errors.noModelImage')}</p>
      )}
    </div>
  );
};

export const StudioPose: React.FC = () => {
    const { t } = useLanguage();
    const [modelImage, setModelImage] = useState<ImageData | null>(null);
    const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleModelImageUpload = (dataUrl: string, mimeType: string) => {
        setModelImage({ dataUrl, mimeType });
        setGeneratedImages(null);
        setSelectedImage(null);
        setError(null);
    };
    
    const handleGenerate = async (mode: PoseStudioMode, options: PoseStudioOptions) => {
        if (!modelImage) {
            setError(t('poseStudio.errors.noModelImage'));
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImages(null);
        setSelectedImage(null);

        try {
            const result = await generateStudioPoses(modelImage, mode, options);
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
            link.download = `studio-pose-${Date.now()}.png`;
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
          title={t('poseStudio.page.title')}
          description={t('poseStudio.page.description')}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700/50 space-y-8">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-lg">1</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('poseStudio.sections.uploadModel.title').substring(3)}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('poseStudio.sections.uploadModel.subtitle')}</p>
                        </div>
                    </div>
                     <ImageUploader
                        onImageUpload={handleModelImageUpload}
                        uploadedImage={modelImage?.dataUrl || null}
                        label="Model with Product"
                        labelKey="uploader.modelLabel"
                    />
                </div>

                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-lg">2</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('poseStudio.sections.chooseStyle.title').substring(3)}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('poseStudio.sections.chooseStyle.subtitle')}</p>
                        </div>
                    </div>
                    <PoseStyleOptions
                        onGenerate={handleGenerate}
                        isLoading={isLoading}
                        isModelImageUploaded={!!modelImage}
                    />
                </div>
            </div>

            {/* Right Column */}
            <ResultDisplay
                originalImage={modelImage?.dataUrl || null}
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
};
