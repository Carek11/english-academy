import type { Request, Response } from "express";
import { app, initApp } from "./index";

let initialized = false;

module.exports = async function handler(req: Request, res: Response) {
  if (!initialized) {
    await initApp();
    initialized = true;
  }
  app(req, res);
};
