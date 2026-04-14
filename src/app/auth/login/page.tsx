"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useState, useEffect, useRef } from "react";
import { ShieldCheck, Lock, Mail, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "../../../../convex/_generated/api";

export default function LoginPage() {
  const { signIn } = useAuthActions();
  const { isAuthenticated } = useConvexAuth();
  const setRole = useMutation(api.users.setRole);
  const user = useQuery(api.users.me);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"admin" | "advisor" | "company">("company");
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Pending role to set after sign-up authenticates
  const pendingRoleRef = useRef<"admin" | "advisor" | "company" | null>(null);

  // Once authenticated and we have a pending role (from signUp), set it and redirect
  useEffect(() => {
    if (isAuthenticated && pendingRoleRef.current) {
      const roleToSet = pendingRoleRef.current;
      pendingRoleRef.current = null;
      setRole({ role: roleToSet })
        .then(() => router.push("/dashboard"))
        .catch((err) => {
          console.error("Failed to set role:", err);
          router.push("/dashboard");
        });
    } else if (isAuthenticated && user && !pendingRoleRef.current) {
      // Already logged in - redirect
      router.push("/dashboard");
    }
  }, [isAuthenticated, user, setRole, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (flow === "signUp") {
        // Store role before signing up so we can set it after auth propagates
        pendingRoleRef.current = selectedRole;
      }
      await signIn("password", { email, password, flow });

      if (flow === "signIn") {
        router.push("/dashboard");
      }
      // For signUp, the useEffect above will handle redirect after setting role
    } catch (err: unknown) {
      pendingRoleRef.current = null;
      console.error("Auth error:", err);
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("already exists") || message.includes("duplicate")) {
        setError("Este correo ya está registrado. Por favor inicia sesión.");
      } else if (message.includes("Invalid password") || message.includes("credentials")) {
        setError("Credenciales inválidas. Por favor intente de nuevo.");
      } else {
        setError(
          flow === "signIn"
            ? "Credenciales inválidas. Por favor intente de nuevo."
            : "El registro falló. Es posible que el correo ya esté en uso."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const switchFlow = () => {
    setFlow(flow === "signIn" ? "signUp" : "signIn");
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 px-6 py-12">
      <div className="max-w-md w-full">
        {/* Logo & Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-blue-600 rounded-2xl mb-5 shadow-xl shadow-blue-300/40">
            <ShieldCheck className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {flow === "signIn" ? "Bienvenido de nuevo" : "Crear una cuenta"}
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            {flow === "signIn"
              ? "Ingrese sus credenciales para acceder al sistema"
              : "Complete los datos para registrarse en la plataforma"}
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-slate-200/60 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  placeholder="ejemplo@correo.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  placeholder="••••••••"
                  required
                  autoComplete={flow === "signIn" ? "current-password" : "new-password"}
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {flow === "signUp" && (
                <p className="text-xs text-slate-400 mt-1.5 ml-1">Mínimo 8 caracteres</p>
              )}
            </div>

            {/* Role selection for sign up */}
            {flow === "signUp" && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Seleccione su Rol
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["company", "advisor", "admin"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSelectedRole(r)}
                      className={`py-2.5 px-1 text-xs font-bold rounded-xl border-2 transition-all ${
                        selectedRole === r
                          ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200"
                          : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      {r === "admin" ? "🔑 Admin" : r === "advisor" ? "👷 Asesor" : "🏢 Empresa"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 text-red-700 rounded-2xl text-sm border border-red-100">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {flow === "signIn" ? "Iniciando sesión..." : "Creando cuenta..."}
                </>
              ) : (
                flow === "signIn" ? "Iniciar Sesión" : "Registrarse"
              )}
            </button>
          </form>

          <div className="mt-7 pt-6 border-t border-slate-100 text-center space-y-3">
            <button
              onClick={switchFlow}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors hover:underline"
            >
              {flow === "signIn"
                ? "¿No tienes cuenta? Regístrate aquí"
                : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
            <p className="text-[10px] text-slate-400">
              Protección SISO SAS — Sistema de Gestión de Seguridad y Salud en el Trabajo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
