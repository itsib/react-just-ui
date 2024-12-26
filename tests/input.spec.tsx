import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from '../src';

describe('input.tsx', () => {
  it('render input', () => {
    const { container } = render(<Input id="input-id" label="label-text" />);

    const wrapper = container.getElementsByTagName('div').item(0);
    expect(wrapper).toBeDefined();

    expect(wrapper?.className).toMatch(/ \w+-input$/);
  });

  it('render disabled input', () => {
    const { container } = render(<Input id="input-id" label="label-text" disabled />);

    const wrapper = container.getElementsByTagName('div').item(0);
    if (!wrapper) return;

    expect(wrapper.classList.contains('disabled')).toBeTruthy();
    expect(wrapper.querySelector('input')?.disabled).toBeTruthy();
  });

  it('render input with prefix and suffix', () => {
    render(<Input id="input-id" label="label-text" prefix="TP" suffix="TS" />);

    screen.getByText('TP');
    screen.getByText('TS');
  });
});