import { IconExternalLink } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { SectionHeading } from "./SectionHeading";

const ACHIEVEMENTS_QUERY =
  defineQuery(`*[_type == "achievement"] | order(date desc){
  title,
  type,
  issuer,
  date,
  description,
  image,
  url,
  featured,
  order
}`);

export async function AchievementsSection() {
  const { data: achievements } = await sanityFetch({
    query: ACHIEVEMENTS_QUERY,
  });

  if (!achievements || achievements.length === 0) {
    return null;
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  // -700 text on light backgrounds and -400 on dark keep chips readable.
  const getTypeColor = (type: string | null | undefined) => {
    const neutral = "bg-muted text-muted-foreground";
    if (!type) return neutral;
    const colors: Record<string, string> = {
      career: "bg-primary/10 text-primary",
      award: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
      hackathon: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
      publication: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
      speaking: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
      "open-source": "bg-orange-500/10 text-orange-700 dark:text-orange-400",
      milestone: "bg-primary/10 text-primary",
      recognition: "bg-teal-500/10 text-teal-700 dark:text-teal-400",
      other: neutral,
    };
    return colors[type] || neutral;
  };

  const getTypeLabel = (type: string | null | undefined) => {
    if (!type) return "Achievement";
    const labels: Record<string, string> = {
      career: "Career",
      award: "Award",
      hackathon: "Hackathon Win",
      publication: "Publication",
      speaking: "Speaking",
      "open-source": "Open Source",
      milestone: "Milestone",
      recognition: "Recognition",
      other: "Other",
    };
    return labels[type] || "Achievement";
  };

  // Merge repeat awards (e.g. several SPOT Awards) into one card that lists
  // each occurrence. The query is date-desc, so the first entry is the latest.
  const grouped = Array.from(
    achievements
      .reduce(
        (groups, achievement) => {
          const key = achievement.title ?? "";
          const group = groups.get(key);
          if (group) {
            group.occurrences.push(achievement);
            group.featured ||= Boolean(achievement.featured);
          } else {
            groups.set(key, {
              ...achievement,
              featured: Boolean(achievement.featured),
              occurrences: [achievement],
            });
          }
          return groups;
        },
        new Map<
          string,
          (typeof achievements)[number] & {
            featured: boolean;
            occurrences: typeof achievements;
          }
        >(),
      )
      .values(),
  );

  const featured = grouped.filter((a) => a.featured);
  const regular = grouped.filter((a) => !a.featured);

  const renderOccurrences = (
    achievement: (typeof grouped)[number],
    className: string,
  ) => (
    <ul className={className}>
      {achievement.occurrences.map((occurrence) => (
        <li key={`${occurrence.issuer}-${occurrence.date}`}>
          {occurrence.date && formatDate(occurrence.date)}
          {occurrence.issuer && ` · ${occurrence.issuer}`}
        </li>
      ))}
    </ul>
  );

  return (
    <section id="achievements" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <SectionHeading
          title="Achievements"
          description="Recognition along the way."
        />

        {/* Featured Achievements */}
        {featured.length > 0 && (
          <div className="mb-6">
            <div className="@container">
              <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-6">
                {featured.map((achievement) => (
                  <div
                    key={`${achievement.title}-${achievement.date}`}
                    className="@container/card flex flex-col bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    {achievement.image && (
                      <div className="relative w-full h-32 @md/card:h-48 mb-4 rounded-lg overflow-hidden">
                        <Image
                          src={urlFor(achievement.image)
                            .width(400)
                            .height(200)
                            .url()}
                          alt={achievement.title || "Achievement"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div className="flex flex-col items-start @xs/card:flex-row @xs/card:items-center gap-2 mb-3">
                      {achievement.type && (
                        <span
                          className={`px-2.5 py-1 type-chip rounded-full ${getTypeColor(
                            achievement.type,
                          )}`}
                        >
                          {getTypeLabel(achievement.type)}
                        </span>
                      )}
                      {achievement.date &&
                        achievement.occurrences.length === 1 && (
                          <span className="type-meta">
                            {formatDate(achievement.date)}
                          </span>
                        )}
                    </div>

                    <h4 className="type-card-title mb-2">
                      {achievement.title}
                      {achievement.occurrences.length > 1 && (
                        <span className="ml-2 align-middle type-chip px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          ×{achievement.occurrences.length}
                        </span>
                      )}
                    </h4>
                    {achievement.occurrences.length > 1
                      ? renderOccurrences(
                          achievement,
                          "mb-3 space-y-0.5 type-meta",
                        )
                      : achievement.issuer && (
                          <p className="type-org mb-3">{achievement.issuer}</p>
                        )}
                    {achievement.description && (
                      <p className="type-body">{achievement.description}</p>
                    )}

                    {achievement.url && (
                      <Link
                        href={achievement.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto pt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                      >
                        Learn More
                        <IconExternalLink
                          className="size-4"
                          aria-hidden="true"
                        />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Regular Achievements */}
        {regular.length > 0 && (
          <div>
            <div className="@container">
              <div className="grid grid-cols-1 @2xl:grid-cols-2 @5xl:grid-cols-3 gap-6">
                {regular.map((achievement) => (
                  <div
                    key={`${achievement.title}-${achievement.date}`}
                    className="@container/card bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow flex flex-col"
                  >
                    {achievement.image && (
                      <div className="relative w-full h-24 @md/card:h-32 mb-4 rounded-lg overflow-hidden">
                        <Image
                          src={urlFor(achievement.image)
                            .width(300)
                            .height(128)
                            .url()}
                          alt={achievement.title || "Achievement"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        {achievement.type && (
                          <span
                            className={`px-2.5 py-1 type-chip rounded-full ${getTypeColor(
                              achievement.type,
                            )}`}
                          >
                            {getTypeLabel(achievement.type)}
                          </span>
                        )}
                      </div>

                      <h4 className="type-card-title mb-2">
                        {achievement.title}
                        {achievement.occurrences.length > 1 && (
                          <span className="ml-2 align-middle type-chip px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            ×{achievement.occurrences.length}
                          </span>
                        )}
                      </h4>
                      {achievement.occurrences.length > 1 ? (
                        renderOccurrences(
                          achievement,
                          "mb-3 space-y-0.5 type-meta",
                        )
                      ) : (
                        <>
                          {achievement.issuer && (
                            <p className="type-org mb-1">
                              {achievement.issuer}
                            </p>
                          )}
                          {achievement.date && (
                            <p className="type-meta mb-3">
                              {formatDate(achievement.date)}
                            </p>
                          )}
                        </>
                      )}
                      {achievement.description && (
                        <p className="type-body">{achievement.description}</p>
                      )}
                    </div>

                    {achievement.url && (
                      <Link
                        href={achievement.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline mt-4 pt-4 border-t"
                      >
                        Learn More
                        <IconExternalLink
                          className="size-4"
                          aria-hidden="true"
                        />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
