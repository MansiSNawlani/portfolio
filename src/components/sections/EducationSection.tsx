import { IconAward, IconCalendar, IconExternalLink } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { SectionHeading } from "./SectionHeading";

const EDUCATION_QUERY =
  defineQuery(`*[_type == "education"] | order(endDate desc, startDate desc){
  institution,
  degree,
  fieldOfStudy,
  startDate,
  endDate,
  current,
  gpa,
  description,
  achievements,
  logo,
  website,
  order
}`);

export async function EducationSection() {
  const { data: education } = await sanityFetch({ query: EDUCATION_QUERY });

  if (!education || education.length === 0) {
    return null;
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <section id="education" className="relative py-20 px-6 overflow-hidden">
      {/* Section-wide Dotted Glow Background */}
      {/* <DottedGlowBackground
        className="pointer-events-none opacity-30 dark:opacity-50 mask-radial-to-75% mask-radial-at-bottom"
        opacity={0.5}
        gap={10}
        radius={3.5}
        colorLightVar="--color-neutral-400"
        glowColorLightVar="--color-primary"
        colorDarkVar="--color-neutral-600"
        glowColorDarkVar="--color-primary"
        backgroundOpacity={0}
        speedMin={0.2}
        speedMax={0.8}
        speedScale={1.2}
      /> */}

      <div className="container mx-auto max-w-6xl relative z-10">
        <SectionHeading title="Education" description="Where it started." />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {education.map((edu) => (
            <div
              key={`${edu.institution}-${edu.degree}-${edu.startDate}`}
              className="group relative bg-card border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Accent gradient bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/60 to-primary/30 z-10" />

              <div className="relative z-10 p-6">
                {/* Header with logo and basic info */}
                <div className="flex items-start gap-4 mb-4">
                  {edu.logo && (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-primary/20 shrink-0 group-hover:border-primary/40 transition-colors">
                      <Image
                        src={urlFor(edu.logo).width(64).height(64).url()}
                        alt={`${edu.institution} logo`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="type-card-title mb-1">{edu.degree}</h3>
                    <p className="type-org mb-1">{edu.institution}</p>
                    {edu.fieldOfStudy && (
                      <p className="type-meta">{edu.fieldOfStudy}</p>
                    )}
                  </div>
                </div>

                {/* Date and GPA badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted type-chip">
                    <IconCalendar className="w-3.5 h-3.5" />
                    <span>
                      {edu.startDate && formatDate(edu.startDate)} -{" "}
                      {edu.current
                        ? "Present"
                        : edu.endDate
                          ? formatDate(edu.endDate)
                          : "N/A"}
                    </span>
                  </div>
                  {edu.gpa && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary type-chip">
                      <IconAward className="w-3.5 h-3.5" />
                      <span>GPA: {edu.gpa}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {edu.description && (
                  <p className="type-body mb-4">{edu.description}</p>
                )}

                {/* Achievements (same list style as Experience) */}
                {edu.achievements && edu.achievements.length > 0 && (
                  <div className="mb-4">
                    <h4 className="type-subheading mb-2">
                      Achievements & honors
                    </h4>
                    <ul className="list-disc pl-5 space-y-1.5 type-body marker:text-primary/60">
                      {edu.achievements.map((achievement, idx) => (
                        <li key={`${edu.institution}-achievement-${idx}`}>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Website link */}
                {edu.website && (
                  <Link
                    href={edu.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    Visit Website
                    <IconExternalLink className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
