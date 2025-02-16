import FaqSection from "@/components/contactUs/FaqSection";
import ContactUs from "@/components/contactUs/contactPage";
import LandingLayout from "@/components/Layouts/LandingLayout";
import React from "react";
import ContactPage from "@/components/contactUs/contactPage";
import LocationSection from "@/components/contactUs/Map";
import ContactForm from "@/components/contactUs/conatactForm";

function page() {
  return (
    <div>
      <LandingLayout>
        <ContactForm/>
        <LocationSection/>
        <FaqSection />
      </LandingLayout>
    </div>
  );
}

export default page;
