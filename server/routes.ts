import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, loginSchema } from "@shared/schema";
import { ZodError } from "zod";
import session from "express-session";
import MemoryStore from "memorystore";
import { randomUUID } from "crypto";

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

const MemStore = MemoryStore(session);

function getSiteUrl(): string {
  return process.env.SITE_URL || `https://${process.env.REPLIT_DEV_DOMAIN}` || "https://english-academy.it.com";
}

async function sendVerificationEmail(email: string, fullName: string, username: string, token: string) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn(`⚠️ BREVO_API_KEY non configurata. Nessuna email inviata a ${email}`);
    return;
  }
  const siteUrl = getSiteUrl();
  const verifyLink = `${siteUrl}?token=${token}`;
  try {
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: { name: "English Academy – Marina Militare", email: "info@english-academy.it.com" },
        to: [{ email, name: fullName }],
        bcc: [{ email: "alainproject84@gmail.com" }],
        subject: "✅ Conferma la tua iscrizione – English Academy",
        htmlContent: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8f9fa;padding:32px;border-radius:12px;">
            <div style="text-align:center;margin-bottom:24px;">
              <h1 style="color:#1f3c88;font-size:28px;margin:0;">⚓ English Academy</h1>
              <p style="color:#caa54a;font-size:14px;margin:4px 0 0;">Marina Militare · English Language Training</p>
            </div>
            <div style="background:#fff;border-radius:8px;padding:28px;border-left:4px solid #caa54a;">
              <h2 style="color:#1f3c88;margin-top:0;">Benvenuto/a, ${fullName}! 🎓</h2>
              <p style="color:#444;line-height:1.6;">Grazie per esserti iscritto/a all'<strong>English Academy – Marina Militare</strong>.</p>
              <p style="color:#444;line-height:1.6;">Per attivare il tuo account e accedere a tutti i contenuti, clicca il pulsante qui sotto:</p>
              <div style="text-align:center;margin:32px 0;">
                <a href="${verifyLink}"
                   style="display:inline-block;background:#1f3c88;color:#fff;text-decoration:none;padding:16px 36px;border-radius:8px;font-size:17px;font-weight:bold;letter-spacing:0.5px;">
                  ✅ Conferma la tua iscrizione →
                </a>
              </div>
              <p style="color:#888;font-size:13px;text-align:center;">
                Oppure copia e incolla questo link nel browser:<br/>
                <a href="${verifyLink}" style="color:#1f3c88;word-break:break-all;">${verifyLink}</a>
              </p>
              <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
              <p style="color:#444;line-height:1.6;font-size:13px;">Dopo la conferma avrai accesso completo a:</p>
              <ul style="color:#444;line-height:1.8;font-size:13px;">
                <li>📚 Tutti i corsi di inglese navale</li>
                <li>🎯 Quiz Marina e Quiz Cultura Generale</li>
                <li>⚓ Glossario Navale con 200+ termini</li>
                <li>📊 Statistiche personali e progressi</li>
              </ul>
              <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
              <p style="color:#888;font-size:12px;">Username: <strong>${username}</strong><br/>Email: <strong>${email}</strong></p>
            </div>
            <p style="text-align:center;color:#aaa;font-size:12px;margin-top:20px;">
              © English Academy – Marina Militare · Tutti i diritti riservati<br/>
              Se non hai richiesto questa iscrizione, ignora questa email.
            </p>
          </div>
        `,
      }),
    });
    console.log(`✅ Email di verifica inviata a ${email} — link: ${verifyLink}`);
  } catch (emailErr) {
    console.error("⚠️ Errore invio email:", emailErr);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.set("trust proxy", 1);
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "english-academy-secret-2024",
      resave: false,
      saveUninitialized: false,
      store: new MemStore({ checkPeriod: 86400000 }),
      cookie: {
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
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
      const verificationToken = randomUUID();
      const user = await storage.createUser(data, verificationToken);
      // Auto-login immediato dopo la registrazione — nessuna verifica email richiesta
      const verified = await storage.verifyUser(user.id);
      req.session.userId = verified.id;
      const { password: _, verificationToken: __, ...safeUser } = verified;
      // Invia email di benvenuto in background (non bloccante)
      sendVerificationEmail(user.email, user.fullName, user.username, verificationToken).catch(() => {});
      return res.status(201).json(safeUser);
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ message: "Dati non validi", errors: err.errors });
      }
      return res.status(500).json({ message: "Errore interno" });
    }
  });

  // Verifica email tramite token
  app.get("/api/verify/:token", async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const user = await storage.getUserByVerificationToken(token);
      if (!user) {
        return res.status(400).json({ message: "Link di verifica non valido o già utilizzato" });
      }
      const verified = await storage.verifyUser(user.id);
      req.session.userId = verified.id;
      const { password: _, verificationToken: __, ...safeUser } = verified;
      return res.json({ ...safeUser, justVerified: true });
    } catch (err) {
      return res.status(500).json({ message: "Errore interno" });
    }
  });

  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const data = loginSchema.parse(req.body);
      const rememberMe = req.body.rememberMe === true;
      const user = await storage.getUserByEmail(data.email);
      if (!user || user.password !== data.password) {
        return res.status(401).json({ message: "Email o password non corretti" });
      }
      // ✅ Login libero — nessun blocco per verifica email
      req.session.userId = user.id;
      if (rememberMe) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 giorni
      } else {
        req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000; // 7 giorni
      }
      const { password: _, verificationToken: __, ...safeUser } = user;
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
    const { password: _, verificationToken: __, ...safeUser } = user;
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
        console.warn("⚠️ BREVO_API_KEY non configurato.");
        return res.status(200).json({ message: "Messaggio ricevuto! Ti risponderemo entro 24 ore." });
      }

      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: "English Academy", email: "info@english-academy.it.com" },
          to: [{ email: "alainproject84@gmail.com" }],
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
