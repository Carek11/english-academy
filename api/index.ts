import { app, initApp } from "../server/index";
import type { IncomingMessage, ServerResponse } from "http";

let initialized = false;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const url = (req as any).url || "";

  // Health check - runs BEFORE initApp
  if (url.startsWith("/api/_health")) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      ok: true,
      VERCEL: process.env.VERCEL || null,
      NODE_ENV: process.env.NODE_ENV,
      HAS_DB: !!process.env.DATABASE_URL,
    }));
    return;
  }

  try {
    if (!initialized) {
      console.log("[initApp] starting...");
      await initApp();
      initialized = true;
      console.log("[initApp] done");
    }
    app(req as any, res as any);
  } catch (err: any) {
    console.error("[handler] error:", err?.message, err?.stack?.substring?.(0, 500));
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err?.message || "Internal Server Error" }));
    }
  }
}
