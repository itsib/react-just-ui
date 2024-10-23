import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from '../src';

describe('input.tsx', () => {
  it('render input', () => {
    render(<Input id="input-id" label="label-text" />);

    screen.getByLabelText('label-text');
  });



});