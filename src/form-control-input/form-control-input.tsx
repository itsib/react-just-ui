import React, { ForwardedRef, forwardRef, useEffect } from 'react';
import { BaseProps } from '../types';
import { ControlError } from '../common/control-error.tsx';
import { ControlLabel } from '../common/control-label.tsx';
import { useTranslation } from 'react-i18next';

export type IFormControlInputType = 'text' | 'password' | 'email' | 'search' | 'tel' | 'url' | 'number';

export interface IFormControlInput extends BaseProps<HTMLInputElement> {
  type?: IFormControlInputType;
  prefix?: string | React.JSX.Element;
  suffix?: string | React.JSX.Element;
}

export const FormControlInput = forwardRef(function FormControlInput(
  props: IFormControlInput,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const { id, className, label, hint, type: _type, prefix, suffix, error, ..._props } = props;
  const { t } = useTranslation();
  const type = _type === 'number' ? 'text' : _type;

  useEffect(() => {
    if (_type !== 'number') {
      return;
    }
    const input = document.getElementById(id) as HTMLInputElement;

    const onBefore = (event: InputEvent) => {
      const _input = event.target as HTMLInputElement;
      const value = _input.value;

      if (event.inputType === 'insertText') {
        if (!event.data?.match(value.includes('.') ? /^\d$/ : /^[\d.]$/)) {
          return event.preventDefault();
        }
      }
    }

    input.addEventListener('beforeinput', onBefore);
    return () => {
      input.removeEventListener('beforeinput', onBefore);
    };
  }, [_type, id]);

  return (
    <div className={`form-control form-control-input ${_props.disabled ? 'disabled' : ''} ${error ? 'error' : ''} ${className ?? ''}`}>
      <ControlLabel id={id} label={label} hint={hint} />

      <div className="control">
        {prefix ? <div className="fix prefix">{typeof prefix === 'string' ? t(prefix) : prefix}</div> : null}
        <input id={id} type={type} ref={ref} {..._props} />
        {suffix ? <div className="fix suffix">{typeof suffix === 'string' ? t(suffix) : suffix}</div> : null}
      </div>

      <ControlError error={!_props.disabled ? error : undefined} />
    </div>
  );
});