"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, Activity, Eye, EyeOff, Sparkles, AlertCircle, Sun, Moon, User } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Magnetic from "@/components/Magnetic";
import AccessSupport from "@/components/access/AccessSupport";
import Link from "next/link";

export default function PatientLogin() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
    if (new URLSearchParams(window.location.search).get("mode") === "signup") {
      setActiveTab("signup");
    }
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
    const response = await fetch("/api/patient/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.message || "Unable to establish secure patient session.");
    }
    return response.json();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      if (email && password) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Check if user is patient
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        let patientId = "";
        let userName = name || user.email?.split("@")[0] || "Patient";

        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.role !== "patient") {
            throw new Error("This account is registered under a clinic professional role. Please use the Clinical Hub.");
          }
          patientId = userData.patientId || "";
          userName = userData.name || userName;
        } else {
          // Auto-migrate/create user profile in Firestore if they are authenticated but profile missing
          await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            name: userName,
            role: "patient",
            patientId: "",
            createdAt: new Date().toISOString()
          });
        }

        const idToken = await user.getIdToken();
        const sessionRes = await establishServerSession({ idToken });

        localStorage.setItem("patient_session", JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: userName,
          role: "patient",
          patientId: sessionRes.patientId || patientId
        }));

        setSuccessMsg("Authenticated successfully! Loading your dashboard...");
        setTimeout(() => {
          router.push("/patient/dashboard");
        }, 1500);
      } else {
        throw new Error("Please enter both email and password.");
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please check your credentials.");
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      if (email && password && name) {
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create user document in Firestore
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          name: name,
          role: "patient",
          patientId: "", // Pending manual link step
          createdAt: new Date().toISOString()
        });

        // Set session
        const idToken = await user.getIdToken();
        await establishServerSession({ idToken });

        localStorage.setItem("patient_session", JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: name,
          role: "patient",
          patientId: ""
        }));

        setSuccessMsg("Registration successful! Portal account created (Pending Link). Redirecting...");
        setTimeout(() => {
          router.push("/patient/dashboard");
        }, 2000);
      } else {
        throw new Error("Please fill in all sign up fields.");
      }
    } catch (err: any) {
      setError(err.message || "Sign up failed. Please try again.");
      setIsLoading(false);
    }
  };

  // Mock Bypass for local testing (simulates established session)
  const handleBypass = async (linked: boolean) => {
    setIsLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      // Set cookie in browser for offline session
      const response = await fetch("/api/patient/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken: linked ? "mock-patient-linked-token" : "mock-patient-unlinked-token"
        }),
      });

      if (!response.ok) {
        throw new Error("Bypass session establishment failed.");
      }

      const resData = await response.json();
      
      localStorage.setItem("patient_session", JSON.stringify({
        uid: linked ? "mock-patient-uid-linked" : "mock-patient-uid-unlinked",
        email: "patient.demo@homeo.healthcare",
        name: "Aarav Sharma",
        role: "patient",
        patientId: resData.patientId || ""
      }));

      setSuccessMsg(`Bypass auth successful! Redirecting...`);
      setTimeout(() => {
        router.push("/patient/dashboard");
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Bypass failed.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-6 py-20 bg-transparent">
      {/* Theme Toggle */}
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
        <Link href="/login" className="mb-5 inline-flex text-xs font-bold text-slate-600 hover:text-mint dark:text-slate-300">
          ← Back to portal access
        </Link>
        {/* Brand Header */}
        <div className="text-center mb-10">
          <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/65 shadow-md mb-4 breathe">
            <Activity className="w-6 h-6 text-mint animate-pulse" />
          </div>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-[#1A2421] dark:text-slate-100">Patient Care Portal</h2>
          <p className="text-xs text-slate-700 dark:text-slate-400 font-semibold mt-2">Manage your healing journey securely</p>
        </div>

        {/* Auth Glass Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel p-8 rounded-[32px] border-white/60 shadow-[0_20px_50px_rgba(20,184,166,0.03)]"
        >
          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
            <button
              onClick={() => { setActiveTab("login"); setError(""); }}
              className={`flex-1 text-center py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === "login"
                  ? "text-mint border-b-2 border-mint"
                  : "text-slate-400 hover:text-slate-650"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab("signup"); setError(""); }}
              className={`flex-1 text-center py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === "signup"
                  ? "text-mint border-b-2 border-mint"
                  : "text-slate-400 hover:text-slate-650"
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-2.5 text-rose-800 text-xs font-semibold leading-relaxed">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-2.5 text-emerald-800 text-xs font-semibold leading-relaxed">
              <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5 animate-pulse" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={activeTab === "login" ? handleLogin : handleSignUp} className="space-y-5">
            {activeTab === "signup" && (
              <div className="relative group">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aarav Sharma"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 focus:border-mint focus:ring-1 focus:ring-mint dark:focus:border-mint dark:focus:ring-mint outline-none bg-white/40 dark:bg-slate-950/40 backdrop-blur-sm transition-all duration-300 font-medium text-sm text-[#1A2421] dark:text-slate-100"
                    required
                  />
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-mint transition-colors" />
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="relative group">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patient@gmail.com"
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 focus:border-mint focus:ring-1 focus:ring-mint dark:focus:border-mint dark:focus:ring-mint outline-none bg-white/40 dark:bg-slate-950/40 backdrop-blur-sm transition-all duration-300 font-medium text-sm text-[#1A2421] dark:text-slate-100"
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
                  className="w-full pl-11 pr-12 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 focus:border-mint focus:ring-1 focus:ring-mint dark:focus:border-mint dark:focus:ring-mint outline-none bg-white/40 dark:bg-slate-950/40 backdrop-blur-sm transition-all duration-300 font-medium text-sm text-[#1A2421] dark:text-slate-100"
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
                  {isLoading ? "Please wait..." : activeTab === "login" ? "Sign In" : "Register"}
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                </button>
              </Magnetic>
            </div>
          </form>

          {/* Local testing Mock Bypass options */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center space-y-3">
            <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest block">Local Test Bypass Mode</span>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => handleBypass(true)}
                className="flex-1 py-2 px-3 border border-purple-200 dark:border-purple-900/50 hover:bg-purple-50 dark:hover:bg-purple-950/20 text-[#7c3aed] text-[10px] font-bold rounded-xl transition-all cursor-pointer bg-white/20"
              >
                Bypass (Linked Aarav)
              </button>
              <button
                type="button"
                onClick={() => handleBypass(false)}
                className="flex-1 py-2 px-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-600 dark:text-slate-400 text-[10px] font-bold rounded-xl transition-all cursor-pointer bg-white/20"
              >
                Bypass (Unlinked User)
              </button>
            </div>
          </div>

        </motion.div>
        <div className="mt-6">
          <AccessSupport compact />
        </div>
      </div>
    </div>
  );
}
