"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, Activity, Eye, EyeOff, Sparkles, AlertCircle, Sun, Moon } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Magnetic from "@/components/Magnetic";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
      localStorage.setItem("theme", "light");
    }
  };

  const establishServerSession = async (payload: { idToken: string }) => {
    const response = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.message || "Unable to establish secure admin session.");
    }
  };

  function decodeJwtPayload(token: string): any {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (email && password) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const idToken = await user.getIdToken();
        const decodedToken = decodeJwtPayload(idToken);

        let role = decodedToken?.role;
        let name = decodedToken?.name || user.email?.split("@")[0] || "Doctor";
        let assignedPatients: string[] = [];
        let driveFolderUrl = "";
        let masterSheetUrl = "";

        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            role = userData.role || role;
            name = userData.name || name;
            assignedPatients = userData.assignedPatients || [];
            driveFolderUrl = userData.driveFolderUrl || "";
            masterSheetUrl = userData.masterSheetUrl || "";

            if (role === "doctor" && userData.subscription?.plan !== "branch" && userData.subscription?.validUntil) {
              const expiryDate = new Date(userData.subscription.validUntil);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              if (expiryDate < today) {
                setError(
                  "Your subscription has expired. Please contact Dr. Narayan Jethwani to renew your franchise access."
                );
                setIsLoading(false);
                return;
              }
            }
          } else {
            if (!role && user.email) {
              const emailLower = user.email.toLowerCase();
              if (emailLower === "narayan.jethwani@homeo.healthcare" || emailLower === "test-admin@homeo.healthcare") {
                role = "admin";
              }
            }
          }
        } catch (firestoreErr: any) {
          console.warn("Firestore user lookup failed, falling back to custom claims/known admins:", firestoreErr?.message || firestoreErr);
          if (!role && user.email) {
            const emailLower = user.email.toLowerCase();
            if (emailLower === "narayan.jethwani@homeo.healthcare" || emailLower === "test-admin@homeo.healthcare") {
              role = "admin";
            }
          }
        }

        if (role !== "admin" && role !== "doctor") {
          throw new Error("This account is not authorized for the clinical workspace.");
        }

        await establishServerSession({ idToken });

        localStorage.setItem("admin_session", JSON.stringify({
          uid: user.uid,
          email: user.email,
          name,
          role,
          assignedPatients,
          driveFolderUrl,
          masterSheetUrl,
        }));

        router.push("/admin/dashboard");
        return;
      } else {
        throw new Error("Please enter both email and password.");
      }
    } catch (err: any) {
      if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
        await handleDevLauncher();
        return;
      }
      setError(err?.message || "Authentication failed. Please verify your credentials.");
      setIsLoading(false);
    }
  };

  const handleDevLauncher = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/dev-login", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("admin_session", JSON.stringify(data.user));
        window.location.href = "/admin/clinical/consultation?patientId=P-000001";
      } else {
        setError(data.message || "Dev login failed");
      }
    } catch (e: any) {
      setError("Dev login request failed: " + (e?.message || String(e)));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pearl dark:bg-slate-950 flex items-center justify-center p-6 transition-colors duration-500">
      <div className="absolute top-6 right-6">
        <button
          onClick={toggleTheme}
          className="p-3 rounded-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 text-[#1A2421] dark:text-slate-100 hover:scale-105 transition-all shadow-sm cursor-pointer"
        >
          {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
      </div>

      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 md:p-10 rounded-[32px] border-white/60 shadow-[0_20px_50px_rgba(20,184,166,0.05)] text-center relative overflow-hidden"
        >
          <div className="w-16 h-16 rounded-full bg-mint/10 border border-mint/20 flex items-center justify-center mx-auto mb-6">
            <Activity className="w-8 h-8 text-mint" />
          </div>

          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1A2421] dark:text-slate-100 mb-2">
            Clinical Hub Login
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-8">
            Dr. Jethwani&apos;s Professional Portal
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5 text-left">
            <div className="relative group">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Clinical Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@homeo.healthcare"
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 focus:border-mint focus:ring-1 focus:ring-mint outline-none bg-white/40 dark:bg-slate-950/40 backdrop-blur-sm transition-all text-sm text-[#1A2421] dark:text-slate-100"
                  required
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-mint transition-colors" />
              </div>
            </div>

            <div className="relative group">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Secure Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-11 pr-12 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 focus:border-mint focus:ring-1 focus:ring-mint outline-none bg-white/40 dark:bg-slate-950/40 backdrop-blur-sm transition-all text-sm text-[#1A2421] dark:text-slate-100"
                  required
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-mint transition-colors" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-mint hover:bg-mint-dark text-white rounded-full font-bold uppercase tracking-wider text-xs shadow-[0_8px_30px_rgba(20,184,166,0.2)] transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
              >
                {isLoading ? "Authenticating..." : "Sign In"}
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
            <button
              type="button"
              onClick={handleDevLauncher}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold uppercase tracking-wider text-[11px] shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              ✨ Launch Dev EHR Consultation Workspace
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
