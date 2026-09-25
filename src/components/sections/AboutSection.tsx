import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { SectionHeading } from "./SectionHeading";

const ABOUT_QUERY = defineQuery(`*[_id == "singleton-profile"][0]{
  firstName,
  lastName,
  fullBio,
  yearsOfExperience,
  stats,
  email,
  phone,
  location
}`);

export async function AboutSection() {
  const { data: profile } = await sanityFetch({ query: ABOUT_QUERY });

  if (!profile) {
    return null;
  }

  return (
    <section id="about" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <SectionHeading
          title="About Me"
          description="Enterprise engineer, now building with AI."
        />

        <div
          className={`grid grid-cols-1 gap-10 lg:gap-14 items-start ${
            profile.stats?.length ? "lg:grid-cols-[minmax(0,1fr)_320px]" : ""
          }`}
        >
          <div>
            {profile.fullBio && (
              <PortableText
                value={profile.fullBio}
                components={{
                  block: {
                    normal: ({ children }) => (
                      <p className="type-body mb-4">{children}</p>
                    ),
                    h2: ({ children }) => (
                      <h3 className="type-card-title mt-8 mb-3">{children}</h3>
                    ),
                    h3: ({ children }) => (
                      <h4 className="type-subheading mt-6 mb-2">{children}</h4>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-primary pl-4 italic my-4">
                        {children}
                      </blockquote>
                    ),
                  },
                  marks: {
                    strong: ({ children }) => (
                      <strong className="font-semibold text-foreground">
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic">{children}</em>
                    ),
                    link: ({ children, value }) => {
                      const href = value?.href || "";
                      const isExternal = href.startsWith("http");
                      return (
                        <Link
                          href={href}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noopener noreferrer" : undefined}
                          className="text-primary hover:underline"
                        >
                          {children}
                        </Link>
                      );
                    },
                  },
                  list: {
                    bullet: ({ children }) => (
                      <ul className="list-disc pl-5 space-y-1.5 mb-4 type-body">
                        {children}
                      </ul>
                    ),
                    number: ({ children }) => (
                      <ol className="list-decimal pl-5 space-y-1.5 mb-4 type-body">
                        {children}
                      </ol>
                    ),
                  },
                }}
              />
            )}
          </div>

          {/* Stats from CMS, beside the bio on large screens */}
          {profile.stats && profile.stats.length > 0 && (
            <aside aria-label="Quick facts" className="grid grid-cols-2 gap-3">
              {profile.stats.map((stat, idx) => (
                <div
                  key={`${stat.label}-${idx}`}
                  className="rounded-xl border bg-card p-5"
                >
                  <div className="font-heading text-3xl font-bold text-primary mb-1 tabular-nums">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground leading-snug">
                    {stat.label}
                  </div>
                </div>
              ))}
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
