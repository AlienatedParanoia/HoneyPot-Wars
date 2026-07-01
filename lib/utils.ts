// Lightweight className joiner used by UI components.
// This project has no Tailwind, so the usual shadcn `clsx + tailwind-merge`
// combo would add two dependencies for no benefit — a truthy-filter + join is
// all `cn` needs to do here (merge an optional passed-in `className`).
export type ClassValue = string | number | null | boolean | undefined | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (Array.isArray(input)) {
      const inner = cn(...input);
      if (inner) out.push(inner);
    } else {
      out.push(String(input));
    }
  }
  return out.join(' ');
}
