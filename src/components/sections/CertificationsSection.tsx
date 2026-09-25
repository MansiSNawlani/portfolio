import { IconExternalLink } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { SectionHeading } from "./SectionHeading";

const CERTIFICATIONS_QUERY =
  defineQuery(`*[_type == "certification"] | order(issueDate desc){
  name,
  issuer,
  issueDate,
  expiryDate,
  credentialId,
  credentialUrl,
  logo,
  description,
  skills[]->{name, category},
  order
}`);

export async function CertificationsSection() {
  const { data: certifications } = await sanityFetch({
    query: CERTIFICATIONS_QUERY,
  });

  if (!certifications || certifications.length === 0) {
    return null;
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const isExpired = (expiryDate: string | null | undefined) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const initials = (issuer: string) =>
    issuer
      .split(/[^\p{L}\p{N}]+/u)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("");

  // Group by issuer. The query is issueDate-desc, so groups are ordered by
  // their most recent credential.
  const groups = Array.from(
    certifications
      .reduce((map, cert) => {
        const issuer = cert.issuer || "Other";
        map.set(issuer, [...(map.get(issuer) ?? []), cert]);
        return map;
      }, new Map<string, typeof certifications>())
      .entries(),
  );

  return (
    <section id="certifications" className="py-20 px-6 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <SectionHeading
          title="Certifications"
          description="Verified credentials, grouped by issuer."
        />

        <div className="rounded-xl border bg-card overflow-hidden divide-y">
          {groups.map(([issuer, certs]) => {
            const logo = certs.find((cert) => cert.logo)?.logo;

            return (
              <div
                key={issuer}
                className="grid grid-cols-1 md:grid-cols-[240px_1fr]"
              >
                {/* Issuer */}
                <div className="flex items-start gap-3 p-5 bg-muted/40">
                  <div className="relative size-10 shrink-0 rounded-lg overflow-hidden bg-primary/10 text-primary grid place-items-center font-heading text-sm font-bold">
                    {logo ? (
                      <Image
                        src={urlFor(logo).width(80).height(80).url()}
                        alt=""
                        fill
                        className="object-contain p-1"
                      />
                    ) : (
                      <span aria-hidden="true">{initials(issuer)}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="type-org leading-snug">{issuer}</h3>
                    <p className="type-label mt-0.5">
                      {certs.length} credential{certs.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {/* Credentials */}
                <ul className="divide-y">
                  {certs.map((cert) => {
                    const expired = isExpired(cert.expiryDate);

                    return (
                      <li
                        key={`${cert.name}-${cert.issueDate}`}
                        className="grid grid-cols-1 sm:grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1.5 px-5 py-4"
                      >
                        <div className="min-w-0 space-y-1">
                          <h4 className="type-subheading">{cert.name}</h4>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 type-meta">
                            {cert.issueDate && (
                              <span>Issued {formatDate(cert.issueDate)}</span>
                            )}
                            {cert.expiryDate && (
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 type-chip ${
                                  expired
                                    ? "bg-destructive/10 text-destructive"
                                    : "bg-emerald-600/10 text-emerald-700 dark:text-emerald-400"
                                }`}
                              >
                                <span
                                  aria-hidden="true"
                                  className="size-1.5 rounded-full bg-current"
                                />
                                {expired ? "Expired" : "Active until"}{" "}
                                {formatDate(cert.expiryDate)}
                              </span>
                            )}
                            {cert.credentialId && (
                              <span className="min-w-0 wrap-anywhere">
                                Credential ID{" "}
                                <span className="font-mono text-xs">
                                  {cert.credentialId}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>

                        {cert.credentialUrl && (
                          <Link
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline justify-self-start sm:justify-self-end"
                          >
                            Verify
                            <IconExternalLink
                              className="size-3.5"
                              aria-hidden="true"
                            />
                            <span className="sr-only">{cert.name}</span>
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
