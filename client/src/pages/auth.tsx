import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const AUTH_DISABLED = false; // ✅ Registrazione LIBERA
const REGISTRATION_BLOCKED = false; // ✅ Registrazione LIBERA

type AuthMode = "login" | "register";

interface AuthPageProps {
  onSuccess: () => void;
}

export default function AuthPage({ onSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [registrationEmail, setRegistrationEmail] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [rememberMe, setRememberMe] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const loginMutation = useMutation({
    mutationFn: (data: { email: string; password: string; rememberMe: boolean }) =>
      apiRequest("POST", "/api/login", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me"] });
      toast({ title: "Benvenuto!", description: "Accesso effettuato con successo." });
      onSuccess();
    },
    onError: async (err: any) => {
      const body = await err.response?.json?.() ?? {};
      if (body.pendingVerification) {
        toast({
          title: "Email non confermata",
          description: "Controlla la tua casella di posta e clicca il link di conferma per attivare il tuo account.",
          variant: "destructive",
        });
      } else {
        toast({ title: "Errore", description: body.message || "Credenziali non valide", variant: "destructive" });
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: { fullName: string; username: string; email: string; password: string }) =>
      apiRequest("POST", "/api/register", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me"] });
      toast({ title: "Benvenuto!", description: "Account creato e accesso effettuato con successo." });
      onSuccess();
    },
    onError: async (err: any) => {
      const body = await err.response?.json?.() ?? {};
      toast({ title: "Errore", description: body.message || "Errore nella registrazione", variant: "destructive" });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      toast({ title: "Campi mancanti", description: "Inserisci email e password", variant: "destructive" });
      return;
    }
    loginMutation.mutate({ ...loginForm, rememberMe });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.fullName || !registerForm.username || !registerForm.email || !registerForm.password) {
      toast({ title: "Campi mancanti", description: "Compila tutti i campi", variant: "destructive" });
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      toast({ title: "Errore", description: "Le password non coincidono", variant: "destructive" });
      return;
    }
    if (registerForm.password.length < 6) {
      toast({ title: "Errore", description: "La password deve avere almeno 6 caratteri", variant: "destructive" });
      return;
    }
    const { confirmPassword: _, ...data } = registerForm;
    registerMutation.mutate(data);
  };

  // Schermata "controlla la tua email"
  if (pendingVerification) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-12">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
          <div className="bg-gradient-to-r from-academy-blue to-academy-dark p-8 text-white text-center">
            <div className="text-5xl mb-3">📧</div>
            <h2 className="text-2xl font-bold font-display">Controlla la tua email!</h2>
            <p className="text-sm opacity-80 mt-1">Registrazione quasi completata</p>
          </div>
          <div className="p-8 text-center space-y-5">
            <div className="bg-academy-bg rounded-xl p-5">
              <p className="text-academy-dark font-semibold text-base mb-2">
                Abbiamo inviato un link di conferma a:
              </p>
              <p className="text-academy-blue font-bold text-lg">{registrationEmail}</p>
            </div>
            <div className="text-academy-gray text-sm space-y-2 text-left bg-gray-50 rounded-lg p-4">
              <p className="font-semibold text-academy-dark">Come procedere:</p>
              <p>1. Apri la tua casella di posta</p>
              <p>2. Cerca l'email da <strong>English Academy</strong></p>
              <p>3. Clicca il pulsante <strong>"Conferma la tua iscrizione →"</strong></p>
              <p>4. Verrai reindirizzato al sito e il tuo account sarà attivo</p>
            </div>
            <p className="text-xs text-academy-gray">
              Non hai ricevuto l'email? Controlla la cartella spam.
            </p>
            <button
              onClick={() => { setPendingVerification(false); setMode("login"); }}
              className="w-full py-3 border-2 border-academy-blue text-academy-blue font-semibold rounded-lg hover:bg-academy-blue hover:text-white transition-colors"
            >
              Ho già confermato → Accedi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-academy-blue to-academy-dark p-8 text-white text-center">
          <div className="text-4xl mb-3">⚓</div>
          <h2 className="text-2xl font-bold font-display">English Academy</h2>
          <p className="text-sm opacity-80 mt-1">
            {mode === "login" ? "Accedi al tuo account" : "Crea il tuo account"}
          </p>
        </div>

        {!REGISTRATION_BLOCKED && (
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                mode === "login"
                  ? "text-academy-blue border-b-2 border-academy-blue"
                  : "text-academy-gray hover:text-academy-dark"
              }`}
            >
              Accedi
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                mode === "register"
                  ? "text-academy-blue border-b-2 border-academy-blue"
                  : "text-academy-gray hover:text-academy-dark"
              }`}
            >
              Registrati
            </button>
          </div>
        )}
        
        {REGISTRATION_BLOCKED && (
          <div className="bg-orange-50 border-b-2 border-orange-300 p-4 text-center">
            <p className="text-sm font-semibold text-orange-700">🛑 Registrazione bloccata per 48h</p>
          </div>
        )}

        <div className="p-8">
          {REGISTRATION_BLOCKED && (
            <div className="text-center space-y-4 py-8">
              <div className="text-5xl">🛑</div>
              <h3 className="text-xl font-bold text-academy-dark">Registrazione bloccata</h3>
              <p className="text-academy-gray text-sm">La registrazione è temporaneamente bloccata per 48 ore.</p>
              <p className="text-academy-gray text-xs">Puoi continuare a esplorare il sito oppure torna più tardi per registrarti.</p>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full py-3 bg-academy-blue text-white font-semibold rounded-lg hover:bg-academy-light-blue transition-colors mt-4"
              >
                Torna alla Home
              </button>
            </div>
          )}
          
          {!REGISTRATION_BLOCKED && mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-academy-dark mb-1 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  data-testid="input-email"
                  placeholder="mario@email.it"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  autoComplete="email"
                  name="email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-academy-blue focus:border-transparent transition text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-academy-dark mb-1 uppercase tracking-wide">
                  Password
                </label>
                <input
                  type="password"
                  data-testid="input-password"
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  autoComplete="current-password"
                  name="password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-academy-blue focus:border-transparent transition text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember-me"
                  data-testid="checkbox-ricordami"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-academy-blue accent-academy-blue cursor-pointer"
                />
                <label htmlFor="remember-me" className="text-sm text-academy-gray cursor-pointer select-none">
                  Ricordami per 30 giorni
                </label>
              </div>
              <button
                type="submit"
                data-testid="button-login"
                disabled={loginMutation.isPending || AUTH_DISABLED}
                className="w-full py-3 bg-academy-blue text-white font-semibold rounded-lg hover:bg-academy-light-blue transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {AUTH_DISABLED ? "⏸ Temporaneamente disabilitato" : loginMutation.isPending ? "Accesso in corso..." : "Accedi →"}
              </button>
              {AUTH_DISABLED && (
                <p className="text-center text-sm text-orange-600 font-semibold bg-orange-50 p-2 rounded">
                  Accesso e registrazione disabilitati per 24h. Torna presto!
                </p>
              )}
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-academy-gray font-medium">oppure</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <a
                href="/auth/google"
                data-testid="button-google-login"
                className="flex items-center justify-center gap-3 w-full py-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continua con Google
              </a>
              <p className="text-center text-sm text-academy-gray">
                Non hai un account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="text-academy-blue font-semibold hover:underline"
                >
                  Registrati
                </button>
              </p>
            </form>
          )}
          
          {!REGISTRATION_BLOCKED && mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-academy-dark mb-1 uppercase tracking-wide">
                  Nome e Cognome
                </label>
                <input
                  type="text"
                  data-testid="input-fullname"
                  placeholder="Mario Rossi"
                  value={registerForm.fullName}
                  onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                  autoComplete="name"
                  name="name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-academy-blue focus:border-transparent transition text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-academy-dark mb-1 uppercase tracking-wide">
                  Username
                </label>
                <input
                  type="text"
                  data-testid="input-username"
                  placeholder="mario_rossi"
                  value={registerForm.username}
                  onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                  autoComplete="username"
                  name="username"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-academy-blue focus:border-transparent transition text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-academy-dark mb-1 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  data-testid="input-register-email"
                  placeholder="mario@email.it"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  autoComplete="email"
                  name="email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-academy-blue focus:border-transparent transition text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-academy-dark mb-1 uppercase tracking-wide">
                  Password
                </label>
                <input
                  type="password"
                  data-testid="input-register-password"
                  placeholder="Minimo 6 caratteri"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  autoComplete="new-password"
                  name="password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-academy-blue focus:border-transparent transition text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-academy-dark mb-1 uppercase tracking-wide">
                  Conferma Password
                </label>
                <input
                  type="password"
                  data-testid="input-confirm-password"
                  placeholder="Ripeti la password"
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                  autoComplete="new-password"
                  name="confirm-password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-academy-blue focus:border-transparent transition text-sm"
                />
              </div>
              <button
                type="submit"
                data-testid="button-register"
                disabled={registerMutation.isPending || AUTH_DISABLED}
                className="w-full py-3 bg-academy-blue text-white font-semibold rounded-lg hover:bg-academy-light-blue transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {AUTH_DISABLED ? "⏸ Temporaneamente disabilitato" : registerMutation.isPending ? "Registrazione..." : "Crea Account →"}
              </button>
              {AUTH_DISABLED && (
                <p className="text-center text-sm text-orange-600 font-semibold bg-orange-50 p-2 rounded">
                  Accesso e registrazione disabilitati per 24h. Torna presto!
                </p>
              )}
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-academy-gray font-medium">oppure</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <a
                href="/auth/google"
                data-testid="button-google-register"
                className="flex items-center justify-center gap-3 w-full py-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Registrati con Google
              </a>
              <p className="text-center text-sm text-academy-gray">
                Hai già un account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-academy-blue font-semibold hover:underline"
                >
                  Accedi
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
