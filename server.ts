import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Caching mechanism for market data
  let marketCache: any = null;
  let cacheTimestamp: number = 0;
  const CACHE_TTL = 60000; // 60 seconds

  // Proxy for market data to avoid CORS if needed
  app.get("/api/market/trending", async (req, res) => {
    const now = Date.now();
    
    // Serve from cache if valid
    if (marketCache && (now - cacheTimestamp < CACHE_TTL)) {
      return res.json(marketCache);
    }

    const fallback = [
      {
        id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 65432.10, 
        price_change_percentage_24h: 2.5, sparkline_in_7d: { price: Array(168).fill(0).map((_, i) => 60000 + Math.random() * 10000) }
      },
      {
        id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 3456.78, 
        price_change_percentage_24h: -1.2, sparkline_in_7d: { price: Array(168).fill(0).map((_, i) => 3000 + Math.random() * 1000) }
      },
      {
        id: 'solana', symbol: 'sol', name: 'Solana', current_price: 145.67, 
        price_change_percentage_24h: 8.4, sparkline_in_7d: { price: Array(168).fill(0).map((_, i) => 120 + Math.random() * 40) }
      },
      {
        id: 'ripple', symbol: 'xrp', name: 'XRP', current_price: 0.62, 
        price_change_percentage_24h: 1.1, sparkline_in_7d: { price: Array(168).fill(0).map((_, i) => 0.5 + Math.random() * 0.2) }
      },
      {
        id: 'cardano', symbol: 'ada', name: 'Cardano', current_price: 0.45, 
        price_change_percentage_24h: -0.5, sparkline_in_7d: { price: Array(168).fill(0).map((_, i) => 0.4 + Math.random() * 0.1) }
      }
    ];

    try {
      const response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true", {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'NexusTrade/1.0'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const validatedData = data.map(coin => ({
            ...coin,
            sparkline_in_7d: coin.sparkline_in_7d || { price: Array(168).fill(coin.current_price) }
          }));
          marketCache = validatedData;
          cacheTimestamp = now;
          return res.json(validatedData);
        }
      }

      console.warn(`CoinGecko issue (${response.status}). Trying secondary provider...`);
      
      // Secondary Fallback: CryptoCompare (Top by volume)
      const secondaryResponse = await fetch("https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD");
      if (secondaryResponse.ok) {
        const secData = await secondaryResponse.json();
        if (secData.Data && Array.isArray(secData.Data)) {
          const mappedData = secData.Data.map((item: any) => ({
            id: item.CoinInfo.Name.toLowerCase(),
            symbol: item.CoinInfo.Name.toLowerCase(),
            name: item.CoinInfo.FullName,
            current_price: item.RAW?.USD?.PRICE || 0,
            price_change_percentage_24h: item.RAW?.USD?.CHANGEPCT24HOUR || 0,
            sparkline_in_7d: { price: Array(168).fill(item.RAW?.USD?.PRICE || 0) }, // CryptoCompare doesn't give sparklines easily for free
            image: `https://www.cryptocompare.com${item.CoinInfo.ImageUrl}`
          }));
          marketCache = mappedData;
          cacheTimestamp = now;
          return res.json(mappedData);
        }
      }

      // If all APIs fail, use cache or fallback
      if (marketCache) {
        return res.json(marketCache);
      }
      res.json(fallback);
    } catch (error) {
      console.error("Market data fetch CRITICAL failure:", error);
      res.json(marketCache || fallback);
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

