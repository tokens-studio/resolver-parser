import path from 'node:path';
import { describe, it, expect } from 'vitest';
import { parser } from '../src/parser.js';

describe('resolver', () => {
  it('should work', async () => {
    const resolverPath = path.resolve(import.meta.dirname, 'fixtures', 'basic', 'resolver.json');
    const result = await parser(resolverPath);

    expect(result).toEqual([
      {
        modifiers: { _: '_', density: 'high', theme: 'light' },
        sets: [
          'core/colors.json',
          'core/dimensions',
          'components/accordion.json',
          'components/button.json',
          'density/high.json',
          'themes/light.json',
        ],
      },
      {
        modifiers: { _: '_', density: 'low', theme: 'light' },
        sets: [
          'core/colors.json',
          'core/dimensions',
          'components/accordion.json',
          'components/button.json',
          'density/low.json',
          'themes/light.json',
        ],
      },
      {
        modifiers: { _: '_', density: 'high', theme: 'dark' },
        sets: [
          'core/colors.json',
          'core/dimensions',
          'components/accordion.json',
          'components/button.json',
          'density/high.json',
          'themes/dark.json',
        ],
      },
      {
        modifiers: { _: '_', density: 'low', theme: 'dark' },
        sets: [
          'core/colors.json',
          'core/dimensions',
          'components/accordion.json',
          'components/button.json',
          'density/low.json',
          'themes/dark.json',
        ],
      },
    ]);
  });
});
