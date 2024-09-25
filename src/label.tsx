import type  { FC, ReactNode } from 'react';
import './label.css';

export interface LabelProps {
  id: string;
  label?: string | ReactNode;
  required?: boolean;
}

export const Label: FC<LabelProps> = ({ id, label, required }) => {
  return label ? (
    <label htmlFor={id} className="jj jj-label">
      <>{label}</>
      {required ? <span className="jj-required">*</span> : null}
    </label>
  ) : null;
};