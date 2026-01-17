
import React, { useState, useEffect } from 'react';
import { generateVideo } from '../services/geminiService';
import { Button, Loader, Card } from './Common';

const CinemaLab: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
    try {
      // Fix: Use any cast for window.aistudio to avoid conflict with existing global declarations in the environment
      const selected = await (window as any).aistudio.hasSelectedApiKey();
      setHasKey(selected);
    } catch (e) {
      setHasKey(false);
    }
  };

  const handleConnect = async () => {
    // Fix: Use any cast for window.aistudio to avoid conflict with existing global declarations in the environment
    await (window as any).aistudio.openSelectKey();
    // Assume success after opening dialog to mitigate race condition
    setHasKey(true);
  };

  const handleCreate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setVideoUrl(null);
    setStatus('Initializing video generation...');
    
    try {
      // Periodic status updates for UX
      const statusInterval = setInterval(() => {
        const statuses = [
          'Directing the actors...',
          'Rendering frames...',
          'Applying special effects...',
          'Finalizing export...',
          'Uploading to preview...'
        ];
        setStatus(statuses[Math.floor(Math.random() * statuses.length)]);
      }, 8000);

      const url = await generateVideo(prompt);
      clearInterval(statusInterval);
      setVideoUrl(url);
    } catch (err) {
      console.error(err);
      // Reset key selection if the requested entity was not found as per guidelines
      if (err instanceof Error && err.message.includes("Requested entity was not found")) {
        setHasKey(false);
        alert("Please re-select your API key to continue.");
      } else {
        alert("Video generation failed. Please try a different prompt.");
      }
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  if (hasKey === false) {
    return (
      <div className="max-w-xl mx-auto mt-20 text-center space-y-6">
        <div className="p-8 bg-amber-50 rounded-2xl border border-amber-200">
          <h2 className="text-2xl font-bold text-amber-900 mb-2">Video Access Required</h2>
          <p className="text-amber-700 mb-6">
            To generate high-quality AI videos, you need to connect your Google Cloud Billing project. 
            This ensures dedicated compute resources for your creations.
          </p>
          <Button onClick={handleConnect} className="mx-auto bg-amber-600 hover:bg-amber-700 border-none">
            Connect Billing Account
          </Button>
          <p className="text-xs text-amber-600 mt-4">
            Learn more about <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline font-bold">API Billing</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">AI Cinema Lab</h1>
        <p className="text-gray-500">Transform your imagination into 720p cinematic motion.</p>
      </div>

      <Card className="p-8 shadow-xl border-purple-100">
        <div className="space-y-4">
          <label className="block font-semibold text-gray-700">Video Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            placeholder="e.g. A panoramic shot of a cybernetic forest where trees have bioluminescent wires instead of vines, 4k cinematic style..."
            className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 min-h-[120px] transition-all"
          />
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Resolution: 720p | Model: Veo 3.1 Fast</span>
            <Button 
              onClick={handleCreate} 
              disabled={loading || !prompt.trim()}
              className="bg-purple-600 hover:bg-purple-700 px-10 h-14"
            >
              {loading ? 'Processing...' : 'Generate Movie'}
            </Button>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {loading && (
          <div className="bg-white/80 backdrop-blur rounded-2xl p-12 flex flex-col items-center justify-center space-y-6 shadow-sm border border-purple-50 border-dashed animate-pulse">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-center">
              <p className="text-lg font-bold text-purple-900">{status}</p>
              <p className="text-sm text-gray-500 mt-1 italic">This usually takes 1-3 minutes. Don't close this window.</p>
            </div>
          </div>
        )}

        {videoUrl && !loading && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="overflow-hidden bg-black aspect-video group relative">
              <video 
                src={videoUrl} 
                controls 
                autoPlay 
                loop 
                className="w-full h-full object-contain"
              />
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <a 
                  href={videoUrl} 
                  download="ai-video.mp4" 
                  className="bg-white/90 backdrop-blur p-2 rounded-lg text-gray-700 hover:bg-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </a>
              </div>
            </Card>
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-sm text-gray-600 italic">" {prompt} "</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CinemaLab;
