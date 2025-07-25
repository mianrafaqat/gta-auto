"use client";

import AboutHero from "../about-hero";
import AboutWhat from "../about-what";
import AboutTeam from "../about-team";
import AboutVision from "../about-vision";
import AboutTestimonials from "../about-testimonials";
import OurVision from "../about-what";
import ChooseUs from "../about-choose";
import Security from "../about-security";

// ----------------------------------------------------------------------

export default function AboutView() {
  return (
    <>
      <AboutHero />
      <OurVision />

      <ChooseUs />
      <Security />
      {/* <AboutVision />

      <AboutTeam />

      <AboutTestimonials /> */}
    </>
  );
}
