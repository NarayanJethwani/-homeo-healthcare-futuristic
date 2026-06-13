import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Hero from "@/components/Hero";
import Conditions from "@/components/Conditions";
import TheExperience from "@/components/TheExperience";
import DoctorProfile from "@/components/DoctorProfile";
import BookingSection from "@/components/BookingSection";

export default async function Home() {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  
  if (host.includes("portal.homeo.healthcare")) {
    redirect("/admin");
  }

  return (
    <>
      {/* Section 1: Hero */}
      <Hero />

      {/* Section 2: Conditions Grid */}
      <Conditions />

      {/* Section 3: The Healing Experience Timeline */}
      <TheExperience />

      {/* Section 4: Doctor Profile */}
      <DoctorProfile />

      {/* Section 5: Consultation Scheduling */}
      <BookingSection />
    </>
  );
}
