import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeatureSection from "@/components/FeatureSection";
import CareerGrid from "@/components/CareerGrid";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col bg-background overflow-hidden">
        <Hero />
        <FeatureSection />
        <CareerGrid />
      </main>
      <Footer />
    </>
  );
}
