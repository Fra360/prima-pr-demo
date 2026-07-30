import MotionProvider from "@/components/MotionProvider";
import Aurora from "@/components/Aurora";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Gallery from "@/components/Gallery";
import Explore3D from "@/components/Explore3D";
import Amenities from "@/components/Amenities";
import Location from "@/components/Location";
import Reviews from "@/components/Reviews";
import BookingCTA from "@/components/BookingCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      {/* Le forme sfocate dietro tutto: senza di loro il vetro non ha nulla
          da sfocare e diventa plastica opaca. */}
      <Aurora />
      <main>
        <MotionProvider>
          <Navbar />
          <Hero />
          <About />
          {/* Prima si esplora il modello 3D, poi si sfogliano le foto */}
          <Explore3D />
          <Gallery />
          <Amenities />
          <Location />
          <Reviews />
          <BookingCTA />
        </MotionProvider>
      </main>
      <Footer />
    </>
  );
}
