import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PatientPricingPlanner from "@/components/PatientPricingPlanner";

export default function PlansComparisonPage() {
  return (
    <main className="pt-32 pb-24 px-4 md:px-8 relative bg-gradient-mesh min-h-screen">
      <div className="max-w-7xl mx-auto z-10 relative">
        <Link
          href="/store"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-mint/20 hover:border-mint/60 bg-mint/5 hover:bg-mint/10 text-mint-dark text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          Back to care pathways
        </Link>

        <header className="max-w-4xl mt-10 mb-12">
          <span className="text-xs font-bold text-mint uppercase tracking-widest">Clear, physician-led pricing</span>
          <h1 className="font-serif text-4xl md:text-6xl font-semibold tracking-tight text-[#1A2421] mt-4">
            Choose a care pathway, not a medical billing formula.
          </h1>
          <p className="text-base text-slate-700 font-semibold leading-relaxed mt-6">
            Three pathways cover short-term, constitutional, and advanced care. Select the description closest to your needs and review fixed care-duration totals; a physician confirms suitability before treatment.
          </p>
        </header>

        <PatientPricingPlanner />
      </div>
    </main>
  );
}
