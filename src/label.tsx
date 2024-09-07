import { type FC, useRef, type ReactNode } from 'react';
import './label.css';

export interface LabelProps {
  id: string;
  label?: string | ReactNode;
  required?: boolean;
  hint?: string;
}

export const Label: FC<LabelProps> = ({ id, label, required, hint }) => {
  const ref = useRef<HTMLLabelElement | null>(null);

  return !label ? null : (
    <label htmlFor={id} className="jui jui-label" ref={ref}>
      <span className="jui-text">{label}</span>
      {required ? <span className="jui-required">*</span> : null}

      {hint ? (
        <span className="jui-question" aria-label={hint} data-position="top" data-width="md">
          <svg width="16" height="16" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M 8,0 C 12.418,0 16,3.58 16,8 16,12.418 12.418,16 8,16 3.58,16 0,12.418 0,8 0,3.58 3.58,0 8,0 m 0,1.6 a 6.4,6.4 0 1 0 0,12.8 6.4,6.4 0 0 0 0,-12.8 m 0,9.6 a 0.8,0.8 0 1 1 0,1.6 0.8,0.8 0 0 1 0,-1.6 m 0,-7.6 a 2.9,2.9 0 0 1 1.078,5.59 0.64,0.64 0 0 0 -0.24,0.16 c -0.035,0.04 -0.04,0.091 -0.04,0.144 l 0,0.1 A 0.8,0.8 0 0 1 7.2,9.7 l 0,-0.1 v -0.2 c 0,-0.92 0.74,-1.48 1.28,-1.69 a 1.3,1.3 0 1 0 -1.78,-1.2 0.8,0.8 0 1 1 -1.6,0 2.9,2.9 0 0 1 2.9,-2.9"/>
          </svg>
        </span>
      ) : null}
    </label>
  );
};