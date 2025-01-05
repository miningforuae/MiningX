import FaqSection from "@/components/contactUs/FaqSection";
import ContactUs from "@/components/contactUs/contactPage";
import LandingLayout from "@/components/Layouts/LandingLayout";
import React from "react";
import ContactPage from "@/components/contactUs/contactPage";
import LocationSection from "@/components/contactUs/Map";

function page() {
  return (
    <div>
      <LandingLayout>
        <LocationSection/>
        <FaqSection />
      </LandingLayout>
    </div>
  );
}

export default page;
