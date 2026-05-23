"use client";

import Hero from "@/components/Hero";
import Conditions from "@/components/Conditions";
import TheExperience from "@/components/TheExperience";
import DoctorProfile from "@/components/DoctorProfile";
import BookingSection from "@/components/BookingSection";

export default function Home() {
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
