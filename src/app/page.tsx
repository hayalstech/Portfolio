import Navigation from "@/components/Navigation";
import PageEntrance from "@/components/PageEntrance";
import Hero3D from "@/components/Hero3D";
import ScrollRevealSection from "@/components/ScrollRevealSection";
import CaseStudy from "@/components/CaseStudy";
import TechStack from "@/components/TechStack";
import LiveDemos from "@/components/LiveDemos";
import Services from "@/components/Services";
import About from "@/components/About";
import Contact from "@/components/Contact";
import ComingSoon3D from "@/components/ComingSoon3D";
import Footer from "@/components/Footer";
import FeaturedHighlights from "@/components/FeaturedHighlights";

export default function Home() {
  return (
    <PageEntrance>
      <main className="min-h-screen">
        <Navigation />
        <Hero3D />
        <ScrollRevealSection>
          <CaseStudy />
        </ScrollRevealSection>
        <ScrollRevealSection>
          <TechStack />
        </ScrollRevealSection>
        <ScrollRevealSection>
          <LiveDemos />
        </ScrollRevealSection>
        <ScrollRevealSection>
          <ComingSoon3D />
        </ScrollRevealSection>
        <ScrollRevealSection>
          <Services />
        </ScrollRevealSection>
                <ScrollRevealSection>
          <FeaturedHighlights />
        </ScrollRevealSection>
        <ScrollRevealSection>
          <About />
        </ScrollRevealSection>
        <ScrollRevealSection>
          <Contact />
        </ScrollRevealSection>
        <ScrollRevealSection>
          <Footer />
        </ScrollRevealSection>
      </main>
    </PageEntrance>
  );
}
