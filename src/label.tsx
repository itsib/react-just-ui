import type  { FC, ReactNode } from 'react';
import './label.scss';

export interface LabelProps {
  id: string;
  label?: string | ReactNode;
  required?: boolean;
}

export const Label: FC<LabelProps> = ({ id, label, required }) => {
  return label ? (
    <label htmlFor={id} className="__prefix__ __prefix__-label">
      <>{label}</>
      {required ? <span className="required-marker">*</span> : null}
    </label>
  ) : null;
};