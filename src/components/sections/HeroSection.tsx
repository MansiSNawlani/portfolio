import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconWorld,
} from "@tabler/icons-react";
import {
  CircleCheck,
  Download,
  Languages,
  Mail,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { ProfileImage } from "./ProfileImage";

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
  profileImage,
  workAuthorization,
  languages,
  "resumeUrl": resume.asset->url
}`);

const AVAILABILITY_LABELS: Record<string, string> = {
  available: "Available for hire",
  open: "Open to opportunities",
  unavailable: "Not currently looking",
};

export async function HeroSection() {
  const { data: profile } = await sanityFetch({ query: HERO_QUERY });

  if (!profile) {
    return null;
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden"
    >
      {/* Background Ripple Effect */}
      <BackgroundRippleEffect rows={8} cols={27} cellSize={56} />

      <div className="relative z-10 container mx-auto max-w-6xl">
        <div className="@container">
          <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-8 @lg:gap-12 items-center">
            {/* Text Content */}
            <div className="@container/hero space-y-4 @md/hero:space-y-6">
              <h1 className="text-4xl @md/hero:text-5xl @lg/hero:text-7xl font-bold tracking-tight">
                {profile.firstName}{" "}
                <span className="text-primary">{profile.lastName}</span>
              </h1>
              {profile.headlineStaticText &&
              profile.headlineAnimatedWords &&
              profile.headlineAnimatedWords.length > 0 ? (
                <LayoutTextFlip
                  text={profile.headlineStaticText}
                  words={profile.headlineAnimatedWords}
                  duration={profile.headlineAnimationDuration || 3000}
                  className="text-xl @md/hero:text-2xl @lg/hero:text-3xl text-muted-foreground font-medium"
                />
              ) : (
                <p className="text-xl @md/hero:text-2xl @lg/hero:text-3xl text-muted-foreground font-medium">
                  {profile.headline}
                </p>
              )}
              <p className="text-base @md/hero:text-lg text-muted-foreground leading-relaxed">
                {profile.shortBio}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-4">
                <Link
                  href="#contact"
                  className="px-5 py-2.5 @md/hero:px-6 @md/hero:py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm @md/hero:text-base font-medium"
                >
                  Get in touch
                </Link>
                {profile.resumeUrl && (
                  <Link
                    href={`${profile.resumeUrl}?dl=`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 @md/hero:px-6 @md/hero:py-3 rounded-lg border bg-background/80 hover:bg-accent transition-colors text-sm @md/hero:text-base font-medium"
                  >
                    <Download className="size-4" aria-hidden="true" />
                    Download CV
                  </Link>
                )}
                {profile.socialLinks && (
                  <div className="flex items-center gap-1 @md/hero:ml-2">
                    {[
                      {
                        href: profile.socialLinks.github,
                        label: "GitHub",
                        Icon: IconBrandGithub,
                      },
                      {
                        href: profile.socialLinks.linkedin,
                        label: "LinkedIn",
                        Icon: IconBrandLinkedin,
                      },
                      {
                        href: profile.socialLinks.website,
                        label: "Website",
                        Icon: IconWorld,
                      },
                    ].map(({ href, label, Icon }) =>
                      href ? (
                        <Link
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={label}
                          title={label}
                          className="p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        >
                          <Icon className="size-5" aria-hidden="true" />
                        </Link>
                      ) : null,
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 @md/hero:grid-cols-2 gap-x-6 gap-y-2.5 pt-4 text-xs @md/hero:text-sm text-muted-foreground">
                {profile.email && (
                  <div className="flex items-start gap-2 min-w-0">
                    <Mail
                      className="size-4 shrink-0 mt-px @md/hero:mt-0.5"
                      aria-hidden="true"
                    />
                    <span className="truncate">{profile.email}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-start gap-2 min-w-0">
                    <MapPin
                      className="size-4 shrink-0 mt-px @md/hero:mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.availability && (
                  <div className="flex items-start gap-2 min-w-0">
                    <CircleCheck
                      className="size-4 shrink-0 mt-px @md/hero:mt-0.5 text-primary"
                      aria-hidden="true"
                    />
                    <span>
                      {AVAILABILITY_LABELS[profile.availability] ??
                        profile.availability}
                    </span>
                  </div>
                )}
                {profile.workAuthorization && (
                  <div className="flex items-start gap-2 min-w-0">
                    <ShieldCheck
                      className="size-4 shrink-0 mt-px @md/hero:mt-0.5 text-primary"
                      aria-hidden="true"
                    />
                    <span>{profile.workAuthorization}</span>
                  </div>
                )}
                {profile.languages && profile.languages.length > 0 && (
                  <div className="flex items-start gap-2 min-w-0 @md/hero:col-span-2">
                    <Languages
                      className="size-4 shrink-0 mt-px @md/hero:mt-0.5"
                      aria-hidden="true"
                    />
                    <span>
                      {profile.languages
                        .map((lang) =>
                          lang.level?.trim()
                            ? `${lang.name} (${lang.level.trim()})`
                            : lang.name,
                        )
                        .join(" · ")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Image */}
            {profile.profileImage && (
              <ProfileImage
                imageUrl={urlFor(profile.profileImage)
                  .width(600)
                  .height(600)
                  .url()}
                firstName={profile.firstName || ""}
                lastName={profile.lastName || ""}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
