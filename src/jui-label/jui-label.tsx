import React, { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './jui-label.css';

export interface IJuiLabel {
  id: string;
  label?: string | React.JSX.Element;
  hint?: string;
}

export const JuiLabel: FC<IJuiLabel> = ({ id, label, hint }) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLLabelElement | null>(null);

  return !label ? null : (
    <label htmlFor={id} className="jui jui-label" ref={ref}>
      <span className="text">{typeof label === 'string' ? t(label) : label}</span>

      {hint ? (
        <span className="question" aria-label={t(hint)} data-position="top" data-width="md">
          <svg width="16" height="16" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M 7.9999999,0 C 12.418399,0 16,3.5816013 16,7.9999997 16,12.418398 12.418399,16.000001 7.9999999,16.000001 3.5816015,16.000001 0,12.418398 0,7.9999997 0,3.5816013 3.5816015,0 7.9999999,0 m 0,1.6000009 a 6.3999999,6.3999999 0 1 0 0,12.7999971 6.3999999,6.3999999 0 0 0 0,-12.7999971 m 0,9.5999981 a 0.8000015,0.8000015 0 1 1 0,1.600003 0.8000015,0.8000015 0 0 1 0,-1.600003 m 0,-7.5999981 a 2.8999998,2.8999998 0 0 1 1.0783979,5.5919999 0.64000001,0.64000001 0 0 0 -0.2439851,0.160768 c -0.035136,0.04 -0.040811,0.091178 -0.04,0.144 l 0.00554,0.1031893 A 0.80000001,0.80000001 0 0 1 7.2055504,9.693526 l -0.00554,-0.093568 v -0.2 c 0,-0.9223978 0.744,-1.476002 1.2832021,-1.6928021 a 1.3008,1.3008 0 1 0 -1.7832,-1.2072 0.80000108,0.80000108 0 1 1 -1.6000021,0 2.8999998,2.8999998 0 0 1 2.8999832,-2.8999828"/>
          </svg>
        </span>
      ) : null}
    </label>
  );
};