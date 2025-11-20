import React from 'react';

interface FeatureHeaderProps {
  title: string;
  description: string;
}

export const FeatureHeader: React.FC<FeatureHeaderProps> = ({ title, description }) => {
  return (
    <div className="mb-8 bg-white/80 dark:bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700/50">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
};
