import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // Search multiple possible locations depending on runtime environment
  const candidates = [
    path.resolve(__dirname, "public"),           // Replit: dist/index.cjs -> dist/public
    path.resolve(process.cwd(), "dist/public"),  // Vercel: api/index.ts -> dist/public
    path.resolve(__dirname, "../dist/public"),   // fallback
  ];

  const distPath = candidates.find((p) => fs.existsSync(p));

  if (!distPath) {
    throw new Error(
      `Could not find the build directory. Searched: ${candidates.join(", ")}. Make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("/{*path}", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
