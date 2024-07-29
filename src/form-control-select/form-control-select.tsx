import React, { CSSProperties, ForwardedRef, forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { BaseProps } from '../types';
import { ControlError } from '../common/control-error.tsx';
import { ControlLabel } from '../common/control-label.tsx';
import { createPortal } from 'react-dom';

export interface IFormControlOption {
  icon?: string | React.JSX.Element;
  label?: string;
  value: string;
}

export interface IFormControlSelect extends BaseProps<HTMLInputElement> {
  options: IFormControlOption[];
}

export const FormControlSelect = forwardRef(function FormControlSelect(
  props: IFormControlSelect,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const { id, className, label, hint, error, options, ..._props } = props;
  const controlRef = useRef<HTMLDivElement>(null);

  const [value, setValue] = useState<string>();
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const activeIndex = useMemo(() => (value != null ? options.findIndex(i => i.value === value) : -1), [value, options]);

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

  // Init value state
  useEffect(() => {
    const input = document.getElementById(id) as HTMLInputElement;
    setValue(input.value);
  }, [id]);

  return (
    <div className={`form-control form-control-select ${_props.disabled ? 'disabled' : ''} ${error ? 'error' : ''} ${className ?? ''}`}>
      <ControlLabel id={id} label={label} hint={hint} />

      <div className="control" ref={controlRef} onClick={onClick}>
        <input id={id} readOnly className="hidden-select" ref={ref} {..._props} />

        <div className="fake-input">
          {options[activeIndex]?.label}
        </div>

        <svg className="icon" height="16px" viewBox="0 0 16 16" width="16px" xmlns="http://www.w3.org/2000/svg">
          <path d="M14,5l-6,6l-6,-6" stroke="currentColor" fill="transparent" strokeLinecap="round"
                strokeLinejoin="round"/>
        </svg>
      </div>

      <ControlError error={!_props.disabled ? error : undefined}/>

      <FormControlDropdown
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

export interface IFormControlDropdown {
  id: string;
  open?: boolean;
  rect: DOMRect | null;
  options: IFormControlOption[];
  activeIndex: number;
  onChange?: (value: string) => void;
  onDismiss?: () => void;
}

function FormControlDropdown(props: IFormControlDropdown) {
  const { id, open, rect, options, activeIndex, onChange, onDismiss } = props;
  const [process, setProcess] = useState(false);
  const [dropdownClass, setDropdownClass] = useState<string>('animation-from');
  const optionsRef = useRef<HTMLDivElement>(null);

  const points = useMemo(() => {
    if (!rect) {
      return null;
    }
    const marginY = 10;
    const marginX = 20;
    const padding = 4;
    const itemHeight = 38;
    const itemsDisplay = Math.min(options.length, 7);
    const centerX = rect.left + (rect.width / 2);
    const centerY = rect.top + (rect.height / 2);
    const height = (itemHeight * itemsDisplay) + (padding * 2);
    const width = Math.max(rect.width, 100) + marginY;

    let left = centerX - (width / 2);
    left = left < marginX ? marginX : left;
    left = (left + width) > window.innerWidth ? window.innerWidth - width - marginX : left;

    let top = (centerY - (height / 2));
    top = top < marginY ? marginY : top;
    top = top + height > window.innerHeight ? window.innerHeight - height - marginY : top;

    const scrollY = (activeIndex - Math.floor(itemsDisplay / 2)) * itemHeight

    return { width, height, left, top, itemHeight, marginY, marginX, padding, itemsDisplay, scrollY }
  }, [rect, options.length, activeIndex])

  function onClickOverlay(event: React.MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
    onDismiss?.();
  }

  function onClickItemBtn(_value: string) {
    onDismiss?.();
    onChange?.(_value);
  }

  // Manage display animation
  useEffect(() => {
    setProcess(true);
    if (open) {
      setTimeout(() => {
        setDropdownClass('');

      }, 10);
    } else {
      setTimeout(() => setDropdownClass('animation-out'), 10);

      setTimeout(() => {
        setDropdownClass('animation-from');
        setProcess(false);
      }, 300);
    }
  }, [open]);

  // Scroll to selected element
  useEffect(() => {
    if (!open || points?.scrollY == null) {
      return;
    }

    const scrollY = points.scrollY;
    const timer = setTimeout(() => {
      const div = optionsRef.current;
      if (!div) {
        return;
      }
      div!.scrollBy(0, scrollY)
    }, 30);
    return () => clearTimeout(timer);
  }, [points?.scrollY, open]);

  return (process || open) && rect && points ? createPortal(
    <div className="form-control-dropdown">
      <div className="select-dropdown-overlay" aria-label="dropdown overlay" onClick={onClickOverlay}/>

      <div
        className={`select-dropdown-options ${dropdownClass}`}
        aria-label="dropdown"
        style={{
          '--rfc-dropdown-top': `${points.top}px`,
          '--rfc-dropdown-left': `${points.left}px`,
          '--rfc-dropdown-width': `${points.width}px`,
          '--rfc-dropdown-height': `${points.height}px`,
          '--rfc-dropdown-item-height': `${points.itemHeight}px`,
          '--rfc-dropdown-padding': `${points.padding}px`,
        } as CSSProperties}
        ref={optionsRef}
      >
        {options.map((option, i) => (<Option key={option.value} id={id} active={i === activeIndex} icon={option.icon} label={option.label} value={option.value} onClick={onClickItemBtn} />))}
      </div>
    </div>,
    document.body,
  ) : null;
}

function Option(props: IFormControlOption & { id: string; active: boolean; onClick: (value: string) => void }) {
  const { id, active, label, value, onClick } = props;

  return (
    <button
      id={active ? `${id}-active` : undefined}
      type="button"
      className={`btn btn-option ${active ? 'active' : ''}`}
      value={value}
      onClick={() => onClick(value)}
    >
      <span>{label}</span>
    </button>
  );
}