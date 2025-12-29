import { GoogleGenAI, Type } from "@google/genai";
import { UserPreferences, OutfitRecommendation } from "../types";

// Helper to get API client
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Generates outfit text recommendations based on user preferences.
 * Uses gemini-3-flash-preview for fast and structured text generation.
 */
export const generateOutfitRecommendation = async (
  prefs: UserPreferences
): Promise<OutfitRecommendation> => {
  const ai = getAiClient();

  const prompt = `
    你是一位顶级的时尚造型师，擅长为客户打造高级、得体且符合个人气质的穿搭。
    
    用户画像:
    - 性别: ${prefs.gender}
    - 身材类型: ${prefs.bodyType}
    - 穿衣风格: ${prefs.style}

    请为该用户推荐一套完整的穿搭（上衣、下装、鞋子）。
    
    要求：
    1. 必须使用中文回答（visualPrompt 除外）。
    2. 提供一个富有时尚感的标题（title）。
    3. 简要解释为什么这套搭配适合该用户的身材和风格（explanation）。
    4. 详细描述每一件单品（名称、描述、颜色）。
    5. 提供一个 'visualPrompt'（英文），用于 AI 绘画模型生成全身模特图。
       - visualPrompt 必须非常详细，包含模特的详细外观、服装的材质、剪裁、颜色，以及姿势（full body shot）和背景（clean high-end studio）。
       - 确保 prompt 开头是 "Full body shot of a [gender] model..."。
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Fashion look title in Chinese" },
          explanation: { type: Type.STRING, description: "Reasoning in Chinese" },
          items: {
            type: Type.OBJECT,
            properties: {
              top: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  color: { type: Type.STRING },
                },
                required: ['name', 'description', 'color']
              },
              bottom: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  color: { type: Type.STRING },
                },
                required: ['name', 'description', 'color']
              },
              shoes: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  color: { type: Type.STRING },
                },
                required: ['name', 'description', 'color']
              },
            },
            required: ['top', 'bottom', 'shoes']
          },
          visualPrompt: { type: Type.STRING, description: "Detailed English prompt for image generation" }
        },
        required: ['title', 'explanation', 'items', 'visualPrompt']
      }
    }
  });

  if (!response.text) {
    throw new Error("无法生成推荐，请稍后重试。");
  }

  return JSON.parse(response.text) as OutfitRecommendation;
};

/**
 * Generates an image of the outfit using Gemini 2.5 Flash Image.
 */
export const generateOutfitImage = async (visualPrompt: string): Promise<string> => {
  const ai = getAiClient();

  // Enhance prompt for better aesthetics
  const fullPrompt = `Professional fashion editorial photography, 8k resolution, highly detailed, soft cinematic lighting, neutral minimalist background. ${visualPrompt}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: fullPrompt,
    config: {}
  });

  // Extract image
  let imageUrl = '';
  if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        break;
      }
    }
  }

  if (!imageUrl) {
    throw new Error("图片生成失败。");
  }

  return imageUrl;
};

/**
 * Edits an existing image based on a text prompt using Gemini 2.5 Flash Image.
 */
export const editOutfitImage = async (base64Image: string, editInstruction: string): Promise<string> => {
  const ai = getAiClient();

  // Strip prefix if present for the API call
  const base64Data = base64Image.split(',')[1];
  const mimeType = base64Image.substring(base64Image.indexOf(':') + 1, base64Image.indexOf(';'));

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        },
        {
          text: `Edit this image based on the following instruction: ${editInstruction}. Maintain the high-fashion aesthetic and realistic look.`
        }
      ]
    }
  });

   // Extract image
   let imageUrl = '';
   if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
     for (const part of response.candidates[0].content.parts) {
       if (part.inlineData) {
         imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
         break;
       }
     }
   }

   if (!imageUrl) {
     throw new Error("图片编辑失败。");
   }

   return imageUrl;
};