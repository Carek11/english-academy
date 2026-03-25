import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, loginSchema } from "@shared/schema";
import { ZodError } from "zod";
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";
import { randomUUID } from "crypto";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { registerHealthCheck } from "./health";

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

const PgStore = ConnectPgSimple(session);

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

  registerHealthCheck(app);

  const sessionStore = process.env.VERCEL
    ? undefined
    : new PgStore({ conString: process.env.DATABASE_URL, createTableIfMissing: true });

  app.use(
    session({
      secret: process.env.SESSION_SECRET || "english-academy-secret-2024",
      resave: false,
      saveUninitialized: false,
      ...(sessionStore ? { store: sessionStore } : {}),
      cookie: {
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    })
  );

  // ─── Google OAuth ───────────────────────────────────────────────────
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

  if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
    const siteUrl = getSiteUrl();
    const callbackURL = process.env.GOOGLE_CALLBACK_URL || `${siteUrl}/auth/google/callback`;

    passport.use(new GoogleStrategy(
      { clientID: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET, callbackURL },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const googleId = profile.id;
          const email = profile.emails?.[0]?.value ?? "";
          const fullName = profile.displayName ?? "Utente Google";
          const avatarUrl = profile.photos?.[0]?.value ?? undefined;
          let user = await storage.getUserByGoogleId(googleId);
          if (!user && email) {
            user = await storage.getUserByEmail(email);
          }
          if (!user) {
            user = await storage.createUserFromGoogle({ googleId, email, fullName, avatarUrl });
          }
          return done(null, user);
        } catch (err) {
          return done(err as Error);
        }
      }
    ));

    passport.serializeUser((user: any, done) => done(null, user.id));
    passport.deserializeUser(async (id: string, done) => {
      const user = await storage.getUser(id);
      done(null, user ?? false);
    });

    app.use(passport.initialize());
    app.use(passport.session());

    app.get("/auth/google",
      passport.authenticate("google", { scope: ["profile", "email"] })
    );

    app.get("/auth/google/callback",
      passport.authenticate("google", { failureRedirect: "/?authError=1" }),
      (req: Request, res: Response) => {
        if (req.user) {
          req.session.userId = (req.user as any).id;
        }
        res.redirect("/?googleLogin=1");
      }
    );
  } else {
    console.warn("⚠️ GOOGLE_CLIENT_ID o GOOGLE_CLIENT_SECRET mancanti — Google OAuth disabilitato");
  }
  // ────────────────────────────────────────────────────────────────────

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
      const token = req.params.token as string;
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

  // ─── Traduzione endpoint ───────────────────────────────────────────────────
  app.post("/api/translate", async (req, res) => {
    try {
      let { text } = req.body;
      if (!text || typeof text !== "string") {
        return res.json({ success: false, translation: "" });
      }

      text = text.trim().slice(0, 500);
      if (!text) {
        return res.json({ success: false, translation: "" });
      }

      // Usa Google Translate gratuito via endpoint pubblico
      const apiUrl = "https://translate.googleapis.com/translate_a/element.js?callbacks=googleTranslateElementInit";
      
      const encodedText = encodeURIComponent(text);
      const translateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=it&dt=t&q=${encodedText}`;

      const response = await fetch(translateUrl, {
        signal: AbortSignal.timeout(5000),
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      if (!response.ok) {
        return res.json({ success: true, translation: text });
      }

      const result = await response.json();
      
      // Google Translate API response: [[["traduzione", "originale", null, null, 0]...]...]
      const translatedText = result?.[0]?.[0]?.[0];

      if (translatedText && translatedText !== text && translatedText) {
        return res.json({
          success: true,
          translation: translatedText,
        });
      }

      // Fallback to original text
      return res.json({
        success: true,
        translation: text,
      });
    } catch (err) {
      console.error("Errore traduzione:", err);
      return res.json({
        success: true,
        translation: req.body.text || "",
      });
    }
  });

  // ========== PAYPAL ENDPOINTS ==========
  const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || "";
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET || "";
  const PAYPAL_API_URL = "https://api-m.paypal.com"; // Usa sandbox se in dev

  async function getPaypalAccessToken(): Promise<string> {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");
    const res = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    const data = (await res.json()) as { access_token: string };
    return data.access_token;
  }

  // Crea ordine PayPal
  app.post("/api/paypal/create-order", async (req: Request, res: Response) => {
    if (!req.user?.id) return res.status(401).json({ error: "Non autenticato" });

    try {
      const token = await getPaypalAccessToken();
      const order = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "EUR",
                value: "4.99", // €4.99 per mese
              },
              description: "English Academy Premium - 1 mese",
            },
          ],
          application_context: {
            brand_name: "English Academy",
            locale: "it-IT",
            user_action: "PAY_NOW",
            return_url: `${getSiteUrl()}/premium?success=true`,
            cancel_url: `${getSiteUrl()}/premium?success=false`,
          },
        }),
      });

      const orderData = (await order.json()) as { id: string };
      return res.json({ orderId: orderData.id });
    } catch (err) {
      console.error("Errore PayPal create:", err);
      return res.status(500).json({ error: "Errore creazione ordine" });
    }
  });

  // Cattura pagamento PayPal
  app.post("/api/paypal/capture-order", async (req: Request, res: Response) => {
    if (!req.user?.id) return res.status(401).json({ error: "Non autenticato" });

    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ error: "orderId mancante" });

    try {
      const token = await getPaypalAccessToken();
      const capture = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const captureData = (await capture.json()) as { 
        status: string; 
        id: string;
        purchase_units: Array<{ payments: { captures: Array<{ status: string }> } }>
      };

      if (captureData.status === "COMPLETED") {
        // Salva subscription nel DB
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1); // Premium per 1 mese

        const subscription = await storage.createSubscription({
          userId: req.user.id,
          paypalOrderId: orderId,
          status: "COMPLETED",
          amount: "4.99",
          expiresAt,
        });

        // Aggiorna user come premium
        await storage.setUserPremium(req.user.id, expiresAt);

        return res.json({ 
          success: true, 
          message: "Pagamento completato!",
          expiresAt 
        });
      }

      return res.status(400).json({ error: "Pagamento non completato" });
    } catch (err) {
      console.error("Errore PayPal capture:", err);
      return res.status(500).json({ error: "Errore cattura pagamento" });
    }
  });

  // Verifica stato premium
  app.get("/api/user/premium", async (req: Request, res: Response) => {
    if (!req.user?.id) return res.status(401).json({ error: "Non autenticato" });

    try {
      const user = await storage.getUser(req.user.id);
      if (!user) return res.status(404).json({ error: "Utente non trovato" });

      // Se premium è scaduto, aggiorna
      if (user.isPremium && user.premiumExpiresAt && new Date(user.premiumExpiresAt) < new Date()) {
        const updatedUser = await storage.setUserPremium(user.id, new Date()); // Scaduto
        return res.json({
          isPremium: false,
          expiresAt: null,
        });
      }

      return res.json({
        isPremium: user.isPremium || false,
        expiresAt: user.premiumExpiresAt,
      });
    } catch (err) {
      console.error("Errore verifica premium:", err);
      return res.status(500).json({ error: "Errore" });
    }
  });

  // Cancella abbonamento premium
  app.post("/api/user/cancel-premium", async (req: Request, res: Response) => {
    if (!req.user?.id) return res.status(401).json({ error: "Non autenticato" });

    try {
      const user = await storage.getUser(req.user.id);
      if (!user) return res.status(404).json({ error: "Utente non trovato" });

      // Imposta premium a false
      await storage.setUserPremium(user.id, new Date());
      
      return res.json({ success: true, message: "Abbonamento cancellato" });
    } catch (err) {
      console.error("Errore cancellazione premium:", err);
      return res.status(500).json({ error: "Errore nella cancellazione" });
    }
  });

  // Traduzione - integrazione con MyMemory API (open source)
  app.post("/api/translate", async (req: Request, res: Response) => {
    const { text, langFrom = "en", langTo = "it" } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Testo richiesto" });
    }

    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langFrom}|${langTo}`
      );
      
      if (!response.ok) throw new Error("MyMemory API error");
      
      const data = (await response.json()) as { responseData?: { translatedText?: string }; responseStatus?: number };
      
      if (data.responseStatus === 200 && data.responseData?.translatedText) {
        return res.json({ translation: data.responseData.translatedText });
      }
      
      return res.status(400).json({ error: "Traduzione non disponibile" });
    } catch (err) {
      console.error("Errore traduzione:", err);
      return res.status(500).json({ error: "Errore nel servizio di traduzione" });
    }
  });

  return httpServer;
}
