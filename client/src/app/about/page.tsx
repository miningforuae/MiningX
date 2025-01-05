import HomeAbout from "@/components/home/abouHero";
import TradifierHero from "@/components/home/aboutHeader";
import FeaturesSection from "@/components/home/feaure";
import ModernAboutSegments from "@/components/home/Segments";
import LandingLayout from "@/components/Layouts/LandingLayout";

import React from "react";

function Team() {
  return (
    <div>
      <LandingLayout>
        <HomeAbout/>
        <TradifierHero />

        <FeaturesSection />

        <ModernAboutSegments />
      </LandingLayout>
    </div>
  );
}

export default Team;
