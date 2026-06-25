import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useFetch, { type LoginResponse } from "../hooks/apiFetch";
import useAuth from "../hooks/useAuth";

const loginSchema = z.object({
  email: z.email({ message: "Email invalide" }),
  password: z.string().min(4, "Le mot de passe doit contenir au moins 4 caractères"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const { apiFetch, isLoading } = useFetch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  if (isAuthenticated) {
    navigate("/admin", { replace: true });
    return null;
  }

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }) as LoginResponse;

      login(result.token);
      toast.success("Connexion réussie");
      navigate("/admin");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Une erreur inconnue est survenue");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4 relative overflow-hidden w-full">
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-white" style={{ fontFamily: "Manrope, sans-serif" }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                placeholder="elyas@admin.fr"
                autoComplete="email"
                aria-invalid={!!errors.email}
                className={`w-full bg-[#0A0A0A] border rounded-lg px-4 py-3 text-sm text-white placeholder-[#4B4B4B] font-mono outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 transition-colors ${errors.email ? "border-red-500/50" : "border-[#262626]"}`}
              />
              {errors.email && <p role="alert" className="text-xs text-red-400 font-mono">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-white" style={{ fontFamily: "Manrope, sans-serif" }}>
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  className={`w-full bg-[#0A0A0A] border rounded-lg px-4 py-3 pr-12 text-sm text-white placeholder-[#4B4B4B] font-mono outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 transition-colors ${errors.password ? "border-red-500/50" : "border-[#262626]"}`}
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
              {errors.password && <p role="alert" className="text-xs text-red-400 font-mono">{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#3B82F6] text-white py-3 rounded-lg font-semibold text-sm hover:bg-[#2563EB] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              {isLoading ? (
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
          Email admin ou ESGI requis.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
