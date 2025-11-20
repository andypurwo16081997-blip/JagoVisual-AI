import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../contexts/LanguageContext';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { MenuIcon } from './icons/MenuIcon';

interface HeaderProps {
  onAboutClick: () => void;
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAboutClick, onMenuClick }) => {
  const [theme, toggleTheme] = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'id' : 'en');
  };

  return (
    <header className="sticky top-0 z-20 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
             <button
              onClick={onMenuClick}
              className="md:hidden p-2 -ml-2 mr-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900 focus:ring-primary-500 transition-colors"
              aria-label="Open menu"
            >
              <MenuIcon />
            </button>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                JagoVisual <span className="text-primary-600 dark:text-primary-500 hidden sm:inline">AI</span>
                <span className="ml-2 inline-block align-baseline bg-primary-600 text-white text-xs font-bold px-2 py-0.5 rounded-md tracking-wider uppercase">
                  PRO
                </span>
              </span>
              <span className="text-gray-500 dark:text-gray-400 hidden sm:block">| {t('header.subtitle')}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={onAboutClick}
              className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {t('header.about')}
            </button>
            <button
              onClick={toggleLanguage}
              className="px-3 py-2 text-sm font-bold w-12 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle language"
            >
              {language.toUpperCase()}
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900 focus:ring-primary-500 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};