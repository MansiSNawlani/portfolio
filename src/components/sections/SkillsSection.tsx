import { defineQuery } from "next-sanity";
import { cn } from "@/lib/utils";
import { sanityFetch } from "@/sanity/lib/live";
import { SectionHeading } from "./SectionHeading";

const SKILLS_QUERY =
  defineQuery(`*[_type == "skill" && category != "soft-skills"] | order(yearsOfExperience desc, name asc){
  _id,
  name,
  proficiency,
  color
}`);

// Tiers come from each skill's `proficiency` field; each states what it
// means so the grouping is defensible, unlike a percentage.
const TIERS = [
  {
    levels: ["expert"],
    title: "Core stack",
    criteria: "Used daily in production for years.",
    highlight: true,
  },
  {
    levels: ["advanced"],
    title: "Proficient",
    criteria: "Shipped to production at NICE or Opus.",
    highlight: false,
  },
  {
    levels: ["intermediate", "beginner"],
    title: "Actively building with",
    criteria: "Adopted in the last 1–2 years, mostly AI and platform work.",
    highlight: false,
  },
];

export async function SkillsSection() {
  const { data: skills } = await sanityFetch({ query: SKILLS_QUERY });

  if (!skills || skills.length === 0) {
    return null;
  }

  return (
    <section id="skills" className="py-20 px-6 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <SectionHeading
          title="Skills"
          description="The tools I build with, grouped by how I've used them in production."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TIERS.map((tier) => {
            const tierSkills = skills.filter((skill) =>
              tier.levels.includes(skill.proficiency ?? ""),
            );
            if (tierSkills.length === 0) return null;

            return (
              <div
                key={tier.title}
                className={cn(
                  "rounded-xl border p-5 flex flex-col gap-4",
                  tier.highlight ? "bg-card shadow-sm" : "bg-background/60",
                )}
              >
                <div className="space-y-1">
                  <h3 className="type-card-title">{tier.title}</h3>
                  <p className="type-meta">{tier.criteria}</p>
                </div>

                <ul className="flex flex-wrap gap-2">
                  {tierSkills.map((skill) => (
                    <li
                      key={skill._id}
                      className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-sm"
                    >
                      <span
                        aria-hidden="true"
                        className="size-2 rounded-full shrink-0 bg-primary"
                        style={
                          skill.color ? { backgroundColor: skill.color } : {}
                        }
                      />
                      {skill.name}
                    </li>
                  ))}
                </ul>

                <p className="mt-auto type-label">{tierSkills.length} skills</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
