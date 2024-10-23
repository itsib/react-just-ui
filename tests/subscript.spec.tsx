import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Subscript } from '../src';

describe('subscript.tsx', () => {
  it('render subscript', () => {
    render(<Subscript />);

    const elementNode = screen.getByRole('alert');
    const errorNode = elementNode.getElementsByClassName('error').item(0);
    const hintNode = elementNode.getElementsByClassName('hint').item(0);

    expect(errorNode).not.toBeNull();
    expect(hintNode).not.toBeNull();
    expect(errorNode!.innerHTML).toEqual('');
    expect(hintNode!.innerHTML).toEqual('');
  });

  it('render error message', () => {
    const error = { message: 'error-message' }
    render(<Subscript error={error} />);

    screen.getByText('error-message');
  });

  it('render hint message', () => {
    render(<Subscript hint="hint-message" />);

    screen.getByText('hint-message');
  });
});