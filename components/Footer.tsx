import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { InstagramIcon } from './icons/InstagramIcon';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} JagoVisual AI PRO | {t('header.subtitle')}. {t('footer.createdBy')}{' '}
          <a href="https://www.instagram.com/jagoskilldigital" target="_blank" rel="noopener noreferrer" className="font-medium text-primary-600 dark:text-primary-500 hover:underline">
            @jagoskilldigital
          </a>
          .
        </div>
        <div className="flex space-x-6 mt-4 sm:mt-0">
          <a href="https://www.instagram.com/jagoskilldigital" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <span className="sr-only">Instagram</span>
            <InstagramIcon />
          </a>
        </div>
      </div>
    </footer>
  );
};