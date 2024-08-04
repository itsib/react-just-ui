import React, { AllHTMLAttributes } from 'react';
import { ValidationError } from './validation-error.ts';

export interface LabelBaseProps {
  label?: string | React.JSX.Element;
  hint?: string;
}

export type BaseProps<Element extends HTMLElement> = {
  id: string;
  error?: ValidationError | false;
  disabled?: boolean;
} & Omit<AllHTMLAttributes<Element>, 'prefix' | 'label'> & LabelBaseProps;