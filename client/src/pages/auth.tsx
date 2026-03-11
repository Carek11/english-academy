import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthMode = "login" | "register";

interface AuthPageProps {
  onSuccess: () => void;
}

export default function AuthPage({ onSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const loginMutation = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      apiRequest("POST", "/api/login", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me"] });
      toast({ title: "Benvenuto!", description: "Accesso effettuato con successo." });
      onSuccess();
    },
    onError: async (err: any) => {
      const body = await err.response?.json?.() ?? {};
      toast({ title: "Errore", description: body.message || "Credenziali non valide", variant: "destructive" });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: { fullName: string; username: string; email: string; password: string }) =>
      apiRequest("POST", "/api/register", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me"] });
      toast({ title: "Registrazione completata!", description: "Il tuo account è stato creato." });
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
    loginMutation.mutate(loginForm);
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

        <div className="p-8">
          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-academy-dark mb-1 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="mario@email.it"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-academy-blue focus:border-transparent transition text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-academy-dark mb-1 uppercase tracking-wide">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-academy-blue focus:border-transparent transition text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full py-3 bg-academy-blue text-white font-semibold rounded-lg hover:bg-academy-light-blue transition-colors disabled:opacity-60"
              >
                {loginMutation.isPending ? "Accesso in corso..." : "Accedi →"}
              </button>
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
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-academy-dark mb-1 uppercase tracking-wide">
                  Nome e Cognome
                </label>
                <input
                  type="text"
                  placeholder="Mario Rossi"
                  value={registerForm.fullName}
                  onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-academy-blue focus:border-transparent transition text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-academy-dark mb-1 uppercase tracking-wide">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="mario_rossi"
                  value={registerForm.username}
                  onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-academy-blue focus:border-transparent transition text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-academy-dark mb-1 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="mario@email.it"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-academy-blue focus:border-transparent transition text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-academy-dark mb-1 uppercase tracking-wide">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Minimo 6 caratteri"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-academy-blue focus:border-transparent transition text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-academy-dark mb-1 uppercase tracking-wide">
                  Conferma Password
                </label>
                <input
                  type="password"
                  placeholder="Ripeti la password"
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-academy-blue focus:border-transparent transition text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full py-3 bg-academy-blue text-white font-semibold rounded-lg hover:bg-academy-light-blue transition-colors disabled:opacity-60"
              >
                {registerMutation.isPending ? "Registrazione..." : "Crea Account →"}
              </button>
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
