import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BadgeCheck, HeartPulse, ShieldCheck, Stethoscope, UserRound } from "lucide-react";
import AccessSupport from "@/components/access/AccessSupport";

export default function AccessGatewayPage() {
  return (
    <main className="min-h-screen bg-pearl px-5 py-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100 md:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="text-center">
          <Link href="/" className="inline-flex items-center gap-3" aria-label="Homeo Healthcare home">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
              <Image src="/images/logo.png" alt="" width={42} height={42} className="object-contain" priority />
            </span>
            <span className="text-left">
              <span className="block text-lg font-bold leading-none">Homeo Healthcare</span>
              <span className="mt-1 block text-[11px] font-bold uppercase tracking-[0.2em] text-mint">Secure portal access</span>
            </span>
          </Link>
          <h1 className="mx-auto mt-9 max-w-3xl font-serif text-4xl font-bold tracking-tight md:text-5xl">
            Choose your clinical workspace
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400">
            Doctors and patients use separate secure sessions, permissions, and dashboards. Select the access path that applies to you.
          </p>
        </header>

        <section className="mt-10 grid gap-6 lg:grid-cols-2" aria-label="Portal access options">
          <article className="rounded-[32px] border border-mint/25 bg-white/80 p-7 shadow-[0_20px_60px_rgba(15,118,110,0.08)] dark:bg-slate-900/75 md:p-9">
            <div className="flex items-center justify-between gap-4">
              <span className="rounded-2xl bg-mint/10 p-3 text-mint"><Stethoscope className="h-7 w-7" /></span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">
                <BadgeCheck className="h-4 w-4" /> Verified professionals
              </span>
            </div>
            <h2 className="mt-6 font-serif text-3xl font-bold">Doctor &amp; clinical team</h2>
            <p className="mt-3 min-h-14 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Access consultations, clinical records, repertory tools, Materia Medica, and treatment workflows according to your approved role.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <Link href="/admin/login" className="inline-flex items-center justify-center gap-2 rounded-full bg-mint px-5 py-3.5 text-sm font-bold text-white transition hover:bg-mint-dark">
                Doctor sign in <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/doctor/register" className="inline-flex items-center justify-center rounded-full border border-mint/40 px-5 py-3.5 text-sm font-bold text-mint transition hover:bg-mint/10">
                Request doctor access
              </Link>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500">New doctor requests require registration verification and administrator approval before any account is activated.</p>
          </article>

          <article className="rounded-[32px] border border-blue-200/70 bg-white/80 p-7 shadow-[0_20px_60px_rgba(37,99,235,0.07)] dark:border-blue-900/60 dark:bg-slate-900/75 md:p-9">
            <div className="flex items-center justify-between gap-4">
              <span className="rounded-2xl bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400"><UserRound className="h-7 w-7" /></span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-800 dark:bg-blue-500/10 dark:text-blue-300">
                <HeartPulse className="h-4 w-4" /> Patient care
              </span>
            </div>
            <h2 className="mt-6 font-serif text-3xl font-bold">Patient portal</h2>
            <p className="mt-3 min-h-14 text-sm leading-6 text-slate-600 dark:text-slate-400">
              View your care information, manage portal access, and connect your account to the clinical record maintained by your care team.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <Link href="/patient/login" className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700">
                Patient sign in <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/patient/login?mode=signup" className="inline-flex items-center justify-center rounded-full border border-blue-300 px-5 py-3.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-500/10">
                Create patient account
              </Link>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500">Creating a portal account does not automatically link it to a clinical record; identity matching remains a controlled step.</p>
          </article>
        </section>

        <div className="mt-7"><AccessSupport /></div>

        <footer className="mt-7 flex flex-col items-center justify-between gap-3 rounded-2xl px-2 text-center text-xs text-slate-500 sm:flex-row sm:text-left">
          <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-mint" /> Role-based access keeps doctor and patient workspaces isolated.</span>
          <span className="flex gap-4"><Link href="/privacy-policy" className="hover:text-mint">Privacy</Link><Link href="/" className="hover:text-mint">Public website</Link></span>
        </footer>
      </div>
    </main>
  );
}
