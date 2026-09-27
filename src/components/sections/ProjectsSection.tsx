import Image from "next/image";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { SectionHeading } from "./SectionHeading";

const PROJECTS_QUERY =
  defineQuery(`*[_type == "project" && featured == true] | order(order asc)[0...9]{
  title,
  slug,
  tagline,
  category,
  liveUrl,
  githubUrl,
  status,
  startedAt,
  coverImage,
  technologies[]->{name, category, color}
}`);

const CATEGORY_LABELS: Record<string, string> = {
  "web-app": "Web app",
  "mobile-app": "Mobile app",
  "ai-ml": "AI / ML",
  "api-backend": "API / Backend",
  devops: "DevOps",
  "open-source": "Open source",
  "cli-tool": "CLI tool",
  "desktop-app": "Desktop app",
  "browser-extension": "Browser extension",
  game: "Game",
  other: "Other",
};

// Employer projects link to the company's product page; a link to this site
// (the portfolio project itself) is a live site you can visit; a side project
// with its own repo links to a deployed demo.
function liveLinkLabel(url: string, hasRepo: boolean) {
  try {
    if (new URL(url).hostname.endsWith("mansisn.com")) return "Visit site";
  } catch {}
  return hasRepo ? "View demo" : "View product";
}

function startedLabel(date: string) {
  return `Since ${new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })}`;
}

export async function ProjectsSection() {
  const { data: projects } = await sanityFetch({ query: PROJECTS_QUERY });

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section id="projects" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <SectionHeading
          title="Projects"
          description="Products I've helped build, and what I'm building now."
        />

        <div className="@container">
          <div
            className={`grid grid-cols-1 @2xl:grid-cols-2 gap-8 ${
              projects.length % 3 === 0 ? "@5xl:grid-cols-3" : ""
            }`}
          >
            {projects.map((project) => (
              <div
                key={project.slug?.current}
                className="@container/card group flex flex-col bg-card border rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Project Image */}
                {project.coverImage && (
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <Image
                      src={urlFor(project.coverImage)
                        .width(600)
                        .height(400)
                        .url()}
                      alt={project.title || "Project image"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Glass overlay that fades on hover */}
                    <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] group-hover:opacity-0 transition-opacity duration-300" />
                  </div>
                )}

                {/* Project Content */}
                <div className="flex flex-1 flex-col gap-4 p-5 @md/card:p-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {project.category && (
                        <span className="text-xs font-medium uppercase tracking-[0.08em] text-primary">
                          {CATEGORY_LABELS[project.category] ??
                            project.category}
                        </span>
                      )}
                      {project.status === "in-progress" && (
                        <span className="type-chip px-2 py-0.5 rounded-full border text-muted-foreground">
                          In progress
                          {project.startedAt &&
                            ` · ${startedLabel(project.startedAt)}`}
                        </span>
                      )}
                    </div>
                    <h3 className="type-card-title mb-2">
                      {project.title || "Untitled Project"}
                    </h3>
                    <p className="type-body">{project.tagline}</p>
                  </div>

                  {/* Tech Stack */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.map((tech, idx) => {
                        const techData =
                          tech && typeof tech === "object" && "name" in tech
                            ? tech
                            : null;
                        return techData?.name ? (
                          <span
                            key={`${project.slug?.current}-tech-${idx}`}
                            className="type-chip px-2.5 py-1 rounded-full bg-primary/10 text-primary"
                          >
                            {techData.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-auto flex flex-col @xs/card:flex-row gap-2 @xs/card:gap-3 pt-2">
                    {project.liveUrl && (
                      <Link
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
                      >
                        {liveLinkLabel(project.liveUrl, !!project.githubUrl)}
                      </Link>
                    )}
                    {project.githubUrl && (
                      <Link
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg border hover:bg-accent transition-colors text-sm font-medium text-center"
                      >
                        GitHub
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
