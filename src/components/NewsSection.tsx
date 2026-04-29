import React, { useEffect, useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Newspaper, ExternalLink, RefreshCw, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface NewsArticle {
  title: string;
  summary: string;
  url: string;
  source: string;
  category: string;
  time: string;
}

export function NewsSection() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXUS_API_KEY || '' });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Retrieve the latest top 6 cryptocurrency and financial market news headlines from today. For each, provide a title, a short 1-sentence summary, a real source name, a category (e.g., Regulation, Market, Tech), and a real URL to the news article. Focus on events from the last 24 hours.",
        config: {
          systemInstruction: "You are a professional financial news aggregator. Provide real, current news headlines and links. Do not include any conversational text or mention that you are an AI.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                summary: { type: Type.STRING },
                url: { type: Type.STRING },
                source: { type: Type.STRING },
                category: { type: Type.STRING },
                time: { type: Type.STRING, description: "e.g. 2h ago" }
              },
              required: ["title", "summary", "url", "source", "category", "time"]
            }
          }
        }
      });

      const data = JSON.parse(response.text || '[]');
      setArticles(data.length > 0 ? data : getFallbackArticles());
    } catch (error) {
      console.error('Failed to fetch news:', error);
      setArticles(getFallbackArticles());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackArticles = (): NewsArticle[] => [
    {
      title: "Bitcoin Consolidates Near All-Time Highs as ETF Inflows Continue",
      summary: "Major financial institutions continue to increase exposure to spot Bitcoin ETFs, providing a strong floor for the asset.",
      url: "https://www.coindesk.com",
      source: "CoinDesk",
      category: "Market",
      time: "1h ago"
    },
    {
      title: "Ethereum Foundation Proposes New Scalability Roadmap for 2024",
      summary: "Vitalik Buterin outlines the 'Purge' and 'Splurge' phases aimed at reducing complexity and improving layer-2 efficiency.",
      url: "https://cointelegraph.com",
      source: "CoinTelegraph",
      category: "Tech",
      time: "3h ago"
    },
    {
      title: "Global Regulators Coordinate on Cross-Border Stablecoin Standards",
      summary: "The G20 financial stability board releases a framework for regulating global stablecoin arrangements to mitigate systemic risk.",
      url: "https://www.bloomberg.com",
      source: "Bloomberg",
      category: "Regulation",
      time: "5h ago"
    }
  ];

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-3xl font-serif font-bold text-white mb-2 flex items-center gap-3">
            <Newspaper className="w-8 h-8 text-blue-500" />
            The Nexus Chronicle
          </h2>
          <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.2em]">
            Global Market Intelligence • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button 
          onClick={fetchNews}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Edition
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="space-y-4 animate-pulse">
              <div className="h-48 bg-slate-900 rounded-xl border border-slate-800"></div>
              <div className="h-6 bg-slate-800 rounded w-3/4"></div>
              <div className="h-4 bg-slate-800 rounded w-full"></div>
              <div className="h-4 bg-slate-800 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
          {articles.map((article, index) => (
            <motion.a
              key={index}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "group block relative",
                index === 0 && "md:col-span-2 lg:col-span-2 border-b border-slate-800 pb-12 md:border-b-0 md:pb-0"
              )}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded">
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 text-[10px] font-mono">
                    <Clock className="w-3 h-3" />
                    {article.time}
                  </span>
                </div>

                <h3 className={cn(
                  "font-serif font-bold text-white group-hover:text-blue-400 transition-colors leading-tight mb-4",
                  index === 0 ? "text-3xl md:text-4xl" : "text-xl"
                )}>
                  {article.title}
                </h3>

                <p className={cn(
                  "text-slate-400 leading-relaxed mb-6",
                  index === 0 ? "text-lg" : "text-sm"
                )}>
                  {article.summary}
                </p>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-800/50">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Source: {article.source}
                  </span>
                  <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      )}

      <div className="mt-16 pt-8 border-t border-slate-800 text-center">
        <p className="text-slate-600 text-[10px] font-mono uppercase tracking-[0.3em]">
          End of Daily Edition • Nexustrade Intelligence Unit
        </p>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
