// Single source of truth for site-wide identity. Anything that needs
// the production URL, contact email, or canonical author block reads
// from here. Override SITE_URL via NEXT_PUBLIC_SITE_URL at deploy time
// only if the canonical domain ever changes.

const RAW_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lukecaporelli.com'
// Strip trailing slash so callers can do `${SITE_URL}/path` without worrying.
export const SITE_URL = RAW_URL.replace(/\/$/, '')
export const SITE_HOST = new URL(SITE_URL).host

export const AUTHOR = {
  name: 'Luke Caporelli',
  givenName: 'Luke',
  familyName: 'Caporelli',
  jobTitle: 'Strategic Designer',
  email: 'hello@lukecaporelli.com',
  emailHref: 'mailto:hello@lukecaporelli.com',
  location: 'Germany',
  nationality: 'US Citizen',
} as const

export const SOCIAL = {
  linkedin: 'https://www.linkedin.com/in/lukecaporelli/',
  tourewerk: 'https://tourewerk.gravelwerk.de/planen',
} as const

export const DESCRIPTION =
  "M.A. Strategic Design at HfG Schwäbisch Gmünd. Product strategy and interaction design for industrial systems — drones + AI for roof inspection, automotive HMI, crisis-resilient infrastructure."
