import React, { ForwardedRef, forwardRef } from 'react';
import { BaseProps } from '../types';
import { ControlError } from '../common/control-error.tsx';
import { ControlLabel } from '../common/control-label.tsx';
import { useTranslation } from 'react-i18next';

export type IFormControlInputType = 'text' | 'password' | 'email' | 'search' | 'tel' | 'url';

export interface IFormControlInput extends BaseProps<HTMLInputElement> {
  type?: IFormControlInputType;
  prefix?: string | React.JSX.Element;
  suffix?: string | React.JSX.Element;
}

export const FormControlInput = forwardRef(function FormControlInput(
  props: IFormControlInput,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const { id, className, label, hint, type, prefix, suffix, error, ..._props } = props;
  const { t } = useTranslation();

  return (
    <div className={`form-control form-control-input ${_props.disabled ? 'disabled' : ''} ${error ? 'error' : ''} ${className ?? ''}`}>
      <ControlLabel id={id} label={label} hint={hint} />

      <div className="control">
        {typeof prefix === 'string' ? t(prefix) : prefix}
        <input id={id} type={type} ref={ref} {..._props} />
        {typeof suffix === 'string' ? t(suffix) : suffix}
      </div>

      <ControlError error={!_props.disabled ? error : undefined} />
    </div>
  );
});