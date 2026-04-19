import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { BackgroundRippleEffect } from "../ui/background-ripple-effect";

const HERO_QUERY = defineQuery(`*[_id == "singleton-profile"][0]{
  firstName,
  lastName,
  headline,
  headlineStaticText,
  headlineAnimatedWords,
  headlineAnimationDuration,
  shortBio,
  email,
  phone,
  location,
  availability,
  socialLinks,
  yearsOfExperience,
  profileImage
}`);

async function HeroSection() {
  const { data: profile } = await sanityFetch({ query: HERO_QUERY });

  if (!profile) {
    return null;
  }
  console.log("Profile data:", profile);

  return <BackgroundRippleEffect />;
}

export default HeroSection;
