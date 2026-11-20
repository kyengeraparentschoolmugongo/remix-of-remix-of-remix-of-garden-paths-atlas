import { describe, expect, it, vi } from 'vitest';
import { legacyPageRedirect } from '@/lib/legacy-redirects';
import { publicCatalogPaths } from '@/lib/sitemap';
import { pageMeta } from '@/lib/site';
import { documentKey } from '@/lib/document-metadata';

vi.mock('@/lib/document-catalog', () => ({ loadDocument: vi.fn() }));
import { loadDocument } from '@/lib/document-catalog';
import { legacyDocumentRedirect } from '@/lib/legacy-document-redirects';

describe('confirmed legacy page replacements', () => {
  it.each(['baby', 'middle', 'top', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 's1', 's2', 's3', 's4', 's5', 's6'])('moves the old %s menu to its current hub', key => {
    expect(legacyPageRedirect(`menu ${key}.html`)).toBe(`/${key}.html`);
  });
  it.each(['about', 'privacy', 'terms', 'cookies', 'disclaimer'])('moves the %s HTML alias to its current page', key => {
    expect(legacyPageRedirect(`${key}.html`)).toBe(`/${key}`);
  });
  it('moves both old homepage aliases and the P6 punctuation alias', () => {
    expect(legacyPageRedirect('index.html')).toBe('/');
    expect(legacyPageRedirect('index2.html')).toBe('/');
    expect(legacyPageRedirect('index')).toBe('/');
    expect(legacyPageRedirect('p.6.html')).toBe('/p6.html');
  });
  it('replaces an old subject selector with the same class hub', () => {
    expect(legacyPageRedirect('ChoosePrimaryFiveClassPastPapers.html')).toBe('/p5.html');
  });
  it('replaces an empty subject list without retiring populated lists', () => {
    expect(legacyPageRedirect('SeniorFourEconomicsPastPapers.html')).toBe('/s4.html');
    expect(legacyPageRedirect('PrimaryThreeWritingPastPapers.html')).toBeUndefined();
    expect(legacyPageRedirect('MiddleClassAllPastPapers.html')).toBeUndefined();
    expect(legacyPageRedirect('SeniorThreeArtPastPapers.html')).toBeUndefined();
  });
  it('moves the reported Pdflip category copies directly to their matching lists', () => {
    expect(legacyPageRedirect('Pdflip/SeniorFourICTPastPapers.html')).toBe('/SeniorFourICTPastPapers.html');
    expect(legacyPageRedirect('Pdflip/PrimaryOneLit1LessonNotes.html')).toBe('/PrimaryOneLit1LessonNotes.html');
    expect(legacyPageRedirect('Pdflip/SeniorFourBiologyLessonNotes.html')).toBe('/SeniorFourBiologyLessonNotes.html');
  });
  it('does not invent replacements for unknown pages or create redirect loops', () => {
    expect(legacyPageRedirect('Pdflip/missing.html')).toBeUndefined();
    expect(legacyPageRedirect('menu s7.html')).toBeUndefined();
    expect(legacyPageRedirect('p4.html')).toBeUndefined();
    for (const path of publicCatalogPaths()) expect(legacyPageRedirect(path)).toBeUndefined();
  });
  it('keeps tracking variants canonicalized to the same clean class address', () => {
    const page = pageMeta({ path: '/SeniorTwoEnglishPastPapers.html', title: 'English', description: 'Past papers' });
    expect(page.links).toEqual([{ rel: 'canonical', href: 'https://fresh-teacher.github.io/SeniorTwoEnglishPastPapers.html' }]);
  });
});

describe('exact original file replacements', () => {
  it('finds the original file identity and redirects to the current reader', async () => {
    const url = 'https://fresh-teacher.github.io/s5/CRE P.1 S.5.pdf';
    vi.mocked(loadDocument).mockResolvedValue({ item: { pdfUrl: url, description: 'CRE', price: 0 }, path: 's5.html', category: 'CRE', related: [], slug: 'confirmed-cre' });
    expect(await legacyDocumentRedirect('s5/CRE P.1 S.5.pdf')).toBe('/doc/confirmed-cre');
    expect(loadDocument).toHaveBeenCalledWith(documentKey(url));
  });
  it('keeps an unrecognized file missing rather than redirecting it to a class hub', async () => {
    vi.mocked(loadDocument).mockResolvedValue(null);
    expect(await legacyDocumentRedirect('p5/deleted-paper.pdf')).toBeUndefined();
  });
  it('rejects mismatched catalog identities', async () => {
    vi.mocked(loadDocument).mockResolvedValue({ item: { pdfUrl: 'https://fresh-teacher.github.io/p5/different.pdf', description: '', price: 0 }, path: 'p5.html', category: 'P5', related: [], slug: 'wrong' });
    expect(await legacyDocumentRedirect('p5/requested.pdf')).toBeUndefined();
  });
});