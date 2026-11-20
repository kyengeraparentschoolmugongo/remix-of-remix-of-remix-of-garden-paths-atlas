import legacy from '@/data/legacy/manifest.json';
import resources from '@/data/resource-manifest.json';
import { classOf } from '@/lib/site';

const CLASSES = new Set(['baby', 'middle', 'top', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 's1', 's2', 's3', 's4', 's5', 's6']);
const aliases: Readonly<Record<string, string>> = {
  'index.html': '/', 'index2.html': '/', 'index': '/',
  'about.html': '/about', 'privacy.html': '/privacy', 'terms.html': '/terms',
  'cookies.html': '/cookies', 'disclaimer.html': '/disclaimer', 'p.6.html': '/p6.html',
};
const catalog: Readonly<Record<string, { count: number }>> = { ...legacy, ...resources };

/** Only known duplicates and genuinely empty document lists may move to a class hub. */
export function legacyPageRedirect(path: string): string | undefined {
  const name = path.replace(/^\/+|\/+$/g, '');
  const alias = aliases[name];
  if (alias) return alias;
  // Google indexed copies of category pages beneath the retired Pdflip directory.
  if (name.startsWith('Pdflip/')) {
    const original = name.slice('Pdflip/'.length);
    if (catalog[original]) return legacyPageRedirect(original) ?? `/${original}`;
    return undefined;
  }
  const menu = /^menu (baby|middle|top|p[1-7]|s[1-6])\.html$/.exec(name);
  if (menu?.[1]) return `/${menu[1]}.html`;
  const entry = catalog[name];
  const key = classOf(name);
  if (!entry || !key || !CLASSES.has(key)) return undefined;
  // Choose pages repeat the subject selectors in the current class hubs.
  if (name.startsWith('Choose') || (entry.count === 0 && /(?:PastPapers|LessonNotes|SchemesofWork|SchemesOfWork)\.html$/.test(name))) {
    return `/${key}.html`;
  }
  return undefined;
}