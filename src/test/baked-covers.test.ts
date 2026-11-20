import { describe, expect, it } from 'vitest';
import { resourceThumb, thumbSrc } from '@/lib/resources';

const P4 = 'https://raw.githubusercontent.com/Fresh-Teacher/p4/HEAD/ALL%20EXAMS%20P.%204%20E%20O%20T%203.pdf';

describe('baked P4 covers', () => {
  it('gives an unbaked P4 record its newly baked cover', () => {
    const thumb = resourceThumb({ pdfUrl: P4 });
    expect(thumb).toMatch(/^\/thumbs\/[0-9a-f]{16}\.webp$/);
    expect(thumbSrc(thumb ?? '')).toContain('/__l5e/assets-v1/');
  });
  it('keeps an existing catalog cover', () => {
    expect(resourceThumb({ pdfUrl: P4, thumbUrl: '/thumbs/x.webp' })).toBe('/thumbs/x.webp');
  });
});
