"use client";

import HeroSection from "@/components/layout/home/HeroSection";
import FeatureBentoSection from "@/components/layout/home/FeatureBentoSection";
import RoleShowcaseSection from "@/components/layout/home/RoleShowcaseSection";
import SocialProofSection from "@/components/layout/home/SocialProofSection";
import FinalCTASection from "@/components/layout/home/FinalCTASection";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      {/* Hero Section - Full height with gradient and CTA */}
      <HeroSection />

      {/* Features Section - Premium spacing */}
      <FeatureBentoSection />

      {/* Role Showcase - Medium spacing */}
      <RoleShowcaseSection />

      {/* Social Proof - Premium spacing */}
      <SocialProofSection />

      {/* Final CTA - Full height closing section */}
      <FinalCTASection />
      <Footer />
    </main>
  );
}
