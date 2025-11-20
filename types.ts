
// Fix: Removed import of MimeType as it is not an exported member of '@google/genai'.
// Mime types are represented as strings.

export enum EnhanceMethod {
  SMART = 'Smart',
  CUSTOMIZE = 'Customize',
  REFERENCE = 'Reference',
}

export interface CustomizationOptions {
  theme: string;
  customTheme: string;
  props: string;
  instructions: string;
}

export interface ImageData {
  dataUrl: string;
  // Fix: The mimeType property should be a string.
  mimeType: string;
}

export interface ModelGenerationOptions {
  gender: string;
  ethnicity: string;
  customEthnicity?: string;
  details: string;
}

export interface AdCopyOptions {
  headline: string;
  description: string;
  cta: string;
  instructions: string;
}

export interface AdCopySuggestions {
  headlines: string[];
  descriptions: string[];
  ctas: string[];
}

export enum PoseStudioMode {
  SMART = 'Smart',
  CUSTOMIZE = 'Customize',
}

export interface PoseStudioOptions {
  theme: string;
  customTheme: string;
  angle: string;
  framing: string;
  depthOfField: string;
  lighting: string;
  instructions: string;
}

export enum ImageEditorMode {
  RESIZE = 'Resize',
  MAGIC_BRUSH = 'Magic Brush',
}

// Types for Product Carousel
export interface CarouselOptions {
  productName: string;
  benefits: string;
  audience: string;
  platform: 'Instagram' | 'Facebook' | 'TikTok' | 'WhatsApp';
  language: 'English' | 'Indonesian';
  aspectRatio: '1:1' | '4:5' | '9:16';
  addLogo: boolean;
}

export interface CarouselSlide {
  index: number;
  visual_concept: string;
  headline_in_image: string;
  supporting_text_in_image: string;
  image_prompt: string;
  generated_image_url: string;
}

// Types for Sketch Design Studio
export enum SketchDesignCategory {
  FASHION = 'Fashion Design',
  LOGO = 'Logo & Branding',
  FURNITURE = 'Furniture Design',
  INTERIOR = 'Interior Design',
  ARCHITECTURE = 'Architecture',
  ART = 'Digital Art',
}

export enum SketchDesignMode {
  SMART = 'Smart',
  CUSTOMIZE = 'Customize',
  REFERENCE = 'Reference',
}

export interface SketchDesignOptions {
  category: SketchDesignCategory;
  mode: SketchDesignMode;
  prompt?: string;
  fashionPattern?: string;
  fashionPlacement?: string;
  referenceImage?: ImageData;
}
