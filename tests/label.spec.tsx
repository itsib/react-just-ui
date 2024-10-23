import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Label } from '../src';

describe('label.tsx', () => {
  it('render label', () => {
    render(<Label id="label-id" label="label-text" />);

    const labelNode = screen.getByText('label-text');

    expect(labelNode.getAttribute('for')).toEqual('label-id');
    expect(labelNode.innerHTML).toEqual('label-text');
  });

  it('render label with required', () => {
    const { container } = render(<Label id="label-id" label="label-text" required />);

    screen.getByText('label-text');
    const markerNode = container.querySelector('.required-marker');

    expect(markerNode).not.toBeNull();
    expect(markerNode!.innerHTML).toEqual('*');
  });

  it('no label if label prop empty', () => {
    const { container } = render(<Label id="label-id" label="" />);
    expect(container.innerHTML).toEqual('');
  });
});