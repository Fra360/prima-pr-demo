import MotionProvider from "@/components/MotionProvider";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Showcase3D from "@/components/Showcase3D";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <MotionProvider>
        <Navbar />
        <Hero />
        <Work />
        <Showcase3D />
        <About />
        <Contact />
        <Footer />
      </MotionProvider>
    </main>
  );
}
