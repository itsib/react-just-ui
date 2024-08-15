import React, { ForwardedRef, forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { BaseControlProps } from '../types';
import { cn } from '../utils';
import { ErrorMessage } from '../jui-error-message/jui-error-message.tsx';
import { Label } from '../jui-label/jui-label.tsx';
import { SelectDropdown } from './_dropdown.tsx';
import type { SelectOption } from './_option.tsx';
import './jui-select.css';

export interface SelectProps extends BaseControlProps<HTMLInputElement> {
  options: SelectOption[];
  loading?: boolean;
}

export const Select = forwardRef(function Select(
  props: SelectProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const { id, className, label, hint, error, options, loading, ..._props } = props;
  const controlRef = useRef<HTMLDivElement>(null);

  const [value, setValue] = useState<string>();
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const activeIndex = useMemo(() => (value != null ? options.findIndex(i => i.value === value) : -1), [value, options]);

  const activeLabel = options[activeIndex]?.label;
  const activeIcon = options[activeIndex]?.icon;

  function onClick(event: React.MouseEvent<HTMLDivElement>) {
    const input = document.getElementById(id) as HTMLInputElement;
    if (input.disabled) {
      return;
    }
    input.focus();
    const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
    setRect(rect);
    setOpen(true);
  }

  function onChangeCallback(_value: string) {
    setValue(_value);

    const select = document.getElementById(id) as HTMLSelectElement;

    const event = new CustomEvent('change');
    select.value = _value;
    select.dispatchEvent(event);
    _props.onChange?.(event as never);
  }

  // Init value state and watch to value change
  useEffect(() => {
    const input = document.getElementById(id) as HTMLInputElement;
    let value = input.value;

    Object.defineProperty(input, 'value', {
      get(): any {
        return value;
      },
      set(_value: any) {
        setValue(_value);
        value = _value;
      }
    });

    setValue(input.value);
  }, [id]);

  return (
    <div className={cn(['jui', 'jui-select'], { disabled: !!_props.disabled, error: !!error, loading: !!loading }, className)}>
      <Label id={id} label={label} hint={hint} />

      <div className="control" ref={controlRef} onClick={onClick}>
        <div className="loader-backdrop"><span className="jui-loading"/></div>
        <input id={id} readOnly className="hidden-select" ref={ref} {..._props} />

        <div className="fake-input">
          {activeIcon ? (
            <div className="icon">
              {typeof activeIcon === 'string' ? <i className={activeIcon}/> : <>{activeIcon}</>}
            </div>
          ) : null}
          <div className="label">{activeLabel}</div>
        </div>

        <svg className="drop" height="16px" viewBox="0 0 16 16" width="16px" xmlns="http://www.w3.org/2000/svg">
          <path d="M14,5l-6,6l-6,-6" stroke="currentColor" fill="transparent" strokeLinecap="round"
                strokeLinejoin="round"/>
        </svg>
      </div>

      <ErrorMessage error={error}/>

      <SelectDropdown
        id={id}
        activeIndex={activeIndex}
        options={options}
        open={open}
        rect={rect}
        onDismiss={() => {
          setOpen(false);
          (document.getElementById(id) as HTMLInputElement).focus();
        }}
        onChange={onChangeCallback}
      />
    </div>
  );
});
