// Design tokens for inline style objects. These reference the CSS custom
// properties defined in app/globals.css, which is the only place hex
// literals live.
export const C = {
  bg: 'var(--bg)',
  surface: 'var(--surface)',
  surface2: 'var(--surface-2)',
  border: 'var(--border)',

  accent: 'var(--accent)',
  accentInk: 'var(--accent-ink)',

  text: 'var(--text)',
  muted: 'var(--muted)',

  high: 'var(--sev-high)',
  med: 'var(--sev-med)',
  low: 'var(--sev-low)',
  ok: 'var(--ok)',
} as const;

export const DISPLAY = 'var(--font-display), system-ui, sans-serif';
export const BODY = 'var(--font-body), system-ui, sans-serif';
export const MONO = 'var(--font-mono), ui-monospace, monospace';
