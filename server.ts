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
  app.get("/api/health", async (req, res) => {
    try {
      const { isJavaAvailable } = await import("./src/lib/net-jakedot-java-wrapper.ts");
      const java = await isJavaAvailable();
      res.json({ status: "ok", java });
    } catch (err) {
      res.json({ status: "ok", java: false });
    }
  });

  // Proxy for Wherigo cartridges
  app.get("/api/cartridge/:id", (req, res) => {
    // This could be used to fetch a cartridge from a database
    res.json({ id: req.params.id, name: "Sample Cartridge" });
  });

  app.post("/api/jourwigo/run", async (req, res) => {
    const { args } = req.body;
    // Default path for the jourwigo JAR if it were built
    const jarPath = path.join(process.cwd(), "jourwigo-java/build/libs/jourwigo.jar");
    try {
      const { runJar } = await import("./src/lib/net-jakedot-java-wrapper.ts");
      const result = await runJar(jarPath, args || []);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/run-java", async (req, res) => {
    const { jarPath, args } = req.body;
    try {
      const { runJar } = await import("./src/lib/net-jakedot-java-wrapper.ts");
      const result = await runJar(jarPath, args);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
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
