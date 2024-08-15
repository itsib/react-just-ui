import React, { ForwardedRef, forwardRef, useEffect } from 'react';
import { BaseControlProps } from '../types';
import { cn } from '../utils';
import { ErrorMessage } from '../jui-error-message/jui-error-message.tsx';
import { Label } from '../jui-label/jui-label.tsx';
import './jui-input.css';

export type InputType = 'text' | 'password' | 'email' | 'search' | 'tel' | 'url' | 'number';

export interface InputProps extends BaseControlProps<HTMLInputElement> {
  type?: InputType;
  prefix?: string | React.JSX.Element;
  suffix?: string | React.JSX.Element;
  loading?: boolean;
  placeholder?: string;
}

export const Input = forwardRef(function Input(
  props: InputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const { id, className, label, hint, type: _type, prefix, suffix, loading, error, ..._props } = props;
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
    <div className={cn(['jui', 'jui-input'], { disabled: !!_props.disabled, error: !!error, loading: !!loading }, className)}>
      <Label id={id} label={label} hint={hint} />

      <div className="control">
        <div className="loader-backdrop"><span className="jui-loading" /></div>
        {prefix ? typeof prefix === 'string' ? <div className="prefix">{prefix}</div> : prefix : null}
        <input id={id} type={type} ref={ref} {..._props} />
        {suffix ? typeof suffix === 'string' ? <div className="suffix">{suffix}</div> : suffix : null}
      </div>

      <ErrorMessage error={error}/>
    </div>
  );
});