import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconWorld,
} from "@tabler/icons-react";
import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import WorldMap from "../ui/world-map";
import { ContactForm } from "./ContactForm";
import { SectionHeading } from "./SectionHeading";

const PROFILE_QUERY = defineQuery(`*[_id == "singleton-profile"][0]{
  email,
  phone,
  location,
  socialLinks
}`);

export async function ContactSection() {
  const { data: profile } = await sanityFetch({ query: PROFILE_QUERY });

  if (!profile) {
    return null;
  }

  return (
    <section id="contact" className="relative overflow-hidden py-20 px-6 pb-40">
      <div className="absolute inset-x-0 top-0 mx-auto max-w-6xl opacity-60">
        <WorldMap />
      </div>

      <div className="relative container mx-auto max-w-6xl">
        <SectionHeading
          title="Get in Touch"
          description="Open to new opportunities. Email is the fastest way to reach me."
        />

        <div className="@container">
          <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="@container/info space-y-6">
              <h3 className="text-xl @md/info:text-2xl font-semibold mb-6">
                Contact Information
              </h3>

              {profile.email && (
                <div className="flex items-start gap-3 @md/info:gap-4">
                  <div className="w-10 h-10 @md/info:w-12 @md/info:h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail
                      className="size-5 @md/info:size-6 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold mb-1 text-sm @md/info:text-base">
                      Email
                    </h4>
                    <Link
                      href={`mailto:${profile.email}`}
                      className="text-muted-foreground hover:text-primary transition-colors text-xs @md/info:text-sm truncate block"
                    >
                      {profile.email}
                    </Link>
                  </div>
                </div>
              )}

              {profile.phone && (
                <div className="flex items-start gap-3 @md/info:gap-4">
                  <div className="w-10 h-10 @md/info:w-12 @md/info:h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone
                      className="size-5 @md/info:size-6 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold mb-1 text-sm @md/info:text-base">
                      Phone
                    </h4>
                    <Link
                      href={`tel:${profile.phone}`}
                      className="text-muted-foreground hover:text-primary transition-colors text-xs @md/info:text-sm"
                    >
                      {profile.phone}
                    </Link>
                  </div>
                </div>
              )}

              {profile.location && (
                <div className="flex items-start gap-3 @md/info:gap-4">
                  <div className="w-10 h-10 @md/info:w-12 @md/info:h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin
                      className="size-5 @md/info:size-6 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold mb-1 text-sm @md/info:text-base">
                      Location
                    </h4>
                    <p className="text-muted-foreground text-xs @md/info:text-sm">
                      {profile.location}
                    </p>
                  </div>
                </div>
              )}

              {profile.socialLinks && (
                <div className="pt-6">
                  <h4 className="font-semibold mb-4 text-sm @md/info:text-base">
                    Elsewhere
                  </h4>
                  <div className="flex flex-wrap gap-2 @md/info:gap-3">
                    {profile.socialLinks.github && (
                      <Link
                        href={profile.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 @md/info:px-4 @md/info:py-2 rounded-lg border hover:bg-accent transition-colors text-xs @md/info:text-sm"
                      >
                        <IconBrandGithub
                          className="size-4"
                          aria-hidden="true"
                        />
                        GitHub
                      </Link>
                    )}
                    {profile.socialLinks.linkedin && (
                      <Link
                        href={profile.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 @md/info:px-4 @md/info:py-2 rounded-lg border hover:bg-accent transition-colors text-xs @md/info:text-sm"
                      >
                        <IconBrandLinkedin
                          className="size-4"
                          aria-hidden="true"
                        />
                        LinkedIn
                      </Link>
                    )}
                    {profile.socialLinks.website && (
                      <Link
                        href={profile.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 @md/info:px-4 @md/info:py-2 rounded-lg border hover:bg-accent transition-colors text-xs @md/info:text-sm"
                      >
                        <IconWorld className="size-4" aria-hidden="true" />
                        Website
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
