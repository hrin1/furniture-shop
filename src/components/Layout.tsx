import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import PageTransition from "@/components/PageTransition";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <>
      <Header />

      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={() => window.scrollTo({ top: 0, behavior: "instant" })}
      >
        <PageTransition key={location.pathname + location.search}>{outlet}</PageTransition>
      </AnimatePresence>

      <Footer />
    </>
  );
}