import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import CaseStudy from "@/components/CaseStudy";
import TechStack from "@/components/TechStack";
import LiveDemos from "@/components/LiveDemos";
import PageEntrance from "@/components/PageEntrance";
import ScrollRevealSection from "@/components/ScrollRevealSection";
import Services from "@/components/Services";
import FeaturedHighlights from "@/components/FeaturedHighlights";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CurrencyConverter from "@/components/CurrencyConverter";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import WeatherDashboard from "@/components/WeatherDashboard";
import KanbanBoard from "@/components/KanbanBoard";
import ExpenseTracker from "@/components/ExpenseTracker";

export default function Home() {
  return (
    <PageEntrance>
      <main className="min-h-screen">
        <Navigation />
        <Hero />
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
          <Services />
        </ScrollRevealSection>
        <ScrollRevealSection>
          <CurrencyConverter />
        </ScrollRevealSection>
        <ScrollRevealSection>
          <QRCodeGenerator />
        </ScrollRevealSection>
        <ScrollRevealSection>
          <WeatherDashboard />
        </ScrollRevealSection>
        <ScrollRevealSection>
          <KanbanBoard />
        </ScrollRevealSection>
        <ScrollRevealSection>
          <ExpenseTracker />
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
