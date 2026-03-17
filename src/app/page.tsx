import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import CaseStudy from "@/components/CaseStudy";
import TechStack from "@/components/TechStack";
import PortfolioGallery from "@/components/PortfolioGallery";
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
    <main className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <CaseStudy />
      <TechStack />
      <PortfolioGallery />
      <Services />
      <CurrencyConverter />
      <QRCodeGenerator />
      <WeatherDashboard />
      <KanbanBoard />
      <ExpenseTracker />
      <FeaturedHighlights />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
