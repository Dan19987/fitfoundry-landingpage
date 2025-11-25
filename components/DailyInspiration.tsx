import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Download, Loader2, Image as ImageIcon, Key } from 'lucide-react';
import { motion } from 'framer-motion';

const DailyInspiration: React.FC = () => {
  const [hasKey, setHasKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
    // Cast window to any to access aistudio without type conflicts with global definition
    const win = window as any;
    if (win.aistudio) {
      const has = await win.aistudio.hasSelectedApiKey();
      setHasKey(has);
    }
  };

  const handleSelectKey = () => {
    const win = window as any;
    if (win.aistudio) {
      win.aistudio.openSelectKey();
      // Assume success after interaction to avoid race conditions, 
      // but ideally we'd re-check or have a callback.
      // For UX, we set hasKey true so the user sees the generate button immediately.
      setHasKey(true);
    }
  };

  const generateImage = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Re-initialize to ensure we have the latest selected key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [
            {
              text: 'A cinematic, hyper-realistic gym background in a dark industrial foundry setting. Glowing molten metal veins in the walls. High contrast, orange and gold lighting, atmospheric smoke. High tech fitness equipment. No text. 8k resolution, photorealistic.',
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
            imageSize: "1K"
          }
        },
      });

      let foundImage = false;
      if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64String = part.inlineData.data;
            setGeneratedImage(`data:image/png;base64,${base64String}`);
            foundImage = true;
            break;
          }
        }
      }

      if (!foundImage) {
        throw new Error("No image generated.");
      }

    } catch (err: any) {
      console.error("Generation failed", err);
      // If unauthorized/not found, reset key state
      if (err.message && err.message.includes("Requested entity was not found")) {
         setHasKey(false);
         setError("API Key Error. Bitte wähle deinen Key erneut aus.");
      } else {
         setError("Der Schmiedeofen ist überhitzt. Versuche es später erneut.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-24 bg-brand-dark relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-orange/5 via-brand-dark to-brand-dark pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 max-w-4xl">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-surface border border-brand-orange/30 text-brand-orange text-sm font-bold mb-4"
          >
            <Sparkles size={16} />
            <span>Powered by Gemini 3 Pro</span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">The Daily Forge</h2>
          <p className="text-brand-muted text-lg">
            Generiere dein persönliches Motivations-Wallpaper. Frisch aus der KI-Schmiede.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-brand-surface/50 backdrop-blur-md border-2 border-brand-border rounded-3xl p-2 md:p-4 shadow-2xl relative overflow-hidden group"
        >
          {/* Main Image Area */}
          <div className="relative aspect-video bg-brand-dark rounded-2xl overflow-hidden flex items-center justify-center border border-brand-border/50">
            
            {!generatedImage && !isLoading && (
              <div className="text-center p-8 max-w-md">
                <div className="w-20 h-20 bg-brand-surface rounded-full flex items-center justify-center mx-auto mb-6 text-brand-muted">
                  <ImageIcon size={40} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Bereit zum Schmieden?</h3>
                <p className="text-brand-muted text-sm mb-8">
                  Erstelle ein einzigartiges 1K Wallpaper im FitFoundry Look.
                </p>
                
                {!hasKey ? (
                  <button 
                    onClick={handleSelectKey}
                    className="px-6 py-3 bg-brand-surface border border-brand-orange/50 text-brand-orange font-bold rounded-full hover:bg-brand-orange hover:text-white transition-all flex items-center gap-2 mx-auto"
                  >
                    <Key size={18} />
                    API Key wählen
                  </button>
                ) : (
                  <button 
                    onClick={generateImage}
                    className="px-8 py-4 bg-gradient-to-r from-brand-orange to-brand-gold text-brand-dark font-black text-lg rounded-full hover:shadow-[0_0_30px_rgba(237,85,59,0.4)] transition-all flex items-center gap-3 mx-auto transform hover:scale-105"
                  >
                    <Sparkles size={20} />
                    JETZT SCHMIEDEN
                  </button>
                )}
                
                {hasKey && (
                   <p className="text-xs text-brand-muted mt-4 opacity-60">
                     Hinweis: Dies nutzt dein persönliches AI Studio Kontingent.
                   </p>
                )}
              </div>
            )}

            {isLoading && (
              <div className="absolute inset-0 z-20 bg-brand-dark/90 flex flex-col items-center justify-center">
                <Loader2 size={48} className="text-brand-orange animate-spin mb-4" />
                <p className="text-brand-gold font-mono text-sm animate-pulse">HEATING UP THE FORGE...</p>
              </div>
            )}

            {generatedImage && (
              <>
                <img 
                  src={generatedImage} 
                  alt="AI Generated Fitness Wallpaper" 
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                  <a 
                    href={generatedImage} 
                    download="fitfoundry-daily-forge.png"
                    className="p-4 bg-white text-brand-dark rounded-full hover:bg-brand-gold transition-colors"
                    title="Download"
                  >
                    <Download size={24} />
                  </a>
                  <button 
                    onClick={generateImage}
                    className="p-4 bg-brand-orange text-white rounded-full hover:bg-brand-orange/80 transition-colors"
                    title="Neues Bild generieren"
                  >
                    <Sparkles size={24} />
                  </button>
                </div>
              </>
            )}

            {error && (
               <div className="absolute inset-0 z-30 bg-brand-dark/95 flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-red-500 font-bold mb-4">{error}</p>
                  <button 
                    onClick={() => { setError(null); setHasKey(false); }}
                    className="px-4 py-2 bg-brand-surface border border-brand-border rounded-lg text-sm hover:text-white"
                  >
                    Zurücksetzen
                  </button>
               </div>
            )}
          </div>
          
          {/* Decorative frame elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none border-2 border-brand-orange/20 rounded-3xl" />
          <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-brand-gold rounded-tl-xl" />
          <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-brand-gold rounded-br-xl" />

        </motion.div>
      </div>
    </section>
  );
};

export default DailyInspiration;