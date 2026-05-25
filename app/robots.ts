import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

// Per-bot rules. User chose to ALLOW AI crawlers (training + search) to
// maximise discoverability as a designer/strategist. Adjust here in one
// place if that ever changes — search engines first, then AI bots, then
// the catch-all wildcard last (robots.txt order matters: a UA's first
// matching block wins).
export default function robots(): MetadataRoute.Robots {
  const COMMON: { allow: string; disallow: string[] } = {
    allow: '/',
    disallow: ['/api/', '/_next/'],
  }

  return {
    rules: [
      // Major search engines
      { userAgent: 'Googlebot', ...COMMON },
      { userAgent: 'Bingbot', ...COMMON },
      { userAgent: 'DuckDuckBot', ...COMMON },
      { userAgent: 'Slurp', ...COMMON },             // Yahoo
      { userAgent: 'YandexBot', ...COMMON },

      // AI / LLM crawlers — explicitly named so future-me can toggle them.
      // OpenAI
      { userAgent: 'GPTBot', ...COMMON },            // training
      { userAgent: 'OAI-SearchBot', ...COMMON },     // ChatGPT search
      { userAgent: 'ChatGPT-User', ...COMMON },      // user-triggered fetches
      // Anthropic
      { userAgent: 'ClaudeBot', ...COMMON },         // training
      { userAgent: 'Claude-Web', ...COMMON },        // search
      { userAgent: 'anthropic-ai', ...COMMON },      // legacy
      // Google AI
      { userAgent: 'Google-Extended', ...COMMON },   // Bard/Gemini training
      // Perplexity
      { userAgent: 'PerplexityBot', ...COMMON },
      // Apple
      { userAgent: 'Applebot', ...COMMON },
      { userAgent: 'Applebot-Extended', ...COMMON },
      // Common Crawl (used by many LLM datasets)
      { userAgent: 'CCBot', ...COMMON },
      // Bytedance
      { userAgent: 'Bytespider', ...COMMON },
      // Meta
      { userAgent: 'FacebookBot', ...COMMON },
      { userAgent: 'meta-externalagent', ...COMMON },
      // Cohere
      { userAgent: 'cohere-ai', ...COMMON },
      // Mistral
      { userAgent: 'MistralAI-User', ...COMMON },

      // Fallback — covers everything not named above.
      { userAgent: '*', ...COMMON },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
