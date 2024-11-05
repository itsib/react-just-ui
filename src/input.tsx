import { type ForwardedRef, forwardRef, useEffect, type ReactNode } from 'react';
import type { BaseControlProps } from './types';
import { Subscript } from './subscript';
import { Label } from './label';
import './input.scss';

export type InputType = 'text' | 'password' | 'email' | 'search' | 'tel' | 'url' | 'number';

export interface InputProps extends BaseControlProps<HTMLInputElement> {
  /**
   * Determines which data the user will enter.
   * This affects which keyboard will be active when
   * filling in, on mobile devices. It also affects
   * which normalizer water will be used. For example,
   * if type="number", then it will be possible
   * to enter only numbers.
   */
  type?: InputType;
  /**
   * The prefix can be used as a sign of the
   * payment currency to be entered,
   * for example, for the amount input
   * fields. It will be inserted before
   * the input field.
   */
  prefix?: ReactNode;
  /**
   * The same as the prefix but will be
   * inserted at the end of the input field
   */
  suffix?: ReactNode;
  /**
   * Show the loading indicator.
   * Blocks the input field.
   */
  loading?: boolean;
  /**
   * The text that will be displayed in
   * the input field while nothing has been
   * entered there yet.
   */
  placeholder?: string;
}

/**
 * The form element is for single-line text input.
 * It has exactly the same interface as the standard
 * HTMLInputElement, with additional display functions,
 * see bellow.
 */
export const Input = forwardRef(function Input(
  props: InputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const { id, required, className, label, hint, type: _type, prefix, suffix, loading, disabled, error, ..._props } = props;
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
    <div className={`__prefix__ __prefix__-input ${className || ''} ${disabled ? 'disabled' : ''} ${loading ? 'loading' : ''} ${error ? 'error' : ''}`}>
      <Label id={id} label={label} required={required} />

      <div className="control">
        {!disabled && loading ? <div className="overlay"></div> : null}
        {prefix ? typeof prefix === 'string' ? <div className="prefix">{prefix}</div> : prefix : null}
        <input
          id={id}
          type={type}
          disabled={disabled}
          required={required}
          aria-label={typeof label === 'string' ? label : undefined}
          ref={ref}
          {..._props}
        />
        {suffix ? typeof suffix === 'string' ? <div className="suffix">{suffix}</div> : suffix : null}
      </div>

      <Subscript error={error} hint={hint}/>
    </div>
  );
});