import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, loginSchema } from "@shared/schema";
import { ZodError } from "zod";
import session from "express-session";
import MemoryStore from "memorystore";

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

const MemStore = MemoryStore(session);

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "english-academy-secret-2024",
      resave: false,
      saveUninitialized: false,
      store: new MemStore({ checkPeriod: 86400000 }),
      cookie: { secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 },
    })
  );

  app.post("/api/register", async (req: Request, res: Response) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const existingEmail = await storage.getUserByEmail(data.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email già registrata" });
      }
      const existingUsername = await storage.getUserByUsername(data.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username già in uso" });
      }
      const user = await storage.createUser(data);
      req.session.userId = user.id;
      const { password: _, ...safeUser } = user;
      return res.status(201).json(safeUser);
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ message: "Dati non validi", errors: err.errors });
      }
      return res.status(500).json({ message: "Errore interno" });
    }
  });

  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const data = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(data.email);
      if (!user || user.password !== data.password) {
        return res.status(401).json({ message: "Email o password non corretti" });
      }
      req.session.userId = user.id;
      const { password: _, ...safeUser } = user;
      return res.json(safeUser);
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ message: "Dati non validi" });
      }
      return res.status(500).json({ message: "Errore interno" });
    }
  });

  app.post("/api/logout", (req: Request, res: Response) => {
    req.session.destroy(() => {
      res.json({ message: "Disconnesso" });
    });
  });

  app.get("/api/me", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Non autenticato" });
    }
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "Utente non trovato" });
    }
    const { password: _, ...safeUser } = user;
    return res.json(safeUser);
  });

  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const { name, email, course, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ message: "Campi obbligatori mancanti" });
      }

      const apiKey = process.env.BREVO_API_KEY;
      if (!apiKey) {
        console.warn("⚠️ BREVO_API_KEY non configurato. Messaggio loggato localmente.");
        console.log(`📧 Messaggio ricevuto:\n- Nome: ${name}\n- Email: ${email}\n- Corso: ${course}\n- Messaggio: ${message}`);
        return res.status(200).json({ message: "Messaggio ricevuto! Ti risponderemo entro 24 ore." });
      }

      // Invia email via Brevo
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: "English Academy", email: "noreply@englishacademy.it" },
          to: [{ email: "info@englishacademy.it" }],
          subject: `Nuovo messaggio da ${name}`,
          htmlContent: `
            <h2>Nuovo messaggio da contatti</h2>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Corso di interesse:</strong> ${course}</p>
            <p><strong>Messaggio:</strong></p>
            <p>${message.replace(/\n/g, "<br>")}</p>
          `,
          replyTo: { email: email },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Errore Brevo:", error);
        return res.status(500).json({ message: "Errore nell'invio dell'email" });
      }

      console.log(`✅ Email inviata via Brevo da ${email}`);
      return res.status(200).json({ message: "Messaggio ricevuto! Ti risponderemo entro 24 ore." });
    } catch (err) {
      console.error("Errore durante l'invio:", err);
      return res.status(500).json({ message: "Errore nella spedizione del messaggio" });
    }
  });

  return httpServer;
}
