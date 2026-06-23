import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, ArrowRight, Lock } from "lucide-react";
import { useApp } from "../lib/context";

export default function LoginPage() {
  const { login, isAuthenticated } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Veuillez renseigner tous les champs.");
      return;
    }
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      navigate("/dashboard");
    } else {
      setError("Identifiants incorrects. Réessayez.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(59,130,246,0.10) 0%, transparent 70%)",
        }}
      />
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #3B3B3B 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex w-12 h-12 rounded-xl bg-[#3B82F6] items-center justify-center mb-5">
            <span className="text-white font-bold font-mono text-lg">EB</span>
          </div>
          <h1
            className="text-2xl font-bold text-white tracking-tight mb-1"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            Espace administration
          </h1>
          <p className="text-sm text-[#A1A1AA]">Connexion réservée à Elyas Benyoub</p>
        </div>

        {/* Form card */}
        <div className="bg-[#111111] border border-[#262626] rounded-2xl p-7 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white" style={{ fontFamily: "Manrope, sans-serif" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="elyas@admin.fr"
                autoComplete="email"
                className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-4 py-3 text-sm text-white placeholder-[#4B4B4B] font-mono outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 transition-colors"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white" style={{ fontFamily: "Manrope, sans-serif" }}>
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-4 py-3 pr-12 text-sm text-white placeholder-[#4B4B4B] font-mono outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-white transition-colors"
                  aria-label={showPassword ? "Masquer" : "Afficher"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-500/08 border border-red-500/25 rounded-lg px-3 py-2.5">
                <Lock size={13} className="text-red-400 flex-shrink-0" />
                <p className="text-xs text-red-400 font-mono">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#3B82F6] text-white py-3 rounded-lg font-semibold text-sm hover:bg-[#2563EB] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connexion...
                </>
              ) : (
                <>
                  Se connecter
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Hint */}
        <p className="text-center text-xs text-[#4B4B4B] font-mono mt-6">
          demo: elyas@admin.fr / admin
        </p>
      </div>
    </div>
  );
}
