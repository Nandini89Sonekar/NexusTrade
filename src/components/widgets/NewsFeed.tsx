import React, { useEffect, useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import { Newspaper, Activity, RefreshCw } from 'lucide-react';

export function NewsFeed() {
  const [news, setNews] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXUS_API_KEY || '' });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Provide a live market intelligence brief covering the top 3 cryptocurrency and financial market news stories happening right now. Focus on high-impact, market-moving events from the last 24 hours. Format as a concise list of bullet points with bold titles.",
        config: {
          systemInstruction: "You are a professional financial analyst. Provide a direct, factual market brief. Do not include any conversational filler or mention that you are an AI. Use current knowledge to provide the most recent information possible."
        }
      });
      
      setNews(response.text || 'No news available at the moment.');
    } catch (error) {
      console.error('Failed to fetch news from AI:', error);
      // Fallback news for demo
      setNews("### Market Intelligence Fallback\n\n* **BTC Stability**: Bitcoin maintains support above $60k despite macro volatility.\n* **Regulatory Updates**: New clarity on digital asset frameworks in major markets.\n* **Institutional Flow**: Continued interest from hedge funds in spot ETFs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-blue-400">
          <Activity className="w-4 h-4" />
        </div>
        <button 
          onClick={fetchNews} 
          disabled={loading}
          className="text-slate-500 hover:text-white transition-colors"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-2 animate-pulse">
              <div className="h-4 bg-slate-800 rounded w-3/4"></div>
              <div className="h-3 bg-slate-800 rounded w-full"></div>
              <div className="h-3 bg-slate-800 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 prose prose-invert prose-sm max-w-none prose-p:text-slate-400 prose-li:text-slate-400">
          <ReactMarkdown>{news}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
