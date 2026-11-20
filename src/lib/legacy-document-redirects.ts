import { loadDocument } from '@/lib/document-catalog';
import { documentKey } from '@/lib/document-metadata';

const LEGACY_ORIGIN = 'https://fresh-teacher.github.io';

/** Match the exact original URL, never a guessed title or an unrelated class fallback. */
export async function legacyDocumentRedirect(path: string): Promise<string | undefined> {
  if (!/\.(?:pdf|docx?|pptx?|xlsx?)$/i.test(path)) return undefined;
  const url = new URL(`/${path.replace(/^\/+/, '')}`, LEGACY_ORIGIN);
  const original = decodeURI(url.href);
  // Imported catalogs contain both literal-space and encoded URLs.
  for (const candidate of new Set([original, url.href])) {
    const document = await loadDocument(documentKey(candidate));
    if (!document) continue;
    if (new URL(document.item.pdfUrl).href !== url.href) continue;
    return `/doc/${document.slug}`;
  }
  return undefined;
}