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
  placeholder?: string;
  focusMode?: 'auto' | 'manual'
}

export const FormControlInput = forwardRef(function FormControlInput(
  props: IFormControlInput,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const { id, className, label, hint, type: _type, prefix, suffix, error, focusMode = 'auto', ..._props } = props;
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

  useEffect(() => {
    if (focusMode === 'auto') {
      return;
    }
    const input = document.getElementById(id) as HTMLInputElement;
    const container = input.parentElement!.parentElement!;
    let flashInterval: ReturnType<typeof setInterval>;
    let isCursor = false;
    let isKeyPressed = false;
    let placeholder: string = ''

    const removeCaret = () => {
      if (isCursor) {
        input.value = input.value.replace(/\|$/, '');
        isCursor = false;
        return;
      }
    }

    const onFocus = () => {
      placeholder = input.placeholder;
      input.placeholder = '';
      container.classList.add('focus');

      flashInterval = setInterval(() => {
        if (isCursor || isKeyPressed) {
          removeCaret();
          return;
        }
        if (input.selectionStart === input.selectionEnd && input.value.length === input.selectionEnd) {
          input.value = `${input.value}|`;
          isCursor = true;
        }
      }, 500);
    };

    const onBlur = () => {
      input.placeholder = placeholder;
      removeCaret();
      container.classList.remove('focus');
      clearInterval(flashInterval);
    };

    const onKeydown = () => {
      removeCaret();
      isKeyPressed = true;
    }

    const onKeyup = () => {
      removeCaret();
      isKeyPressed = false;
    }

    input.addEventListener('focus', onFocus);
    input.addEventListener('blur', onBlur);
    input.addEventListener('keydown', onKeydown);
    input.addEventListener('keyup', onKeyup);
    return () => {
      input.removeEventListener('focus', onFocus);
      input.removeEventListener('blur', onBlur);
      input.removeEventListener('keydown', onKeydown);
      input.removeEventListener('keyup', onKeyup);
    };
  }, [id, focusMode]);

  return (
    <div className={`rfc rfc-input ${_props.disabled ? 'disabled' : ''} ${error ? 'error' : ''} focus-${focusMode} ${className ?? ''}`}>
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