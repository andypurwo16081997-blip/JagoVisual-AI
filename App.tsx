
import React, { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { Layout } from './components/layout/Layout';
import { ProductStudio } from './pages/ProductStudio';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { VirtualTryOn } from './pages/VirtualTryOn';
import { AdCreator } from './pages/AdCreator';
import { StudioPose as PoseStudio } from './pages/StudioPose';
import { ImageEditor } from './pages/ImageEditor';
import { MotionPromptStudio } from './pages/MotionPromptStudio';
import { MergeProduct } from './pages/MergeProduct';
import { LifestylePhotoshoot } from './pages/LifestylePhotoshoot';
import { VideoStudio } from './pages/VideoStudio';
import { DigitalImaging } from './pages/DigitalImaging';
import { ProductCarousel } from './pages/ProductCarousel';
import { BackgroundStudio } from './pages/BackgroundStudio';
import { FaceSwapStudio } from './pages/FaceSwapStudio';
import { SketchDesignStudio } from './pages/SketchDesignStudio';

export type View = 'productStudio' | 'virtualTryOn' | 'lifestylePhotoshoot' | 'mergeProduct' | 'digitalImaging' | 'productCarousel' | 'adCreator' | 'poseStudio' | 'imageEditor' | 'motionPromptStudio' | 'videoStudio' | 'backgroundStudio' | 'faceSwapStudio' | 'sketchDesignStudio';

function AppContent() {
  const [activeView, setActiveView] = useState<View>('productStudio');

  const renderActiveView = () => {
    switch (activeView) {
      case 'productStudio':
        return <ProductStudio />;
      case 'virtualTryOn':
        return <VirtualTryOn />;
      case 'lifestylePhotoshoot':
        return <LifestylePhotoshoot />;
      case 'mergeProduct':
        return <MergeProduct />;
      case 'digitalImaging':
        return <DigitalImaging />;
      case 'productCarousel':
        return <ProductCarousel />;
      case 'adCreator':
        return <AdCreator />;
      case 'poseStudio':
        return <PoseStudio />;
      case 'imageEditor':
        return <ImageEditor />;
      case 'motionPromptStudio':
        return <MotionPromptStudio />;
      case 'videoStudio':
        return <VideoStudio />;
      case 'backgroundStudio':
        return <BackgroundStudio />;
      case 'faceSwapStudio':
        return <FaceSwapStudio />;
      case 'sketchDesignStudio':
        return <SketchDesignStudio />;
      default:
        return <ProductStudio />;
    }
  };

  return (
    <Layout activeView={activeView} setActiveView={setActiveView}>
      {renderActiveView()}
    </Layout>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
