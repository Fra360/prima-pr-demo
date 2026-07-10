import MotionProvider from "@/components/MotionProvider";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Gallery from "@/components/Gallery";
import Amenities from "@/components/Amenities";
import Location from "@/components/Location";
import Reviews from "@/components/Reviews";
import BookingCTA from "@/components/BookingCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <MotionProvider>
        <Navbar />
        <Hero />
        <About />
        <Gallery />
        <Amenities />
        <Location />
        <Reviews />
        <BookingCTA />
        <Footer />
      </MotionProvider>
    </main>
  );
}
