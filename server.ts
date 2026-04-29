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

  // Proxy for market data to avoid CORS if needed
  app.get("/api/market/trending", async (req, res) => {
    try {
      const response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true");
      if (!response.ok) throw new Error(`CoinGecko spoke: ${response.status}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Market data fetch failed, using fallback:", error);
      // Fallback data for demo stability
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
        }
      ];
      res.json(fallback);
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
