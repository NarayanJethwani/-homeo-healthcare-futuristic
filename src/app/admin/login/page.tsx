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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1. Firebase Auth Attempt
      if (email && password) {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;

          // Fetch user role from Firestore
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          let role = "doctor";
          let name = user.email?.split("@")[0] || "Doctor";
          let assignedPatients: string[] = [];

          if (userDoc.exists()) {
            const data = userDoc.data();
            role = data.role || "doctor";
            name = data.name || name;
            assignedPatients = data.assignedPatients || [];

            // ── Subscription expiry check (doctors only) ──────────────────
            if (role === "doctor" && data.subscription?.plan !== "branch" && data.subscription?.validUntil) {
              const expiryDate = new Date(data.subscription.validUntil);
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

          // Save session details in localStorage for quick client access
          const userData = userDoc.exists() ? userDoc.data() : {};
          localStorage.setItem("admin_session", JSON.stringify({
            uid: user.uid,
            email: user.email,
            name,
            role,
            assignedPatients,
            // Doctor workspace links (used in dashboard)
            driveFolderUrl: userData?.driveFolderUrl || "",
            masterSheetUrl: userData?.masterSheetUrl || "",
          }));

          router.push("/admin/dashboard");
          return;

        } catch (firebaseErr: any) {
          console.warn("Firebase Auth failed, checking for local credential bypass...", firebaseErr.message);
          
          // Fallback bypass: If Firebase configuration is mock/default, check simple matching credentials for testing
          if (
            process.env.NODE_ENV === "development" && (
              (email === "admin@homeo.healthcare" && password === "Admin@123") ||
              (email === "doctor@homeo.healthcare" && password === "Doctor@123")
            )
          ) {
            const isAdm = email.startsWith("admin");
            localStorage.setItem("admin_session", JSON.stringify({
              uid: isAdm ? "admin-bypass-id" : "doctor-bypass-id",
              email,
              name: isAdm ? "Dr. Narayan Jethwani" : "Dr. Sarah (Junior)",
              role: isAdm ? "admin" : "doctor",
              assignedPatients: isAdm ? [] : ["P-882910", "P-339281"]
            }));
            router.push("/admin/dashboard");
            return;
          }

          throw new Error(firebaseErr.message || "Invalid credentials");
        }
      } else {
        throw new Error("Please enter both email and password.");
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please verify your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to quickly log in with mock credentials during development
  const handleMockBypass = (role: "admin" | "doctor") => {
    if (process.env.NODE_ENV !== "development") return;
    setIsLoading(true);
    setTimeout(() => {
      if (role === "admin") {
        localStorage.setItem("admin_session", JSON.stringify({
          uid: "admin-bypass-id",
          email: "admin@homeo.healthcare",
          name: "Dr. Narayan Jethwani",
          role: "admin",
          assignedPatients: []
        }));
      } else {
        localStorage.setItem("admin_session", JSON.stringify({
          uid: "doctor-bypass-id",
          email: "doctor@homeo.healthcare",
          name: "Dr. Sarah (Junior)",
          role: "doctor",
          assignedPatients: ["P-100234", "P-200567"] // mock assigned patient IDs
        }));
      }
      setIsLoading(false);
      router.push("/admin/dashboard");
    }, 800);
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

          {/* Quick-Access Demo Accounts Section */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-8 border-t border-slate-900/5 dark:border-slate-800/60 pt-6 text-center">
              <span className="text-[10px] text-slate-700 dark:text-slate-400 font-bold uppercase tracking-wider block mb-4">
                Demo Access / Developer Mode
              </span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleMockBypass("admin")}
                  className="flex-1 py-2 px-3 border border-slate-200 dark:border-slate-800 hover:border-mint hover:bg-mint/5 dark:hover:bg-mint/10 rounded-xl text-[10px] font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                >
                  Log as Admin (Jethwani)
                </button>
                <button
                  type="button"
                  onClick={() => handleMockBypass("doctor")}
                  className="flex-1 py-2 px-3 border border-slate-200 dark:border-slate-800 hover:border-mint hover:bg-mint/5 dark:hover:bg-mint/10 rounded-xl text-[10px] font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                >
                  Log as Junior Doctor
                </button>
              </div>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium mt-3 leading-normal">
                Bypasses real OAuth validation when credentials match standard email and password format.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
