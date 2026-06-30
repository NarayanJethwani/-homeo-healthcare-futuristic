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
          }
        } catch (firestoreErr: any) {
          console.warn("Firestore user lookup failed, falling back to custom claims:", firestoreErr?.message || firestoreErr);
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
      setError(err.message || "Authentication failed. Please verify your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-6 py-20 bg-transparent">
      {/* Theme Toggle Button */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={toggleTheme}
          type="button"
          className="p-3 rounded-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 text-[#1A2421] dark:text-slate-100 hover:scale-105 transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center"
          aria-label="Toggle Theme"
        >
          {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </div>

      {/* Decorative gradient backdrops */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-mint/10 via-aqua/5 to-transparent opacity-40 blur-[100px] top-[10%] left-[10%] pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-lavender/5 to-transparent opacity-30 blur-[80px] bottom-[10%] right-[10%] pointer-events-none" />

      <div className="w-full max-w-md z-10 relative">
        {/* Brand Header */}
        <div className="text-center mb-10">
          <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/65 shadow-md mb-4 breathe">
            <Activity className="w-6 h-6 text-mint animate-pulse" />
          </div>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-[#1A2421] dark:text-slate-100">Clinical Hub Login</h2>
          <p className="text-xs text-slate-700 dark:text-slate-400 font-semibold mt-2">Dr. Jethwani&apos;s Professional Portal</p>
        </div>

        {/* Login Glass Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel p-8 rounded-[32px] border-white/60 shadow-[0_20px_50px_rgba(20,184,166,0.03)]"
        >
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-2.5 text-rose-800 text-xs font-semibold leading-relaxed">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
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
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 focus:border-mint focus:ring-1 focus:ring-mint dark:focus:border-mint dark:focus:ring-mint outline-none bg-white/40 dark:bg-slate-950/40 backdrop-blur-sm transition-all duration-300 font-medium text-sm text-[#1A2421] dark:text-slate-100 focus:shadow-[0_0_15px_rgba(20,184,166,0.1)] dark:focus:shadow-[0_0_15px_rgba(20,184,166,0.2)]"
                  required
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-mint transition-colors" />
              </div>
            </div>

            {/* Password Input */}
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
                  className="w-full pl-11 pr-12 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 focus:border-mint focus:ring-1 focus:ring-mint dark:focus:border-mint dark:focus:ring-mint outline-none bg-white/40 dark:bg-slate-950/40 backdrop-blur-sm transition-all duration-300 font-medium text-sm text-[#1A2421] dark:text-slate-100 focus:shadow-[0_0_15px_rgba(20,184,166,0.1)] dark:focus:shadow-[0_0_15px_rgba(20,184,166,0.2)]"
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

            {/* Submit Button */}
            <div className="pt-3">
              <Magnetic>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-mint hover:bg-mint-dark text-white rounded-full font-bold uppercase tracking-wider text-xs shadow-[0_8px_30px_rgba(20,184,166,0.2)] transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  {isLoading ? "Authenticating..." : "Sign In"}
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                </button>
              </Magnetic>
            </div>
          </form>



        </motion.div>
      </div>
    </div>
  );
}
