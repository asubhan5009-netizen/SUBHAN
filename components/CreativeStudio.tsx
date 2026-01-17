
import React, { useState } from 'react';
import { generateImage, editImage } from '../services/geminiService';
import { Button, Loader, Card, Input } from './Common';

const CreativeStudio: React.FC = () => {
  const [mode, setMode] = useState<'generate' | 'edit'>('generate');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [sourceImage, setSourceImage] = useState<string | null>(null);

  const handleSourceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const reader = new FileReader();
      reader.onload = (event) => setSourceImage(event.target?.result as string);
      reader.readAsDataURL(f);
    }
  };

  const handleAction = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      if (mode === 'generate') {
        const url = await generateImage(prompt);
        setResult(url);
      } else if (mode === 'edit' && sourceImage) {
        const url = await editImage(sourceImage, prompt);
        setResult(url);
      }
    } catch (err) {
      alert("Failed to process image. Check console for details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      <div className="flex bg-gray-100 p-1 rounded-xl w-fit mx-auto">
        <button 
          onClick={() => setMode('generate')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${mode === 'generate' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Generator
        </button>
        <button 
          onClick={() => setMode('edit')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${mode === 'edit' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Editor
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card className="p-6 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            {mode === 'generate' ? '✨ New Creation' : '🎨 Smart Editor'}
          </h2>
          
          {mode === 'edit' && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">1. Upload Source Image</p>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
                {sourceImage ? (
                  <div className="relative group inline-block">
                    <img src={sourceImage} alt="Source" className="max-h-40 rounded-lg" />
                    <button 
                      onClick={() => setSourceImage(null)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" /></svg>
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <input type="file" className="hidden" accept="image/*" onChange={handleSourceUpload} />
                    <div className="py-4 space-y-2">
                      <svg className="w-8 h-8 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <p className="text-sm text-gray-500">Click to upload image</p>
                    </div>
                  </label>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
              {mode === 'generate' ? 'Describe what you want to see' : '2. Describe the edits'}
            </p>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder={mode === 'generate' ? "e.g. A futuristic library floating in clouds, watercolor style" : "e.g. Add a red hat to the person and change the background to a sunny beach"}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
            />
          </div>

          <Button 
            onClick={handleAction} 
            disabled={loading || !prompt.trim() || (mode === 'edit' && !sourceImage)}
            className="w-full h-12"
          >
            {loading ? <Loader message="Generating..." /> : (mode === 'generate' ? 'Generate Image' : 'Apply Edits')}
          </Button>
        </Card>

        <Card className="aspect-square flex items-center justify-center bg-gray-50 relative overflow-hidden group">
          {result ? (
            <>
              <img src={result} alt="Result" className="w-full h-full object-contain" />
              <a 
                href={result} 
                download={`creative-${Date.now()}.png`}
                className="absolute bottom-4 right-4 p-3 bg-white/90 backdrop-blur rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </a>
            </>
          ) : (
            <div className="text-center p-8 opacity-40">
              <svg className="w-20 h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <p className="font-medium">Your masterpiece will appear here</p>
            </div>
          )}
          {loading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
              <Loader message="Brewing magic..." />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CreativeStudio;
