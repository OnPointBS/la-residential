import { HeroSection } from "@/components/public/hero-section";
import { FeaturedHomes } from "@/components/public/featured-homes";
import { AboutPreview } from "@/components/public/about-preview";
import { ContactCTA } from "@/components/public/contact-cta";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedHomes />
      <AboutPreview />
      <ContactCTA />
    </div>
  );
}
