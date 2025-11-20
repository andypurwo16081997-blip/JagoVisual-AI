
// Fix: Updated import path to @google/genai
import { GoogleGenAI, Modality, Type, Part, GenerateContentResponse } from '@google/genai';
import { EnhanceMethod, PoseStudioMode, SketchDesignCategory, SketchDesignOptions, SketchDesignMode } from '../types';
import type { CustomizationOptions, ImageData, AdCopyOptions, AdCopySuggestions, PoseStudioOptions, ModelGenerationOptions, CarouselOptions, CarouselSlide } from '../types';
import { translations, getTranslation } from '../translations';


if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

// Fix: Updated GoogleGenAI initialization to use a named parameter.
const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

function dataUrlToGeminiPart(imageData: ImageData): Part {
  return {
    inlineData: {
      mimeType: imageData.mimeType,
      data: imageData.dataUrl.split(',')[1]
    }
  };
}

async function processImageGenerationResponse(results: GenerateContentResponse[]): Promise<{ imageUrls:string[]; text: string | null }> {
    const imageUrls: string[] = [];
    let text: string | null = null;

    for (const result of results) {
        const response = result;
        if(response.candidates && response.candidates.length > 0) {
            const textPart = response.candidates[0].content.parts.find(p => 'text' in p);
            if (!text && textPart) {
                text = textPart.text;
            }
            const imagePart = response.candidates[0].content.parts.find(p => 'inlineData' in p);
            if (imagePart && imagePart.inlineData) {
                imageUrls.push(`data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`);
            }
        }
    }
    return { imageUrls, text };
}


function generatePrompt(method: EnhanceMethod, options: CustomizationOptions): string {
  const basePrompt = "You are a world-class product photographer AI. Your task is to take a user-submitted product image and transform it into a professional, studio-quality photograph. The final image should be hyper-realistic and visually stunning.";
  
  switch (method) {
    case EnhanceMethod.SMART:
      return `${basePrompt} Analyze the product and create the most compelling and commercially appealing scene for it. Consider ideal lighting, background, and subtle props that enhance the product's value. Generate a creative and beautiful concept automatically.`;
    case EnhanceMethod.CUSTOMIZE:
      // Use the English translation for the theme key to ensure the prompt is in English.
      const themeName = options.customTheme || (translations.themes as any)[options.theme]?.en || options.theme;
      let prompt = `${basePrompt} Re-create the scene with a "${themeName}" theme.`;
      if (options.props) {
        prompt += ` Incorporate the following props or elements naturally into the scene: ${options.props}.`;
      }
      if (options.instructions) {
        prompt += ` Follow these additional instructions carefully: ${options.instructions}.`;
      }
      prompt += ` The lighting, composition, and background must all align with the specified theme.`;
      return prompt;
    case EnhanceMethod.REFERENCE:
      let refPrompt = `${basePrompt} A reference image is provided. Analyze its style, mood, lighting, composition, and background. Apply a similar high-end, professional aesthetic to the main product image. DO NOT include the product from the reference image. The goal is to match the style, not replicate the content.`;
      if (options.instructions) {
        refPrompt += ` Also, follow these additional instructions carefully: ${options.instructions}.`;
      }
      return refPrompt;
    default:
      throw new Error("Invalid enhancement method");
  }
}

export const enhanceImage = async (
  productImage: ImageData,
  method: EnhanceMethod,
  options: CustomizationOptions,
  referenceImage: ImageData | null
): Promise<{ imageUrls: string[]; text: string }> => {
  // Fix: Updated model name from 'gemini-pro-vision' to a current, more suitable model.
  const model = 'gemini-2.5-flash-image';

  const textPrompt = generatePrompt(method, options);
  
  const contentParts: Part[] = [
    { text: textPrompt },
    dataUrlToGeminiPart(productImage),
  ];

  if (method === EnhanceMethod.REFERENCE && referenceImage) {
    // Fix: Reference image should be part of the contents
    contentParts.push(dataUrlToGeminiPart(referenceImage));
  } else if (method === EnhanceMethod.REFERENCE && !referenceImage) {
    throw new Error("A reference image is required for the Reference method.");
  }
  
  // Fix: Updated API call to use ai.models.generateContent with the new request structure.
  // Create 3 parallel API requests to generate variants.
  const apiPromises = Array(3).fill(null).map(() => 
    ai.models.generateContent({
        model,
        contents: { parts: contentParts },
        // Fix: Use responseModalities to request an image output.
        config: {
            responseModalities: [Modality.IMAGE],
        }
    })
  );

  const results = await Promise.all(apiPromises);
  const { imageUrls, text } = await processImageGenerationResponse(results);

  if (imageUrls.length === 0) {
    throw new Error("API did not return any images. They may have been blocked for safety reasons.");
  }
  
  return { imageUrls, text: text || 'Images generated successfully.' };
};

// =================== Merge Product Functions ===================

function generateMergePrompt(method: EnhanceMethod, options: CustomizationOptions, productCount: number): string {
  const basePrompt = `You are a world-class product photographer AI. Your primary task is to take ${productCount} separate, user-submitted product images and masterfully combine them into a single, cohesive, and professional studio photograph. The final image must look like all products were photographed together in the same scene with consistent lighting, shadows, and perspective. Arrange the products in a visually appealing and natural composition.`;

  switch (method) {
    case EnhanceMethod.SMART:
      return `${basePrompt} Analyze the products and create the most compelling and commercially appealing scene for them as a group. Consider ideal lighting, background, and subtle props that enhance their collective value. Generate a creative and beautiful concept automatically.`;
    case EnhanceMethod.CUSTOMIZE:
      const themeName = options.customTheme || (translations.themes as any)[options.theme]?.en || options.theme;
      let prompt = `${basePrompt} Create the scene with a "${themeName}" theme.`;
      if (options.props) {
        prompt += ` Incorporate the following props or elements naturally into the scene: ${options.props}.`;
      }
      if (options.instructions) {
        prompt += ` Follow these additional instructions for composition and arrangement carefully: ${options.instructions}.`;
      }
      prompt += ` The lighting, composition, and background must all align with the specified theme.`;
      return prompt;
    case EnhanceMethod.REFERENCE:
      let refPrompt = `${basePrompt} A reference image is provided. Analyze its style, mood, lighting, composition, and background. Apply a similar high-end, professional aesthetic to the combined product scene. DO NOT include the products from the reference image. The goal is to match the style, not replicate the content.`;
      if (options.instructions) {
        refPrompt += ` Also, follow these additional instructions for composition and arrangement carefully: ${options.instructions}.`;
      }
      return refPrompt;
    default:
      throw new Error("Invalid enhancement method");
  }
}

export const mergeProductImages = async (
  productImages: ImageData[],
  method: EnhanceMethod,
  options: CustomizationOptions,
  referenceImage: ImageData | null
): Promise<{ imageUrls: string[]; text: string }> => {
  // Fix: Updated model name.
  const model = 'gemini-2.5-flash-image';
  
  const textPrompt = generateMergePrompt(method, options, productImages.length);

  const contentParts: Part[] = [{ text: textPrompt }];
  
  if (method === EnhanceMethod.REFERENCE && referenceImage) {
    contentParts.push(dataUrlToGeminiPart(referenceImage));
  } else if (method === EnhanceMethod.REFERENCE && !referenceImage) {
    throw new Error("A reference image is required for the Reference method.");
  }

  productImages.forEach(img => contentParts.push(dataUrlToGeminiPart(img)));

  // Fix: Updated API call to new SDK format.
  const apiPromises = Array(3).fill(null).map(() => 
    ai.models.generateContent({
        model,
        contents: { parts: contentParts },
        config: {
            responseModalities: [Modality.IMAGE],
        }
    })
  );

  const results = await Promise.all(apiPromises);
  const { imageUrls, text } = await processImageGenerationResponse(results);

  if (imageUrls.length === 0) {
    throw new Error("API did not return any images. They may have been blocked for safety reasons.");
  }
  
  return { imageUrls, text: text || 'Images generated successfully.' };
};


// =================== Digital Imaging Functions ===================

function generateDigitalImagingPrompt(options: CustomizationOptions): string {
    const basePrompt = `You are a high-end advertising creative director and CGI artist AI. Your task is to create a visually stunning, hyper-realistic, surreal advertising image for the provided product. The final image should be clever and conceptually grounded, suitable for a high-end ad campaign.

**Crucial Rule: The product itself (its shape, label, form) MUST remain realistic and unchanged.** The surrealism comes from creatively manipulating the product's scale and its interaction with the environment.`;

    // Use the English translation for the theme key to ensure the prompt is in English.
    const themeKey = `digitalImaging.themes.${options.theme}`;
    const translatedTheme = getTranslation(themeKey, 'en', translations);
    const themeName = options.customTheme || (translatedTheme !== themeKey ? translatedTheme : options.theme);
    
    let prompt = `${basePrompt}\n\nThe artistic concept is "${themeName}".`;
    
    if (options.props) {
        prompt += `\nIntegrate the following elements or ideas into the artwork: ${options.props}.`;
    }
    if (options.instructions) {
        prompt += `\nFollow these specific creative instructions carefully: ${options.instructions}.`;
    }
    
    prompt += `\n\nCreate a masterpiece that is both imaginative and commercially powerful. The lighting, shadows, and textures should be world-class.`;
    return prompt;
}

export const generateDigitalImaging = async (
  productImage: ImageData,
  options: CustomizationOptions,
): Promise<{ imageUrls: string[]; text: string }> => {
  // Fix: Updated model name.
  const model = 'gemini-2.5-flash-image';

  const textPrompt = generateDigitalImagingPrompt(options);
  
  const contentParts: Part[] = [
    { text: textPrompt },
    dataUrlToGeminiPart(productImage),
  ];

  // Fix: Updated API call to new SDK format.
  const apiPromises = Array(3).fill(null).map(() => 
    ai.models.generateContent({
        model,
        contents: { parts: contentParts },
        config: {
            responseModalities: [Modality.IMAGE],
        }
    })
  );

  const results = await Promise.all(apiPromises);
  const { imageUrls, text } = await processImageGenerationResponse(results);
  
  if (imageUrls.length === 0) {
    throw new Error("API did not return any images. They may have been blocked for safety reasons.");
  }
  
  return { imageUrls, text: text || 'Images generated successfully.' };
};

export const generateDigitalImagingConcepts = async (
  productImage: ImageData,
): Promise<{ concepts: string[] }> => {
  const model = 'gemini-2.5-flash';

  const prompt = `You are a high-end advertising creative director AI, specializing in generating clever CGI concepts for product ads. Analyze the provided product image and generate 6 distinct, imaginative, yet commercially viable concepts for a surreal advertising visual.

**Core Principles for Concepts:**
1.  **Product Integrity:** The product's own form must remain realistic and unchanged.
2.  **Surreal Interaction:** The surrealism should come from the product's interaction with a manipulated environment, scale, or concept.
3.  **Ad-Worthiness:** The concepts must be visually striking and suitable for a magazine or digital ad campaign.
4.  **Clarity:** Each concept should be described in a single, concise sentence.

**Example Concepts for a Perfume Bottle:**
- "A miniature boat sailing on a sea of liquid perfume inside the bottle."
- "The perfume bottle stands tall like a skyscraper in a city of flowers."
- "The product is perfectly balanced on a floating water droplet."

**Your Task:**
Based on the provided product image, generate 6 creative concepts.
`;

  const contents = {
      parts: [
          { text: prompt },
          dataUrlToGeminiPart(productImage)
      ]
  };

  // Fix: Updated API call to new SDK format.
  const response = await ai.models.generateContent({ model, contents });
  const responseText = response.text;
  const concepts = responseText.split('\n').map(line => line.replace(/^[-\d.]+\s*/, '').trim()).filter(Boolean);

  if (concepts.length === 0) {
    throw new Error("Failed to generate concepts from the model's response.");
  }

  return { concepts };
};

export const generateDigitalImagingFromConcept = async (
    productImage: ImageData,
    concept: string,
): Promise<{ imageUrls: string[]; text: string }> => {
    const model = 'gemini-2.5-flash-image';
    const prompt = `You are a high-end advertising creative director and CGI artist AI. Your task is to create a visually stunning, hyper-realistic, surreal advertising image for the provided product based on a specific concept.

**Crucial Rule: The product itself (its shape, label, form) MUST remain realistic and unchanged.** The surrealism comes from its interaction with the environment.

**The Concept to Execute:**
"${concept}"

**Instructions:**
- Bring this concept to life with photorealistic detail.
- The lighting, shadows, and textures must be world-class and consistent.
- The final image should be imaginative, commercially powerful, and suitable for a high-end ad campaign.`;

    const contentParts: Part[] = [
        { text: prompt },
        dataUrlToGeminiPart(productImage),
    ];
    
    // Fix: Updated API call to new SDK format.
    const apiPromises = Array(3).fill(null).map(() => 
        ai.models.generateContent({
            model,
            contents: { parts: contentParts },
            config: {
                responseModalities: [Modality.IMAGE],
            }
        })
    );
    
    const results = await Promise.all(apiPromises);
    const { imageUrls, text } = await processImageGenerationResponse(results);

    if (imageUrls.length === 0) {
        throw new Error("API did not return any images. They may have been blocked for safety reasons.");
    }
    
    return { imageUrls, text: text || 'Image generated successfully.' };
};


// =================== Product Carousel Functions ===================
export const generateProductCarousel = async (
  productImages: ImageData[],
  options: CarouselOptions,
  slideCount: number,
  logoImage: ImageData | null
): Promise<{ slides: CarouselSlide[], carousel_caption: string }> => {
  const model = 'gemini-2.5-flash';
  const schema = {
    type: Type.OBJECT,
    properties: {
      slides: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            index: { type: Type.NUMBER },
            visual_concept: { type: Type.STRING },
            headline_in_image: { type: Type.STRING },
            supporting_text_in_image: { type: Type.STRING },
            image_prompt: { type: Type.STRING },
          },
        },
      },
      carousel_caption: { type: Type.STRING },
    },
  };

  const textPrompt = `You are a senior social media strategist. Based on the following product information and provided product images, create a compelling social media carousel post.

**Product Information:**
- Product Name: ${options.productName}
- Key Benefits/Features: ${options.benefits}
- Target Audience: ${options.audience}
- Platform: ${options.platform}
- Language: ${options.language}
- Number of Slides: ${slideCount}

**Your Task:**
1.  **Develop a content strategy** for a ${slideCount}-slide carousel. Each slide should have a clear purpose (e.g., hook, feature highlight, benefit, social proof, call to action).
2.  **For each slide, provide:**
    - \`visual_concept\`: A brief description of the visual idea for the slide.
    - \`headline_in_image\`: The main text to be displayed prominently on the slide's image. Keep it short and impactful.
    - \`supporting_text_in_image\`: Optional smaller text for more detail.
    - \`image_prompt\`: A detailed, descriptive prompt for an AI image generator to create the visual. This prompt should incorporate the product from the user's images into the described scene.
3.  **Write a \`carousel_caption\`:** This is the main text that goes with the social media post. It should be engaging, use emojis, include relevant hashtags, and have a clear call to action.

**Important:** Generate all text content in **${options.language}**. The output MUST be a valid JSON object matching the provided schema.
`;
  
  const contentParts: Part[] = [
    { text: textPrompt },
    ...productImages.map(dataUrlToGeminiPart),
  ];

  const response = await ai.models.generateContent({
    model,
    contents: { parts: contentParts },
    config: {
      responseMimeType: 'application/json',
      responseSchema: schema,
    },
  });
  
  const resultJson = JSON.parse(response.text);
  
  // Now, generate an image for each slide concept
  const imageGenerationPromises = resultJson.slides.map((slide: CarouselSlide) =>
    regenerateCarouselSlideImage(productImages, options, slide, logoImage)
  );
  
  const imageUrls = await Promise.all(imageGenerationPromises);

  const finalSlides = resultJson.slides.map((slide: CarouselSlide, index: number) => ({
    ...slide,
    generated_image_url: imageUrls[index],
  }));

  return { slides: finalSlides, carousel_caption: resultJson.carousel_caption };
};

export const regenerateCarouselSlideImage = async (
  productImages: ImageData[],
  options: CarouselOptions,
  slide: CarouselSlide,
  logoImage: ImageData | null
): Promise<string> => {
  const model = 'gemini-2.5-flash-image';
  
  const textPrompt = `
You are a professional social media graphic designer AI. Your task is to create a visually stunning and cohesive image for a product carousel slide.

**-- PRIMARY INSTRUCTION --**
Your goal is to visually represent the following concept, featuring the user's product(s).

**-- VISUAL CONCEPT --**
${slide.image_prompt}

**-- TEXT TO RENDER ON THE IMAGE --**
- Headline: "${slide.headline_in_image}"
- Supporting Text: "${slide.supporting_text_in_image}"

**-- CRUCIAL RULES FOR TEXT RENDERING --**
1.  **ABSOLUTE ACCURACY:** You MUST render the text EXACTLY as provided above. DO NOT misspell, rephrase, add, or omit any words. The text must be rendered in the specified language (${options.language}). This is the most important rule.
2.  **TEXT HIERARCHY:** The "Headline" must be visually more prominent than the "Supporting Text".
3.  **LEGIBILITY IS KEY:** The text must be easily readable. Choose a clear font and ensure high contrast between the text and the background. Do not place text over busy or distracting parts of the image.
4.  **AESTHETIC INTEGRATION:** The text should feel like a natural part of the design, not an afterthought. The placement, font, and style should match the overall visual concept.
5.  **COMPLETENESS:** Both the Headline and Supporting Text MUST appear on the final image, unless a field is an empty string (""). If a field is empty, do not render any text for it.

**-- LOGO INSTRUCTIONS --**
${(options.addLogo && logoImage) ? 'A logo is provided as the final image input. You MUST place this logo tastefully on the generated image, typically in a corner (e.g., top-right or bottom-right). Ensure it is legible, not too large, and does not obstruct key elements.' : 'No logo was provided.'}

Follow these instructions meticulously to create a perfect, professional-grade carousel slide.
`;

  const contentParts: Part[] = [
    { text: textPrompt },
    ...productImages.map(dataUrlToGeminiPart),
  ];

  if (options.addLogo && logoImage) {
    contentParts.push(dataUrlToGeminiPart(logoImage));
  }
  
  const response = await ai.models.generateContent({
    model,
    contents: { parts: contentParts },
    config: {
        responseModalities: [Modality.IMAGE],
    }
  });

  const candidate = response.candidates?.[0];
  const imagePart = candidate?.content.parts.find(p => p.inlineData);
  if (imagePart?.inlineData) {
      return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
  }

  throw new Error("AI failed to regenerate the image for the slide.");
};

// Fix: Implement missing Ad Creator functions
// =================== Ad Creator Functions ===================

export const generateAdImage = async (
  productImage: ImageData,
  adCopy: AdCopyOptions,
  referenceImage: ImageData | null
): Promise<{ imageUrls: string[]; text: string }> => {
  const model = 'gemini-2.5-flash-image';
  
  let textPrompt = `You are a professional advertising graphic designer AI. Your task is to create a visually stunning ad poster by integrating text onto a product image.

**-- PRIMARY INSTRUCTION --**
Your goal is to creatively and legibly place the provided ad copy onto the user's product image.

**-- TEXT TO RENDER ON THE IMAGE --**
- Headline: "${adCopy.headline}"
${adCopy.description ? `- Description: "${adCopy.description}"` : ''}
${adCopy.cta ? `- Call to Action: "${adCopy.cta}"` : ''}

**-- CRUCIAL RULES FOR TEXT RENDERING --**
1.  **ABSOLUTE ACCURACY:** You MUST render the text EXACTLY as provided above. DO NOT misspell, rephrase, add, or omit any words. This is the most important rule.
2.  **TEXT HIERARCHY:** The "Headline" must be the most prominent text. The "Description" should be less prominent, and the "Call to Action" should be clear and distinct.
3.  **LEGIBILITY IS KEY:** The text must be easily readable. Choose a clear font and ensure high contrast between the text and the background. Do not place text over busy or distracting parts of the image.
4.  **AESTHETIC INTEGRATION:** The text should feel like a natural part of the design, not an afterthought. The placement, font, and style should match the overall visual concept of the product and any style reference provided.
5.  **COMPLETENESS:** All provided text fields (Headline, Description, CTA) MUST appear on the final image, unless the field is an empty string.
`;
  
  if (referenceImage) {
    textPrompt += `\n**-- STYLE REFERENCE --**\nA style reference image is provided. Analyze its typography, color palette, and overall mood. Apply a similar design aesthetic to the ad you are creating. Do not copy the content, only the style.`;
  }

  if (adCopy.instructions) {
    textPrompt += `\n**-- ADDITIONAL INSTRUCTIONS --**\nFollow these specific creative instructions carefully: ${adCopy.instructions}`;
  }

  const contentParts: Part[] = [
    { text: textPrompt },
    dataUrlToGeminiPart(productImage),
  ];

  if (referenceImage) {
    contentParts.push(dataUrlToGeminiPart(referenceImage));
  }

  const apiPromises = Array(3).fill(null).map(() => 
    ai.models.generateContent({
        model,
        contents: { parts: contentParts },
        config: {
            responseModalities: [Modality.IMAGE],
        }
    })
  );
  
  const results = await Promise.all(apiPromises);
  const { imageUrls, text } = await processImageGenerationResponse(results);

  if (imageUrls.length === 0) {
      throw new Error("API did not return any images. They may have been blocked for safety reasons.");
  }
  
  return { imageUrls, text: text || 'Images generated successfully.' };
};

export const generateAdCopySuggestions = async (
  productName: string,
  keywords: string
): Promise<AdCopySuggestions> => {
  const model = 'gemini-2.5-flash';
  const schema = {
    type: Type.OBJECT,
    properties: {
      headlines: { type: Type.ARRAY, items: { type: Type.STRING } },
      descriptions: { type: Type.ARRAY, items: { type: Type.STRING } },
      ctas: { type: Type.ARRAY, items: { type: Type.STRING } },
    }
  };

  const prompt = `You are an expert marketing copywriter. Generate ad copy suggestions for a product.
Product Name: ${productName}
Keywords: ${keywords}

Generate 3 suggestions for each of the following fields:
- headlines: Short, catchy, and attention-grabbing.
- descriptions: Slightly longer, highlighting a key benefit.
- ctas (Calls to Action): Clear and direct, encouraging a specific action.

The output must be a valid JSON object matching the provided schema. Do not include any other text or formatting.
`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: schema,
    },
  });
  
  const resultJson = JSON.parse(response.text);
  return resultJson;
};


// Fix: Implement missing Virtual Try-On function
// =================== Virtual Try-On Functions ===================
export const generateVirtualTryOn = async (
    productImages: ImageData[],
    modelImage: ImageData | null,
    generationParams: ModelGenerationOptions | null
): Promise<{ imageUrls: string[]; text: string }> => {
    const model = 'gemini-2.5-flash-image';
    const contentParts: Part[] = [];
    let prompt = "You are a world-class fashion AI assistant. ";

    if (modelImage) {
        prompt += "Take the product(s) from the subsequent images and realistically place them on the model in the first image. Maintain the model's pose and the background. Ensure the fit, lighting, and shadows are natural and photorealistic.";
        contentParts.push(dataUrlToGeminiPart(modelImage));
        productImages.forEach(p => contentParts.push(dataUrlToGeminiPart(p)));
        contentParts.push({ text: prompt });
    } else if (generationParams) {
        const ethnicity = generationParams.ethnicity === 'Other' && generationParams.customEthnicity ? generationParams.customEthnicity : generationParams.ethnicity;
        prompt += `First, generate a photorealistic, full-body image of a model with these characteristics: Gender: ${generationParams.gender}, Ethnicity: ${ethnicity}, Details: ${generationParams.details}. Then, dress the generated model in the product(s) from the subsequent images. The final image should be a high-quality, professional fashion photo.`;
        productImages.forEach(p => contentParts.push(dataUrlToGeminiPart(p)));
        contentParts.push({ text: prompt });
    } else {
        throw new Error("Either a model image or generation parameters must be provided.");
    }
    
    const apiPromises = Array(3).fill(null).map(() => 
      ai.models.generateContent({
        model,
        contents: { parts: contentParts },
        config: { responseModalities: [Modality.IMAGE] },
      })
    );

    const results = await Promise.all(apiPromises);
    const { imageUrls, text } = await processImageGenerationResponse(results);

    if (imageUrls.length === 0) {
        throw new Error("API did not return any images. They may have been blocked for safety reasons.");
    }
    
    return { imageUrls, text: text || 'Images generated successfully.' };
};


// Fix: Implement missing Lifestyle Photoshoot function
// =================== Lifestyle Photoshoot Functions ===================
export const generateLifestylePhotoshoot = async (
    productImage: ImageData,
    modelImage: ImageData | null,
    generationParams: ModelGenerationOptions | null,
    interactionPrompt: string
): Promise<{ imageUrls: string[]; text: string }> => {
    const model = 'gemini-2.5-flash-image';
    const contentParts: Part[] = [];
    let prompt = "You are a world-class lifestyle photographer AI. ";
    
    contentParts.push(dataUrlToGeminiPart(productImage));

    if (modelImage) {
        prompt += `Combine the provided product image and model image into a single cohesive scene based on the following description: "${interactionPrompt}". Place the product naturally with the model. Ensure lighting, shadows, and perspective are realistic and consistent. The final output should only be the generated image.`;
        contentParts.push(dataUrlToGeminiPart(modelImage));
    } else if (generationParams) {
        const ethnicity = generationParams.ethnicity === 'Other' && generationParams.customEthnicity ? generationParams.customEthnicity : generationParams.ethnicity;
        prompt += `First, generate a photorealistic model with these characteristics: Gender: ${generationParams.gender}, Ethnicity: ${ethnicity}, Details: ${generationParams.details}. Then, place this model and the product from the provided image into a scene based on the following description: "${interactionPrompt}". Ensure the final image is a high-quality, professional lifestyle photograph. The final output should only be the generated image.`;
    } else {
        throw new Error("Either a model image or generation parameters must be provided.");
    }
    contentParts.push({ text: prompt });

    const apiPromises = Array(3).fill(null).map(() => 
        ai.models.generateContent({
            model,
            contents: { parts: contentParts },
            config: { responseModalities: [Modality.IMAGE] },
        })
    );

    const results = await Promise.all(apiPromises);
    const { imageUrls, text } = await processImageGenerationResponse(results);

    if (imageUrls.length === 0) {
        throw new Error("API did not return any images. They may have been blocked for safety reasons.");
    }
    
    return { imageUrls, text: text || 'Images generated successfully.' };
};


// Fix: Implement missing Pose Studio function
// =================== Pose Studio Functions ===================
export const generateStudioPoses = async (
    modelImage: ImageData,
    mode: PoseStudioMode,
    options: PoseStudioOptions
): Promise<{ imageUrls: string[]; text: string }> => {
    const model = 'gemini-2.5-flash-image';
    let prompt = `You are an expert AI fashion photographer. Your task is to take a single image of a model and generate a new image of the exact same model, wearing the exact same clothes, holding the exact same product, but in a different pose.

**Crucial Rules:**
-   **Consistency is KEY:** The model's face, body, hair, clothes, and any products they are holding MUST remain identical to the original image. Do not change anything about them.
-   **Background:** The background should be replaced based on the theme.
-   **New Pose:** The model's pose must be visibly different from the original.

`;

    if (mode === PoseStudioMode.SMART) {
        prompt += `**Instruction:** Generate a new, dynamic, and commercially appealing pose for the model. The background should be a clean, neutral studio setting.`;
    } else { // Customize
        const themeName = options.customTheme || getTranslation(`themes.${options.theme}`, 'en', translations) || options.theme;
        prompt += `**Instruction:** Re-create the scene with the following specifications:
-   **Pose:** The pose should fit a "${getTranslation(`poseStudio.frames.${options.framing}`, 'en', translations)}" framing from a "${getTranslation(`poseStudio.angles.${options.angle}`, 'en', translations)}" angle.
-   **Background Theme:** The background must be a "${themeName}" theme.
-   **Depth of Field:** The image should have a "${getTranslation(`poseStudio.dof.${options.depthOfField}`, 'en', translations)}".
-   **Lighting Style:** Use a "${getTranslation(`poseStudio.lighting.${options.lighting}`, 'en', translations)}" lighting style.
`;
        if (options.instructions) {
            prompt += `-   **Additional Instructions:** ${options.instructions}\n`;
        }
    }

    const contentParts: Part[] = [
        dataUrlToGeminiPart(modelImage),
        { text: prompt },
    ];

    // Generate 3 variants
    const apiPromises = Array(3).fill(null).map(() => 
        ai.models.generateContent({
            model,
            contents: { parts: contentParts },
            config: { responseModalities: [Modality.IMAGE] },
        })
    );

    const results = await Promise.all(apiPromises);
    const { imageUrls, text } = await processImageGenerationResponse(results);

    if (imageUrls.length === 0) {
        throw new Error("API did not return any images. They may have been blocked for safety reasons.");
    }
    
    return { imageUrls, text: text || 'Images generated successfully.' };
};


// Fix: Implement missing Image Editor functions
// =================== Image Editor Functions ===================
export const resizeImage = async (
    image: ImageData,
): Promise<{ imageUrls: string[]; text: string }> => {
    const model = 'gemini-2.5-flash-image';
    const prompt = `You are an AI image editor. The user has provided an image on a larger canvas. Your task is to intelligently expand the original image to fill the entire canvas. This is an outpainting task.
-   Analyze the content and style of the original image.
-   Generate new content for the empty areas that seamlessly blends with the original image in terms of style, lighting, texture, and content.
-   The final image should look natural and unedited.
-   Return only the final, filled image.`;
    
    const contentParts: Part[] = [
        { text: prompt },
        dataUrlToGeminiPart(image),
    ];
    
    const response = await ai.models.generateContent({
        model,
        contents: { parts: contentParts },
        config: { responseModalities: [Modality.IMAGE] },
    });
    
    const { imageUrls, text } = await processImageGenerationResponse([response]);

    if (imageUrls.length === 0) {
        throw new Error("API did not return any images. They may have been blocked for safety reasons.");
    }
    
    return { imageUrls, text: text || 'Image edited successfully.' };
};

export const editImageWithMask = async (
    maskedImage: ImageData,
    prompt: string
): Promise<{ imageUrls: string[]; text: string }> => {
    const model = 'gemini-2.5-flash-image';
    const textPrompt = `You are an AI image editor. The user has provided an image with a semi-transparent red mask indicating an area to be edited. Your task is to perform an inpainting operation based on the user's text prompt.
-   Analyze the unmasked parts of the image to understand the context, style, lighting, and texture.
-   Modify ONLY the masked area according to the following instruction: "${prompt}".
-   The changes must blend seamlessly with the rest of the image.
-   Return only the final, edited image with the mask removed.`;

    const contentParts: Part[] = [
        { text: textPrompt },
        dataUrlToGeminiPart(maskedImage),
    ];

    const apiPromises = Array(3).fill(null).map(() => 
        ai.models.generateContent({
            model,
            contents: { parts: contentParts },
            config: { responseModalities: [Modality.IMAGE] },
        })
    );
    
    const results = await Promise.all(apiPromises);
    const { imageUrls, text } = await processImageGenerationResponse(results);

    if (imageUrls.length === 0) {
        throw new Error("API did not return any images. They may have been blocked for safety reasons.");
    }
    
    return { imageUrls, text: text || 'Image edited successfully.' };
};

// Fix: Implement missing Face Swap function to resolve import error.
// =================== Face Swap Functions ===================
export const swapFace = async (
    targetImage: ImageData,
    faceImage: ImageData,
): Promise<{ imageUrls: string[]; text: string }> => {
    const model = 'gemini-2.5-flash-image';
    const prompt = `You are an expert AI image editor specializing in photorealistic face swapping. Your task is to take a target image (the first image provided after this prompt) and a face image (the second image). Seamlessly swap the face from the face image onto a person in the target image. It is crucial that the skin tone, lighting, shadows, and angle of the new face perfectly match the target image's environment to create a completely natural and undetectable result. The final output should only be the edited target image.`;
    
    const contentParts: Part[] = [
        { text: prompt },
        dataUrlToGeminiPart(targetImage),
        dataUrlToGeminiPart(faceImage),
    ];
    
    // Generate 3 variants
    const apiPromises = Array(3).fill(null).map(() => 
        ai.models.generateContent({
            model,
            contents: { parts: contentParts },
            config: { responseModalities: [Modality.IMAGE] },
        })
    );
    
    const results = await Promise.all(apiPromises);
    const { imageUrls, text } = await processImageGenerationResponse(results);

    if (imageUrls.length === 0) {
        throw new Error("API did not return any images. They may have been blocked for safety reasons.");
    }
    
    return { imageUrls, text: text || 'Face swapped successfully.' };
};

// Fix: Implement missing Motion Prompt and Video Studio functions
// =================== Motion Prompt & Video Studio Functions ===================
export const generateMotionPrompt = async (
    image: ImageData,
    keywords: string
): Promise<{ prompts: string[] }> => {
    const model = 'gemini-2.5-flash';
    let prompt = `You are a creative director specializing in AI video generation. Analyze the provided image and generate 4 distinct, creative motion prompts. These prompts will be used to animate the static image into a short video clip. Each prompt should be descriptive, focusing on camera movement, subject animation, and mood.
`;
    if (keywords.trim()) {
        prompt += `\nIncorporate these keywords into your suggestions: ${keywords}.\n`;
    }
    prompt += `
**Output format:**
-   Return ONLY the prompts.
-   Each prompt must be on a new line.
-   Do not use any numbering, bullet points, or other formatting.`;
    
    const contents = {
        parts: [
            { text: prompt },
            dataUrlToGeminiPart(image)
        ]
    };

    const response = await ai.models.generateContent({ model, contents });
    const responseText = response.text;
    const prompts = responseText.split('\n').map(line => line.trim()).filter(Boolean);

    if (prompts.length === 0) {
        throw new Error("Failed to generate motion prompts from the model's response.");
    }

    return { prompts };
};

export const suggestMotionPrompt = async (
    image: ImageData,
): Promise<string> => {
    const model = 'gemini-2.5-flash';
    const prompt = `You are a creative director. Analyze the provided image and suggest one compelling, detailed motion prompt for an AI video generator like Veo. The prompt should describe a short, 4-second animation starting from this static image. Focus on subtle, cinematic movements. For example: 'slow zoom into the product, with cherry blossom petals gently falling in the background, warm and dreamy lighting.' Your output should be ONLY the prompt text, without any preamble or quotes.`;

    const contents = {
        parts: [
            { text: prompt },
            dataUrlToGeminiPart(image)
        ]
    };

    const response = await ai.models.generateContent({ model, contents });
    return response.text.trim();
};

export const generateVideo = async (
    prompt: string,
    image: ImageData
): Promise<string | null> => {
    const model = 'veo-3.1-fast-generate-preview';

    const img = new Image();
    img.src = image.dataUrl;
    await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
    });
    const imageAspectRatio = img.width / img.height;
    const aspectRatio = imageAspectRatio > 1 ? '16:9' : '9:16';

    let operation = await ai.models.generateVideos({
        model,
        prompt,
        image: {
            imageBytes: image.dataUrl.split(',')[1],
            mimeType: image.mimeType,
        },
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: aspectRatio,
        }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    return downloadLink || null;
};


// =================== Background Studio Functions ===================
export const removeBackground = async (
    image: ImageData,
): Promise<{ imageUrls: string[]; text: string }> => {
    const model = 'gemini-2.5-flash-image';
    const prompt = `You are a precision image editor. Your only task is to remove the background from the provided image.
- Identify the main subject.
- Make the entire background transparent.
- The output MUST be a PNG image with a transparent background.
- Do not add any new elements, shadows, or reflections. Preserve only the original subject.`;
    
    const contentParts: Part[] = [
        { text: prompt },
        dataUrlToGeminiPart(image),
    ];
    
    const response = await ai.models.generateContent({
        model,
        contents: { parts: contentParts },
        config: { responseModalities: [Modality.IMAGE] },
    });
    
    const { imageUrls, text } = await processImageGenerationResponse([response]);

    if (imageUrls.length === 0) {
        throw new Error("API did not return an image. It may have been blocked for safety reasons.");
    }
    
    return { imageUrls, text: text || 'Background removed successfully.' };
};

export const replaceBackground = async (
    image: ImageData,
    backgroundPrompt: string,
): Promise<{ imageUrls: string[]; text: string }> => {
    const model = 'gemini-2.5-flash-image';
    const prompt = `You are an expert virtual photographer. Your task is to seamlessly place a product into a new background.
1.  First, perfectly isolate the main subject from the provided user image, preserving all its details and shadows.
2.  Then, generate a new, photorealistic background scene based on this description: "${backgroundPrompt}".
3.  Finally, place the isolated subject into the new scene. You MUST ensure the lighting, shadows, perspective, and reflections on the subject perfectly match the new background, making it look like it was photographed there originally.`;

    const contentParts: Part[] = [
        { text: prompt },
        dataUrlToGeminiPart(image),
    ];
    
    // Generate 3 variants
    const apiPromises = Array(3).fill(null).map(() => 
        ai.models.generateContent({
            model,
            contents: { parts: contentParts },
            config: { responseModalities: [Modality.IMAGE] },
        })
    );
    
    const results = await Promise.all(apiPromises);
    const { imageUrls, text } = await processImageGenerationResponse(results);

    if (imageUrls.length === 0) {
        throw new Error("API did not return any images. They may have been blocked for safety reasons.");
    }
    
    return { imageUrls, text: text || 'Background replaced successfully.' };
};

// =================== Sketch Design Studio Functions ===================

export const generateDesignFromSketch = async (
  sketchImage: ImageData,
  options: SketchDesignOptions
): Promise<{ imageUrls: string[]; text: string }> => {
  const model = 'gemini-2.5-flash-image';

  let categoryPrompt = "";
  switch (options.category) {
    case SketchDesignCategory.FASHION:
      categoryPrompt = "a high-fashion garment or outfit design, showing fabric textures, draping, and details.";
      break;
    case SketchDesignCategory.LOGO:
      categoryPrompt = "a professional, vector-style logo or branding mark. Clean lines, scalable aesthetic.";
      break;
    case SketchDesignCategory.FURNITURE:
      categoryPrompt = "a high-end furniture piece, showing materials like wood, metal, or fabric with realistic lighting.";
      break;
    case SketchDesignCategory.INTERIOR:
      categoryPrompt = "a photorealistic interior design render. Show lighting, shadows, textures, and spatial depth.";
      break;
    case SketchDesignCategory.ARCHITECTURE:
      categoryPrompt = "a realistic architectural visualization of a building or structure.";
      break;
    case SketchDesignCategory.ART:
      categoryPrompt = "a polished piece of digital art or illustration.";
      break;
  }

  let prompt = `You are an expert industrial and creative designer AI. Your task is to transform a rough hand-drawn sketch into a professional, high-quality visual design.

**Input:** A user-provided sketch.
**Category:** ${options.category}
**Output Goal:** Create ${categoryPrompt}

**Specific Instructions:**
-   Strictly follow the composition and structure of the provided sketch.
-   Render it with high-quality textures, lighting, and realistic details appropriate for the category.`;

  if (options.category === SketchDesignCategory.FASHION && (options.fashionPattern || options.fashionPlacement)) {
      prompt += `\n**Fashion Details:**`;
      if (options.fashionPattern) {
          prompt += `\n-   **Fabric Pattern/Material:** Apply the following pattern or texture: "${options.fashionPattern}".`;
      }
      if (options.fashionPlacement && options.fashionPlacement !== 'ALL') {
          prompt += `\n-   **Placement:** Apply this pattern/material ONLY to the **${options.fashionPlacement}**. The rest of the outfit should complement this design.`;
      } else if (options.fashionPlacement === 'ALL') {
          prompt += `\n-   **Placement:** Apply this pattern/material to the entire outfit.`;
      }
  }

  if (options.mode === SketchDesignMode.REFERENCE && options.referenceImage) {
     prompt += `\n-   **Style Reference:** A reference image is provided. Analyze its colors, materials, textures, and overall style. Apply these aesthetic elements to the sketch design while maintaining the sketch's original shape.`;
  } else if (options.mode === SketchDesignMode.CUSTOMIZE && options.prompt) {
     prompt += `\n-   **User Prompt:** ${options.prompt}`;
  } else {
     prompt += `\n-   **Auto-Enhance:** Use your creative judgment to select the best materials, colors, and style that fit modern design trends for this category. Make it look premium and professional.`;
  }
  
  prompt += `\n-   Bring the user's vision to life while respecting the original lines of the sketch.`;

  const contentParts: Part[] = [
    { text: prompt },
    dataUrlToGeminiPart(sketchImage),
  ];

  if (options.mode === SketchDesignMode.REFERENCE && options.referenceImage) {
      contentParts.push(dataUrlToGeminiPart(options.referenceImage));
  }

  // Generate 3 variants
  const apiPromises = Array(3).fill(null).map(() => 
    ai.models.generateContent({
      model,
      contents: { parts: contentParts },
      config: { responseModalities: [Modality.IMAGE] },
    })
  );

  const results = await Promise.all(apiPromises);
  const { imageUrls, text } = await processImageGenerationResponse(results);

  if (imageUrls.length === 0) {
    throw new Error("API did not return any images. They may have been blocked for safety reasons.");
  }
  
  return { imageUrls, text: text || 'Designs generated successfully.' };
};
