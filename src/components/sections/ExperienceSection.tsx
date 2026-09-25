import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { defineQuery } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { SectionHeading } from "./SectionHeading";

const EXPERIENCE_QUERY =
  defineQuery(`*[_type == "experience"] | order(startDate desc){
  company,
  position,
  employmentType,
  location,
  startDate,
  endDate,
  current,
  description,
  responsibilities,
  achievements,
  technologies[]->{name, category},
  companyLogo,
  companyWebsite
}`);

export async function ExperienceSection() {
  const { data: experiences } = await sanityFetch({ query: EXPERIENCE_QUERY });

  if (!experiences || experiences.length === 0) {
    return null;
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <section id="experience" className="py-20 px-6 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <SectionHeading
          title="Experience"
          description="Nearly eight years across banking and customer experience."
        />

        <div className="space-y-8">
          {experiences.map((exp) => (
            <div
              key={`${exp.company}-${exp.position}-${exp.startDate}`}
              className="relative pl-5 md:pl-8 pb-8 border-l-2 border-muted last:border-l-0"
            >
              {/* Timeline dot */}
              <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-background" />

              <div className="@container/card bg-card border rounded-lg p-4 @md/card:p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col @md/card:flex-row @md/card:items-start gap-4 mb-4">
                  {exp.companyLogo && (
                    <div className="relative w-12 h-12 @md/card:w-16 @md/card:h-16 rounded-lg overflow-hidden border shrink-0">
                      <Image
                        src={urlFor(exp.companyLogo).width(64).height(64).url()}
                        alt={`${exp.company} company logo`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="type-card-title">{exp.position}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <p className="type-org">{exp.company}</p>
                      {exp.employmentType && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <span className="type-meta capitalize">
                            {exp.employmentType}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 type-meta">
                      <span>
                        {exp.startDate && formatDate(exp.startDate)} -{" "}
                        {exp.current
                          ? "Present"
                          : exp.endDate
                            ? formatDate(exp.endDate)
                            : "N/A"}
                      </span>
                      {exp.location && (
                        <>
                          <span>•</span>
                          <span>{exp.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {exp.description && (
                  <div className="type-body mb-5">
                    <PortableText value={exp.description} />
                  </div>
                )}

                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <div className="mb-5">
                    <h4 className="type-subheading mb-2">
                      Key responsibilities
                    </h4>
                    <ul className="list-disc pl-5 space-y-1.5 type-body marker:text-primary/60">
                      {exp.responsibilities.map((resp, idx) => (
                        <li key={`${exp.company}-resp-${idx}`}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {exp.achievements && exp.achievements.length > 0 && (
                  <div className="mb-5">
                    <h4 className="type-subheading mb-2">Achievements</h4>
                    <ul className="list-disc pl-5 space-y-1.5 type-body marker:text-primary/60">
                      {exp.achievements.map((achievement, idx) => (
                        <li key={`${exp.company}-achievement-${idx}`}>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 @md/card:gap-2 mt-4">
                    {exp.technologies.map((tech, techIdx) => {
                      const techData =
                        tech && typeof tech === "object" && "name" in tech
                          ? tech
                          : null;
                      return techData?.name ? (
                        <span
                          key={`${exp.company}-tech-${techIdx}`}
                          className="type-chip px-2.5 py-1 rounded-full bg-primary/10 text-primary"
                        >
                          {techData.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
