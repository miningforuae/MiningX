import React from "react";
import HeroSection from "./HeroSection";
import ServicesSection from "./Service";
import SolutionCard from "../SolarSolutions";
import ModernAboutSegments from "./Segments";
import Shop from "../shop/Product";

function LandingHome() {
  return (
    <div className=" bg-[#101010]">
      <HeroSection />
      <SolutionCard/>
      <ModernAboutSegments/>
      <Shop  />
      
    </div>
  );
}

export default LandingHome;
