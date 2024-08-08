import React, { ForwardedRef, forwardRef, useEffect } from 'react';
import { BaseProps } from '../types';
import { JuiError } from '../jui-error/jui-error.tsx';
import { JuiLabel } from '../jui-label/jui-label.tsx';
import { useTranslation } from 'react-i18next';
import './jui-input.css';

export type IJuiInputType = 'text' | 'password' | 'email' | 'search' | 'tel' | 'url' | 'number';

export interface IJuiInput extends BaseProps<HTMLInputElement> {
  type?: IJuiInputType;
  prefix?: string | React.JSX.Element;
  suffix?: string | React.JSX.Element;
  loading?: boolean;
  placeholder?: string;
}

export const JuiInput = forwardRef(function JuiInput(
  props: IJuiInput,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const { id, className, label, hint, type: _type, prefix, suffix, loading, error, ..._props } = props;
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
    <div className={`jui jui-input ${_props.disabled ? 'disabled' : ''} ${error ? 'error' : ''} ${className ?? ''}`}>
      <JuiLabel id={id} label={label} hint={hint} />

      <div className="control">
        {prefix ? typeof prefix === 'string' ? <div className="prefix">{t(prefix)}</div> : prefix : null}
        <input id={id} type={type} ref={ref} {..._props} />
        {suffix ? typeof suffix === 'string' ? <div className="suffix">{t(suffix)}</div> : suffix : null}
      </div>

      <JuiError error={error}/>
    </div>
  );
});