import type { Express } from "express";

export function registerHealthCheck(app: Express): void {
  app.get("/api/_health", (req, res) => {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
    });
  });

  app.get("/api/v1/status", (req, res) => {
    res.status(200).json({
      service: "English Academy API",
      version: "1.0.0",
      status: "operational",
      timestamp: new Date().toISOString(),
    });
  });
}
