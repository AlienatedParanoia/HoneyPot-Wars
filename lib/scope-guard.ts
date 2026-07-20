// Scope-lock helper (CLAUDE.md §L). A live-probe target is in scope only when it
// resolves to the account's registered domain or a direct subdomain of it, over
// http(s). IP literals, other schemes, and unrelated hosts are rejected. Every
// live target must pass this before a scan is authorised.

// Accepts "example.com", "https://example.com", "example.com/path", "example.com:443".
export function normalizeDomain(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^[a-z][a-z0-9+.-]*:\/\//, '') // strip scheme
    .split('/')[0] // strip path
    .split(':')[0] // strip port
    .replace(/^\.+|\.+$/g, ''); // strip leading/trailing dots
}

export function isInScope(rawUrl: string, registeredDomain: string): boolean {
  const domain = normalizeDomain(registeredDomain);
  if (!domain) return false;

  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return false;
  }
  // Protocol allowlist — no file:, ftp:, javascript:, etc.
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;

  const host = url.hostname.toLowerCase();
  if (!host) return false;
  // Hostnames only — reject IPv4 literals and IPv6 (bracketed) hosts.
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return false;
  if (host.includes(':') || url.hostname.startsWith('[')) return false;

  // Exact registered domain, or a subdomain of it.
  return host === domain || host.endsWith('.' + domain);
}
