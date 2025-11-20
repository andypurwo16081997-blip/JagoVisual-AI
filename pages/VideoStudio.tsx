import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FeatureHeader } from '../components/FeatureHeader';
import { ImageUploader } from '../components/ImageUploader';
import { Spinner } from '../components/Spinner';
import { generateVideo, suggestMotionPrompt } from '../services/geminiService';
import type { ImageData } from '../types';
import { DownloadIcon } from '../components/icons/DownloadIcon';
import { SparklesIcon } from '../components/icons/SparklesIcon';
import { InfoIcon } from '../components/icons/InfoIcon';

export const VideoStudio: React.FC = () => {
  const { t } = useLanguage();
  const [image, setImage] = useState<ImageData | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMagicPromptLoading, setIsMagicPromptLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    let interval: number;
    if (isLoading) {
      try {
        const messages = JSON.parse(t('videoStudio.loading.messages'));
        let messageIndex = 0;
        setLoadingMessage(messages[messageIndex]);
        interval = window.setInterval(() => {
          messageIndex = (messageIndex + 1) % messages.length;
          setLoadingMessage(messages[messageIndex]);
        }, 5000);
      } catch(e) {
        console.error("Failed to parse loading messages:", e);
        setLoadingMessage(t('videoStudio.loading.title'));
      }
    }
    return () => clearInterval(interval);
  }, [isLoading, t]);

  const handleImageUpload = (dataUrl: string, mimeType: string) => {
    setImage({ dataUrl, mimeType });
    setVideoUrl(null);
    setError(null);
  };

  const handleMagicPrompt = async () => {
    if (!image) return;
  
    setIsMagicPromptLoading(true);
    setError(null);
    try {
      const suggestedPrompt = await suggestMotionPrompt(image);
      setPrompt(suggestedPrompt);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Failed to generate a magic prompt.");
    } finally {
      setIsMagicPromptLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!image) {
      setError(t('videoStudio.errors.noImage'));
      return;
    }
    if (!prompt.trim()) {
      setError(t('videoStudio.errors.noPrompt'));
      return;
    }

    setIsLoading(true);
    setError(null);
    setVideoUrl(null);

    try {
      const downloadLink = await generateVideo(prompt, image);
      if (downloadLink) {
        // Fetching video with API key is required by the Veo API.
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch video: ${response.statusText}. Details: ${errorText}`);
        }
        const videoBlob = await response.blob();
        const objectUrl = URL.createObjectURL(videoBlob);
        setVideoUrl(objectUrl);
      } else {
        throw new Error("Video generation failed to return a valid link.");
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
    setPrompt('');
    setIsLoading(false);
    setError(null);
    if(videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoUrl(null);
  };
  
  const handleDownload = () => {
    if (videoUrl) {
        const link = document.createElement('a');
        link.href = videoUrl;
        link.download = `generated-video-${Date.now()}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  const isGenerateDisabled = isLoading || !prompt.trim() || !image;

  const renderResultContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center h-full">
          <Spinner className="h-12 w-12 text-primary-600" />
          <h3 className="mt-4 text-xl font-bold">{t('videoStudio.loading.title')}</h3>
          <p className="text-gray-500 dark:text-gray-400">{loadingMessage}</p>
          <div className="mt-4 inline-flex items-center text-left justify-center gap-2 text-xs text-yellow-800 dark:text-yellow-300 p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
            <InfoIcon className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">{t('notes.navigationWarning')}</span>
          </div>
        </div>
      );
    }

    if (error) {
       return (
        <div className="flex flex-col items-center justify-center text-center h-full text-red-500">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h3 className="text-xl font-bold">{t('results.error.title')}</h3>
          <p className="text-sm mb-4">{error}</p>
          <button onClick={handleReset} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
            {t('results.error.button')}
          </button>
        </div>
      );
    }

    if (videoUrl) {
      return (
          <video src={videoUrl} controls autoPlay loop className="w-full h-full object-contain rounded-lg" />
      );
    }

    return (
      <div className="flex items-center justify-center text-center h-full text-gray-400 dark:text-gray-500">
        <p>{t('videoStudio.results.placeholder')}</p>
      </div>
    );
  };

  return (
    <div>
      <FeatureHeader
        title={t('sidebar.videoStudio')}
        description={t('videoStudio.page.description')}
      />
      <div className="mb-8 p-4 bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 dark:border-yellow-400 text-yellow-800 dark:text-yellow-300 rounded-r-lg flex items-start gap-3">
        <div className="flex-shrink-0 pt-0.5">
          <InfoIcon className="w-5 h-5" />
        </div>
        <p className="text-sm">
          {t('videoStudio.quotaWarning')}
        </p>
      </div>
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
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('videoStudio.sections.upload.title').substring(3)}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('videoStudio.sections.upload.subtitle')}</p>
              </div>
            </div>
            <ImageUploader 
              onImageUpload={handleImageUpload}
              uploadedImage={image?.dataUrl || null}
              label="Upload Image to Animate"
              labelKey="uploader.imageLabel"
            />
          </div>
          
          {/* Step 2: Prompt */}
          <div className="flex flex-col flex-grow">
            <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('videoStudio.sections.prompt.title').substring(3)}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('videoStudio.sections.prompt.subtitle')}</p>
                </div>
            </div>
            <div className="flex justify-between items-center mb-1">
                <label htmlFor="motion-prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('videoStudio.form.prompt.label')}</label>
                <button
                    onClick={handleMagicPrompt}
                    disabled={!image || isMagicPromptLoading || isLoading}
                    className="flex items-center gap-2 px-3 py-1 text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/50 rounded-full hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isMagicPromptLoading ? (
                    <>
                        <Spinner className="w-4 h-4" />
                        {t('videoStudio.form.magicPrompt.loading')}
                    </>
                    ) : (
                    <>
                        <SparklesIcon className="w-4 h-4" />
                        {t('videoStudio.form.magicPrompt.label')}
                    </>
                    )}
                </button>
            </div>
            <textarea
              id="motion-prompt"
              rows={5}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t('videoStudio.form.prompt.placeholder')}
              className="block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
            <div className="flex-grow flex flex-col justify-end mt-6">
              <button
                onClick={handleGenerate}
                disabled={isGenerateDisabled}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600 transition-colors"
              >
                {isLoading ? <Spinner className="h-6 w-6 text-white" /> : t('videoStudio.generateButton')}
              </button>
              {error && !isLoading && (
                <p className="text-center text-sm text-red-500 mt-2">{error}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Right Column: Result */}
        <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700/50 flex flex-col space-y-4 h-full">
            <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-lg">3</span>
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('videoStudio.results.title').substring(3)}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('videoStudio.results.description')}</p>
                </div>
            </div>
            <div className="flex-grow aspect-video w-full bg-gray-100 dark:bg-gray-900/50 rounded-lg p-2">
                {renderResultContent()}
            </div>
            {videoUrl && !isLoading && !error && (
            <div className="flex flex-col gap-4">
                <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    <DownloadIcon className="w-6 h-6" />
                    {t('videoStudio.results.downloadButton')}
                </button>
                <button
                    onClick={handleReset}
                    className="w-full text-center text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500 hover:underline"
                >
                    {t('results.resetButton')}
                </button>
                <div className="text-center pt-2 border-t border-gray-200 dark:border-gray-700/50">
                    <div className="inline-flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <InfoIcon className="w-4 h-4 flex-shrink-0" />
                        <span>{t('notes.staticWarning')}</span>
                    </div>
                </div>
            </div>
            )}
        </div>

      </div>
    </div>
  );
};