import type { ReactNode } from "react";

export type HeadingLevel = 2 | 3 | 4 | 5;

/** A heading whose level follows the page it is placed in (the feature is used under an h1 and under a tab's h2). */
export function Heading({
  level,
  id,
  className,
  children,
}: {
  level: HeadingLevel;
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  const Tag = `h${level}` as "h2" | "h3" | "h4" | "h5";
  return (
    <Tag id={id} className={className}>
      {children}
    </Tag>
  );
}

/** The next heading level down, capped at h5. */
export const below = (level: HeadingLevel): HeadingLevel => Math.min(level + 1, 5) as HeadingLevel;
