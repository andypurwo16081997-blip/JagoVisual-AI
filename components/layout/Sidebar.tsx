
import React from 'react';
import type { View } from '../../App';
import { PhotoStudioIcon } from '../icons/PhotoStudioIcon';
import { TryOnIcon } from '../icons/TryOnIcon';
import { AdCreatorIcon } from '../icons/AdCreatorIcon';
import { useLanguage } from '../../contexts/LanguageContext';
import { StudioPoseIcon as PoseStudioIcon } from '../icons/StudioPoseIcon';
import { EditorIcon } from '../icons/EditorIcon';
import { MotionPromptIcon } from '../icons/MotionPromptIcon';
import { MergeProductIcon } from '../icons/MergeProductIcon';
import { LifestylePhotoshootIcon } from '../icons/LifestylePhotoshootIcon';
import { VideoIcon } from '../icons/VideoIcon';
import { DigitalImagingIcon } from '../icons/DigitalImagingIcon';
import { CarouselIcon } from '../icons/CarouselIcon';
import { BackgroundIcon } from '../icons/BackgroundIcon';
import { FaceSwapIcon } from '../icons/FaceSwapIcon';
import { SketchIcon } from '../icons/SketchIcon';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isDisabled?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick, isDisabled }) => {
  const baseClasses = "flex items-center w-full px-4 py-3 text-sm font-medium transition-colors duration-150 rounded-lg";
  const activeClasses = "bg-primary-600 text-white shadow";
  const inactiveClasses = "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700";
  const disabledClasses = "opacity-50 cursor-not-allowed";

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${isDisabled ? disabledClasses : ''}`}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </button>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isMobileOpen, onMobileClose }) => {
    const { t } = useLanguage();
    
    const navItems = [
        { id: 'productStudio', label: t('sidebar.productStudio'), icon: <PhotoStudioIcon /> },
        { id: 'backgroundStudio', label: t('sidebar.backgroundStudio'), icon: <BackgroundIcon /> },
        { id: 'sketchDesignStudio', label: t('sidebar.sketchDesignStudio'), icon: <SketchIcon /> },
        { id: 'virtualTryOn', label: t('sidebar.virtualTryOn'), icon: <TryOnIcon /> },
        { id: 'lifestylePhotoshoot', label: t('sidebar.lifestylePhotoshoot'), icon: <LifestylePhotoshootIcon /> },
        { id: 'mergeProduct', label: t('sidebar.mergeProduct'), icon: <MergeProductIcon /> },
        { id: 'poseStudio', label: t('sidebar.poseStudio'), icon: <PoseStudioIcon /> },
        { id: 'faceSwapStudio', label: t('sidebar.faceSwapStudio'), icon: <FaceSwapIcon /> },
        { id: 'productCarousel', label: t('sidebar.productCarousel'), icon: <CarouselIcon /> },
        { id: 'adCreator', label: t('sidebar.adCreator'), icon: <AdCreatorIcon /> },
        { id: 'imageEditor', label: t('sidebar.imageEditor'), icon: <EditorIcon /> },
        { id: 'digitalImaging', label: t('sidebar.digitalImaging'), icon: <DigitalImagingIcon /> },
        { id: 'motionPromptStudio', label: t('sidebar.motionPromptStudio'), icon: <MotionPromptIcon /> },
        { id: 'videoStudio', label: t('sidebar.videoStudio'), icon: <VideoIcon /> },
    ];

    const handleNavItemClick = (view: View) => {
        setActiveView(view);
        onMobileClose();
    };

    return (
        <aside className={`fixed top-16 bottom-0 left-0 z-40 flex flex-col w-64 flex-shrink-0 bg-white/80 dark:bg-gray-800/60 backdrop-blur-lg p-4 border-r border-gray-200 dark:border-gray-700/50 transform transition-transform duration-300 ease-in-out md:sticky md:top-16 md:z-auto md:h-[calc(100vh-4rem)] md:overflow-y-auto md:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <nav>
                <ul className="space-y-2">
                    {navItems.map(item => (
                        <li key={item.id}>
                            <NavItem
                                icon={item.icon}
                                label={item.label}
                                isActive={activeView === item.id}
                                onClick={() => handleNavItemClick(item.id as View)}
                            />
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}
