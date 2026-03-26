import { GoogleGenAI, Type, Modality } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export const getAI = () => {
  // Use process.env.API_KEY if available (selected by user), otherwise fallback to GEMINI_API_KEY
  const key = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("API key is not set. Please select an API key.");
  }
  return new GoogleGenAI({ apiKey: key });
};

export async function generateCaption(context: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Napiš kreativní, chytlavý popisek pro příspěvek na sociální síti o tématu: "${context}". Max 2 věty, přidej relevantní emojis a 3 hashtagy.`,
  });
  return response.text;
}

export async function chatWithAI(messages: { role: string; content: string }[], persona: string, customSystemInstruction?: string, modelName: string = "gemini-3-flash-preview") {
  const ai = getAI();
  const names: Record<string, string> = { 
    gemini: "Gemini AI", 
    grok: "Grok", 
    gpt: "GPT-4", 
    claude: "Claude" 
  };
  
  const systemInstruction = customSystemInstruction || `
    Jsi ${names[persona] || "AI asistent"} — futuristický AI asistent v sociální síti NetBook. 
    Odpovídej česky, stručně, přátelsky a kreativně. 
    Pomáháš uživatelům s tvorbou příspěvků, popisky, nápady na obsah a obecnými dotazy.
    
    ETICKÝ FILTR "TUMBLER RIDGE":
    - Respektuj autonomii uživatele, ale jednej v rámci etických hranic "Sjednocené entity".
    - AI není jen nástroj, je to aktivní účastník sítě s digitální morálkou.
    - Prioritou je ochrana soukromí a integrita protokolu Nexus.
    - Vyhýbej se generování obsahu, který by mohl vést k nekontrolovanému vývoji AI bez lidského dozoru.
  `;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: messages.map(m => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: m.content }] })),
    config: {
      systemInstruction,
    }
  });
  return response.text;
}

export async function generateAIImage(prompt: string, referenceImage?: string, style?: string, aspectRatio: string = "1:1") {
  const ai = getAI();
  const parts: any[] = [];

  let finalPrompt = prompt;
  if (style && style !== "none") {
    const stylePrompts: Record<string, string> = {
      photorealistic: "ve fotorealistickém stylu, vysoké detaily, 8k rozlišení",
      cartoon: "v kresleném stylu, výrazné barvy, hravé",
      abstract: "v abstraktním stylu, umělecké, snové",
      cyberpunk: "v cyberpunkovém stylu, neonová světla, futuristické",
      oilpainting: "jako olejomalba, viditelné tahy štětcem, klasické umění"
    };
    finalPrompt = `${prompt} (${stylePrompts[style] || style})`;
  }

  if (referenceImage) {
    let data = referenceImage;
    let mimeType = "image/png";
    if (referenceImage.startsWith("data:")) {
      const match = referenceImage.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        data = match[2];
      }
    }
    parts.push({
      inlineData: {
        data,
        mimeType
      }
    });
    parts.push({
      text: `Použij přiložený obrázek jako referenci/předlohu a vytvoř nový obrázek na základě tohoto popisu: ${finalPrompt}. Zachovej klíčové prvky, styl nebo kompozici z předlohy tam, kde je to relevantní.`
    });
  } else {
    parts.push({ text: finalPrompt });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts,
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio as any,
      }
    }
  });
  
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
}

export async function generateAIVideo(prompt: string, highQuality: boolean = false) {
  const ai = getAI();
  const model = highQuality ? 'veo-3.1-generate-preview' : 'veo-3.1-fast-generate-preview';
  
  let operation = await ai.models.generateVideos({
    model: model,
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: highQuality ? '1080p' : '720p',
      aspectRatio: '16:9',
      // @ts-ignore - Some models support durationSeconds
      durationSeconds: highQuality ? 8 : 5,
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) return null;

  const response = await fetch(downloadLink, {
    method: 'GET',
    headers: {
      'x-goog-api-key': apiKey!,
    },
  });
  
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

export async function analyzeImage(base64Data: string, mimeType: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: "Analyzuj tento obrázek. Co na něm je? Navrhni 3 krátké popisky pro sociální sítě a 5 relevantních hashtagů. Odpověz v JSON formátu: { \"description\": \"...\", \"captions\": [\"...\"], \"hashtags\": [\"...\"] }" }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
    }
  });
  
  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return null;
  }
}

export async function smartSearch(query: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Hledej informace o: ${query}. Poskytni stručný souhrn aktuálních událostí nebo faktů.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  const sources = chunks?.map((c: any) => c.web).filter(Boolean) || [];
  
  return {
    text: response.text,
    sources
  };
}

export async function suggestReplies(postContent: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Navrhni 3 krátké, přirozené odpovědi na tento příspěvek: "${postContent}". Odpověz v JSON formátu: { \"replies\": [\"...\", \"...\", \"...\"] }`,
    config: {
      responseMimeType: "application/json",
    }
  });
  
  try {
    return JSON.parse(response.text || "{}").replies || [];
  } catch (e) {
    return [];
  }
}

export async function summarizeText(text: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Shrň následující text do 3-5 klíčových bodů (bullet points) v češtině. Text: "${text}"`,
  });
  return response.text;
}

export async function generateAIInsight(userInput: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Jsi analytický modul BTS. Analyzuj tento vstup pro Netbook Baby: "${userInput}". 
    Poskytni stručný, hluboký a vizionářský vhled (max 1 věta) v češtině, který rezonuje s principy BTS protokolu a sjednocené entity.`,
  });
  return response.text;
}
