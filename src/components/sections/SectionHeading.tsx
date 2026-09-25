import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeading({
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-12 max-w-2xl space-y-3", className)}>
      <h2 className="type-section-title">{title}</h2>
      {description && <p className="type-section-subtitle">{description}</p>}
    </div>
  );
}
