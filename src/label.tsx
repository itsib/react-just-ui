import type  { FC, ReactNode } from 'react';
import './label.scss';
import { prefixedCN } from './intermal/css-class';

export interface LabelProps {
  id: string;
  label?: string | ReactNode;
  required?: boolean;
}

export const Label: FC<LabelProps> = ({ id, label, required }) => {
  return label ? (
    <label htmlFor={id} className={prefixedCN('label', true)}>
      <>{label}</>
      {required ? <span className="required-marker">*</span> : null}
    </label>
  ) : null;
};