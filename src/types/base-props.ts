import React, { HTMLAttributes } from 'react';
import { ValidationError } from './validation-error.ts';

export interface LabelBaseProps {
  label?: string | React.JSX.Element;
  hint?: string | React.JSX.Element;
}

export type BaseProps<Element extends HTMLElement> = {
  id: string;
  error?: ValidationError | false;
  disabled?: boolean;
} & Omit<HTMLAttributes<Element>, 'prefix'> & LabelBaseProps;