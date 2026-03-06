import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import TechStack from "@/components/TechStack";
import FeaturedHighlights from "@/components/FeaturedHighlights";
import DemoProjects from "@/components/DemoProjects";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <TechStack />
      <FeaturedHighlights />
      <DemoProjects />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
