import React from "react";
import HeroSection from "./HeroSection";
import ServicesSection from "./Service";
import SolutionCard from "../SolarSolutions";
import ModernAboutSegments from "./Segments";
import Shop from "../shop/Product";

function LandingHome() {
  return (
    <div className="overflow-hidden bg-[#101010]">
      <HeroSection />
      <SolutionCard/>
      <ModernAboutSegments/>
      <Shop  isHomePage={true}/>
      
    </div>
  );
}

export default LandingHome;
