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
      <h2 className="text-3xl md:text-4xl font-bold text-balance">{title}</h2>
      {description && (
        <p className="text-base md:text-lg text-muted-foreground text-pretty">
          {description}
        </p>
      )}
    </div>
  );
}
