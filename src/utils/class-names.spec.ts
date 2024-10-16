import { describe, it, expect } from 'vitest';

import { cn } from './class-names';

describe('utils/class-names.ts', () => {
  it('#cn', () => {
    expect(cn('class1', 'class2', ['class3'])).toEqual('class1 class2 class3');
  });
});