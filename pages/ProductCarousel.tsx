import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FeatureHeader } from '../components/FeatureHeader';
import { ImageUploader } from '../components/ImageUploader';
import { Spinner } from '../components/Spinner';
import { PlusIcon } from '../components/icons/PlusIcon';
import { TrashIcon } from '../components/icons/TrashIcon';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../components/icons/ChevronRightIcon';
import { DownloadIcon } from '../components/icons/DownloadIcon';
import { CopyIcon } from '../components/icons/CopyIcon';
import { CheckIcon } from '../components/icons/CheckIcon';
import { generateProductCarousel, regenerateCarouselSlideImage } from '../services/geminiService';
import type { ImageData, CarouselOptions, CarouselSlide } from '../types';
import { SparklesIcon } from '../components/icons/SparklesIcon';
import { InfoIcon } from '../components/icons/InfoIcon';

const CarouselResultDisplay: React.FC<{ 
    slides: CarouselSlide[], 
    caption: string, 
    productName: string,
    aspectRatio: CarouselOptions['aspectRatio'],
    onDownloadAll: () => void,
    onSlideTextChange: (index: number, field: keyof CarouselSlide, value: string) => void,
    onRegenerateSlide: (index: number) => void,
    regeneratingSlideIndex: number | null,
}> = ({ slides, caption, productName, aspectRatio, onDownloadAll, onSlideTextChange, onRegenerateSlide, regeneratingSlideIndex }) => {
    const { t } = useLanguage();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scrollPosRef = useRef<number>(0);
    const [activeSlide, setActiveSlide] = useState(0);
    const [captionCopied, setCaptionCopied] = useState(false);
    
    const aspectRatioClasses = {
        '1:1': 'aspect-square',
        '4:5': 'aspect-[4/5]',
        '9:16': 'aspect-[9/16]',
    };

    const handleTextChange = (index: number, field: keyof CarouselSlide, value: string) => {
        // Preserve scroll position before triggering the state update in the parent
        if (scrollContainerRef.current) {
            scrollPosRef.current = scrollContainerRef.current.scrollLeft;
        }
        onSlideTextChange(index, field, value);
    };

    useLayoutEffect(() => {
        // Restore scroll position after every render
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = scrollPosRef.current;
        }
    });


    const handleScroll = () => {
        const container = scrollContainerRef.current;
        if (container) {
            const firstSlide = container.firstChild as HTMLElement;
            if (!firstSlide) return;

            const slideWidth = firstSlide.offsetWidth;
            const style = window.getComputedStyle(container);
            const gap = parseInt(style.getPropertyValue('gap')) || 16;
            
            const newActiveSlide = Math.round(container.scrollLeft / (slideWidth + gap));
            
            if (newActiveSlide !== activeSlide) {
                setActiveSlide(newActiveSlide);
            }
        }
    };
    
    const scrollToSlide = (index: number) => {
        const container = scrollContainerRef.current;
        if (container) {
            const firstSlide = container.firstChild as HTMLElement;
            if (!firstSlide) return;

            const slideWidth = firstSlide.offsetWidth;
            const style = window.getComputedStyle(container);
            const gap = parseInt(style.getPropertyValue('gap')) || 16;
            
            container.scrollTo({ left: (slideWidth + gap) * index, behavior: 'smooth' });
        }
    };
    
    useEffect(() => {
        const handleResize = () => handleScroll();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const handleDownload = (slide: CarouselSlide) => {
        if (slide.generated_image_url) {
            const link = document.createElement('a');
            link.href = slide.generated_image_url;
            link.download = `${productName.replace(/\s+/g, '_')}_slide_${slide.index}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleCopyCaption = () => {
        navigator.clipboard.writeText(caption);
        setCaptionCopied(true);
        setTimeout(() => setCaptionCopied(false), 2000);
    };

    const SlideCard: React.FC<{ slide: CarouselSlide, slideIndex: number }> = ({ slide, slideIndex }) => {
        const isRegenerating = regeneratingSlideIndex === slideIndex;

        return (
            <div className="flex-shrink-0 w-full snap-center">
                <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-full">
                    <div className={`relative ${aspectRatioClasses[aspectRatio]} w-full bg-gray-100 dark:bg-gray-900/50 rounded-lg overflow-hidden`}>
                        {isRegenerating ? (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                                <Spinner />
                                <span className="mt-2 text-sm font-semibold">{t('productCarousel.regenerating')}</span>
                            </div>
                        ) : (
                           slide.generated_image_url ? (
                            <img src={slide.generated_image_url} alt={`${t('productCarousel.slide')} ${slide.index}`} className="w-full h-full object-contain" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500"><Spinner /></div>
                           )
                        )}
                    </div>

                    {/* Editable Text Fields */}
                     <div className="space-y-2">
                        <input
                            type="text"
                            value={slide.headline_in_image}
                            onChange={(e) => handleTextChange(slideIndex, 'headline_in_image', e.target.value)}
                            className="w-full text-sm font-semibold border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-1.5 px-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            aria-label={`Headline for slide ${slide.index}`}
                        />
                        <textarea
                            value={slide.supporting_text_in_image}
                             onChange={(e) => handleTextChange(slideIndex, 'supporting_text_in_image', e.target.value)}
                            rows={2}
                            className="w-full text-xs border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-1.5 px-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            aria-label={`Supporting text for slide ${slide.index}`}
                        />
                    </div>
                     <div className="flex gap-2">
                        <button
                            onClick={() => onRegenerateSlide(slideIndex)}
                            disabled={isRegenerating}
                            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-sm font-semibold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/50 rounded-md hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <SparklesIcon className="w-4 h-4" />
                            {t('productCarousel.regenerate_slide')}
                        </button>
                        <button
                            onClick={() => handleDownload(slide)}
                            disabled={!slide.generated_image_url || isRegenerating}
                            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-primary-500 disabled:bg-gray-400 dark:disabled:bg-gray-600"
                        >
                            <DownloadIcon className="w-4 h-4" />
                            {t('productCarousel.download_slide')}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div>
                 <div className="relative">
                    <div
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-2"
                    >
                        {slides.map((slide, index) => <SlideCard key={slide.index} slide={slide} slideIndex={index} />)}
                    </div>
                    <button
                        onClick={() => scrollToSlide(activeSlide - 1)}
                        disabled={activeSlide === 0}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-0 transition-opacity z-10"
                        aria-label="Previous slide"
                    >
                        <ChevronLeftIcon />
                    </button>
                    <button
                        onClick={() => scrollToSlide(activeSlide + 1)}
                        disabled={activeSlide >= slides.length - 1}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-0 transition-opacity z-10"
                        aria-label="Next slide"
                    >
                        <ChevronRightIcon />
                    </button>
                </div>
                 <div className="flex justify-center gap-2 mt-4">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollToSlide(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-colors ${activeSlide === index ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'}`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
             <div className="text-center">
                <div className="inline-flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 p-2 bg-gray-100 dark:bg-gray-900/50 rounded-lg">
                    <InfoIcon className="w-4 h-4 flex-shrink-0" />
                    <span>{t('productCarousel.edit_tooltip')}</span>
                </div>
            </div>

            <button
                onClick={onDownloadAll}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-primary-600 rounded-md shadow-sm text-base font-bold text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
                <DownloadIcon className="w-5 h-5" />
                {t('productCarousel.download_all_slides')}
            </button>
            
            <div className="border-t border-gray-200 dark:border-gray-700/50 pt-6">
                 <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">{t('productCarousel.carousel_caption')}</h3>
                 <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{caption}</p>
                    <button
                        onClick={handleCopyCaption}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/50 rounded-md hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-colors"
                    >
                        {captionCopied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                        {captionCopied ? t('productCarousel.copied') : t('productCarousel.copy_caption')}
                    </button>
                 </div>
            </div>
        </div>
    );
};


export const ProductCarousel: React.FC = () => {
    const { t } = useLanguage();
    // Input state
    const [productImages, setProductImages] = useState<(ImageData | null)[]>([null]);
    const [logoImage, setLogoImage] = useState<ImageData | null>(null);
    const [options, setOptions] = useState<CarouselOptions>({
        productName: '',
        benefits: '',
        audience: '',
        platform: 'Instagram',
        language: 'English',
        aspectRatio: '1:1',
        addLogo: false,
    });
    const [slideCount, setSlideCount] = useState(4);

    // Result state
    const [editableSlides, setEditableSlides] = useState<CarouselSlide[] | null>(null);
    const [carouselCaption, setCarouselCaption] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [regeneratingSlideIndex, setRegeneratingSlideIndex] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAddProductSlot = () => {
        if (productImages.length < 5) {
            setProductImages(prev => [...prev, null]);
        }
    };
    const handleProductImageUpload = (dataUrl: string, mimeType: string, index: number) => {
        setProductImages(prev => {
            const newImages = [...prev];
            newImages[index] = { dataUrl, mimeType };
            return newImages;
        });
        setEditableSlides(null);
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

    const handleLogoUpload = (dataUrl: string, mimeType: string) => {
        setLogoImage({ dataUrl, mimeType });
    };
    
    const handleOptionsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setOptions(prev => ({...prev, [name]: value}));
    };

    const handleAddLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = e.target;
        setOptions(prev => ({ ...prev, addLogo: checked }));
        if (!checked) {
            setLogoImage(null); // Clear logo if checkbox is unchecked
        }
    };

    const handleGenerate = async () => {
        const validProductImages = productImages.filter(p => p !== null) as ImageData[];
        if (validProductImages.length === 0) {
            setError(t('productCarousel.errors.no_product_image'));
            return;
        }
        if (!options.productName.trim()) {
            setError(t('productCarousel.errors.no_product_name'));
            return;
        }

        setIsLoading(true);
        setError(null);
        setEditableSlides(null);
        
        try {
            const result = await generateProductCarousel(validProductImages, options, slideCount, logoImage);
            setEditableSlides(result.slides);
            setCarouselCaption(result.carousel_caption);
        } catch (e: any) {
            console.error(e);
            setError(e.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSlideTextChange = (index: number, field: keyof CarouselSlide, value: string) => {
        setEditableSlides(prev => {
            if (!prev) return null;
            const newSlides = [...prev];
            const slideToUpdate = { ...newSlides[index], [field]: value };
            newSlides[index] = slideToUpdate;
            return newSlides;
        });
    };
    
    const handleRegenerateSlide = async (index: number) => {
        const validProductImages = productImages.filter(p => p !== null) as ImageData[];
        if (!editableSlides || !editableSlides[index]) return;
    
        setRegeneratingSlideIndex(index);
        setError(null);
    
        try {
            const slideToRegenerate = editableSlides[index];
            const newImageUrl = await regenerateCarouselSlideImage(validProductImages, options, slideToRegenerate, logoImage);
            
            setEditableSlides(prev => {
                if (!prev) return null;
                const newSlides = [...prev];
                newSlides[index] = { ...newSlides[index], generated_image_url: newImageUrl };
                return newSlides;
            });
    
        } catch (e: any) {
            console.error(e);
            setError(e.message || "An unexpected error occurred while regenerating the slide.");
        } finally {
            setRegeneratingSlideIndex(null);
        }
    };
    
    const handleReset = () => {
        setProductImages([null]);
        setLogoImage(null);
        setOptions({
            productName: '',
            benefits: '',
            audience: '',
            platform: 'Instagram',
            language: 'English',
            aspectRatio: '1:1',
            addLogo: false,
        });
        setSlideCount(4);
        setEditableSlides(null);
        setCarouselCaption("");
        setIsLoading(false);
        setError(null);
    };

    const handleDownloadAll = () => {
        editableSlides?.forEach(slide => {
            if (slide.generated_image_url) {
                const link = document.createElement('a');
                link.href = slide.generated_image_url;
                link.download = `${options.productName.replace(/\s+/g, '_') || 'product'}_slide_${slide.index}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        });
    };

    const isGenerateDisabled = isLoading || productImages.filter(p => p).length === 0 || !options.productName.trim();

    const renderResultContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center text-center h-full">
                    <Spinner className="h-12 w-12 text-primary-600" />
                    <h3 className="mt-4 text-xl font-bold">{t('productCarousel.loading')}</h3>
                </div>
            );
        }
        if (error) {
            return (
                <div className="flex flex-col items-center justify-center text-center h-full text-red-500">
                    <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <h3 className="text-xl font-bold">{t('results.error.title')}</h3>
                    <p className="text-sm mb-4">{error}</p>
                    <button onClick={handleReset} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">{t('results.error.button')}</button>
                </div>
            );
        }
        if (editableSlides) {
            return <CarouselResultDisplay 
                slides={editableSlides} 
                caption={carouselCaption} 
                productName={options.productName} 
                aspectRatio={options.aspectRatio}
                onDownloadAll={handleDownloadAll}
                onSlideTextChange={handleSlideTextChange}
                onRegenerateSlide={handleRegenerateSlide}
                regeneratingSlideIndex={regeneratingSlideIndex}
            />;
        }
        return (
            <div className="flex items-center justify-center text-center h-full text-gray-400 dark:text-gray-500">
                <p>{t('productCarousel.results_placeholder')}</p>
            </div>
        );
    };

    return (
        <div>
            <FeatureHeader
                title={t('productCarousel.page.title')}
                description={t('productCarousel.page.description')}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Inputs */}
                <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700/50 flex flex-col space-y-8">
                    {/* Step 1: Upload */}
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-md">
                                <span className="text-white font-bold text-lg">1</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('productCarousel.sections.upload.title').substring(3)}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('productCarousel.sections.upload.subtitle')}</p>
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
                                        <button onClick={() => handleRemoveProductSlot(index)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Remove product">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            {productImages.length < 5 && (
                                <button onClick={handleAddProductSlot} className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-primary-500 hover:text-primary-500 transition-colors">
                                    <PlusIcon className="w-8 h-8 mb-2" />
                                    <span className="text-sm font-semibold">{t('productCarousel.sections.upload.addProduct')}</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Step 2: Details */}
                    <div className="flex-grow flex flex-col">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-md">
                                <span className="text-white font-bold text-lg">2</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('productCarousel.sections.details.title').substring(3)}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('productCarousel.sections.details.subtitle')}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="productName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('productCarousel.form.productName.label')}</label>
                                <input type="text" name="productName" id="productName" value={options.productName} onChange={handleOptionsChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder={t('productCarousel.form.productName.placeholder')} />
                            </div>
                             <div>
                                <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('productCarousel.form.benefits.label')}</label>
                                <textarea name="benefits" id="benefits" rows={2} value={options.benefits} onChange={handleOptionsChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder={t('productCarousel.form.benefits.placeholder')} />
                            </div>
                             <div>
                                <label htmlFor="audience" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('productCarousel.form.audience.label')}</label>
                                <input type="text" name="audience" id="audience" value={options.audience} onChange={handleOptionsChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder={t('productCarousel.form.audience.placeholder')} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('productCarousel.form.language.label')}</label>
                                    <select name="language" id="language" value={options.language} onChange={handleOptionsChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                                        <option value="English">{t('languages.english')}</option>
                                        <option value="Indonesian">{t('languages.indonesian')}</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="platform" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('productCarousel.form.platform.label')}</label>
                                    <select name="platform" id="platform" value={options.platform} onChange={handleOptionsChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                                        <option>Instagram</option>
                                        <option>Facebook</option>
                                        <option>TikTok</option>
                                        <option>WhatsApp</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="aspectRatio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('productCarousel.form.aspectRatio.label')}</label>
                                    <select name="aspectRatio" id="aspectRatio" value={options.aspectRatio} onChange={handleOptionsChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                                        <option value="1:1">1:1 (Square)</option>
                                        <option value="4:5">4:5 (Portrait)</option>
                                        <option value="9:16">9:16 (Story)</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="slideCount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('productCarousel.form.slideCount.label')}: {slideCount}</label>
                                    <input type="range" id="slideCount" min="3" max="8" value={slideCount} onChange={(e) => setSlideCount(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 mt-2" />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                    <label htmlFor="addLogo" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('productCarousel.form.addLogo.label')}</label>
                                    <input
                                        id="addLogo"
                                        name="addLogo"
                                        type="checkbox"
                                        checked={options.addLogo}
                                        onChange={handleAddLogoChange}
                                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    />
                                </div>
                                {options.addLogo && (
                                    <div className="mt-4">
                                        <ImageUploader 
                                            onImageUpload={handleLogoUpload}
                                            uploadedImage={logoImage?.dataUrl || null}
                                            label="Upload Logo"
                                            labelKey="uploader.logoLabel"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                         <div className="flex-grow flex flex-col justify-end mt-6">
                            <button onClick={handleGenerate} disabled={isGenerateDisabled} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600 transition-colors">
                                {isLoading ? <Spinner className="h-6 w-6 text-white" /> : t('productCarousel.generateButton')}
                            </button>
                            {error && !isLoading && <p className="text-center text-sm text-red-500 mt-2">{error}</p>}
                        </div>
                    </div>
                </div>

                {/* Right Column: Results */}
                <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700/50 flex flex-col space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-lg">3</span>
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('productCarousel.sections.results.title').substring(3)}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('productCarousel.sections.results.description')}</p>
                      </div>
                    </div>
                    <div className="flex-grow">
                        {renderResultContent()}
                    </div>
                     {editableSlides && !isLoading && !error && (
                        <div className="flex flex-col gap-4 pt-4 border-t border-gray-200 dark:border-gray-700/50">
                            <button
                                onClick={handleReset}
                                className="w-full text-center text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500 hover:underline"
                            >
                                {t('results.resetButton')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};