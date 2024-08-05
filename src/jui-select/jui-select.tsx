import React, { CSSProperties, ForwardedRef, forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { BaseProps } from '../types';
import { JuiError } from '../jui-error/jui-error.tsx';
import { JuiLabel } from '../jui-label/jui-label.tsx';
import { createPortal } from 'react-dom';
import './jui-select.css';

export interface IJuiSelectOption {
  icon?: string | React.JSX.Element;
  label?: string;
  value: string;
}

export interface IJuiSelect extends BaseProps<HTMLInputElement> {
  options: IJuiSelectOption[];
}

export const JuiSelect = forwardRef(function JuiSelect(
  props: IJuiSelect,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const { id, className, label, hint, error, options, ..._props } = props;
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

  // Init value state
  useEffect(() => {
    const input = document.getElementById(id) as HTMLInputElement;
    setValue(input.value);
  }, [id]);

  return (
    <div className={`jui jui-select ${_props.disabled ? 'disabled' : ''} ${error ? 'error' : ''} ${className ?? ''}`}>
      <JuiLabel id={id} label={label} hint={hint} />

      <div className="control" ref={controlRef} onClick={onClick}>
        <input id={id} readOnly className="hidden-select" ref={ref} {..._props} />

        <div className="fake-input">
          {activeIcon ? (
            <div className="icon">
              {typeof activeIcon === 'string' ? <i className={activeIcon} /> : <>{activeIcon}</>}
            </div>
          ) : null}
          <div className="label">{activeLabel}</div>
        </div>

        <svg className="drop" height="16px" viewBox="0 0 16 16" width="16px" xmlns="http://www.w3.org/2000/svg">
          <path d="M14,5l-6,6l-6,-6" stroke="currentColor" fill="transparent" strokeLinecap="round"
                strokeLinejoin="round"/>
        </svg>
      </div>

      <JuiError error={!_props.disabled ? error : undefined}/>

      <JuiSelectDropdown
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

export interface IJuiSelectDropdown {
  id: string;
  open?: boolean;
  rect: DOMRect | null;
  options: IJuiSelectOption[];
  activeIndex: number;
  onChange?: (value: string) => void;
  onDismiss?: () => void;
}

export function JuiSelectDropdown(props: IJuiSelectDropdown) {
  const { id, open, rect, options, activeIndex, onChange, onDismiss } = props;
  const [process, setProcess] = useState(false);
  const [dropdownClass, setDropdownClass] = useState<string>('animation-from');
  const optionsRef = useRef<HTMLDivElement>(null);

  const points = useMemo(() => {
    if (!rect) {
      return null;
    }
    const margin = 10;
    const padding = 4;
    const itemHeight = 38;
    const itemsDisplay = Math.min(options.length, 7);
    const centerX = rect.left + (rect.width / 2);
    const centerY = rect.top + (rect.height / 2);
    const height = (itemHeight * itemsDisplay) + (padding * 2);
    const width = Math.min(Math.max(rect.width, 100) + (margin * 2), window.innerWidth - 4);

    let left = centerX - (width / 2);
    left = left < 2 ? 2 : left;

    let top = (centerY - (height / 2));
    top = top < margin ? margin : top;
    top = top + height > window.innerHeight ? window.innerHeight - height - margin : top;

    const scrollY = (activeIndex - Math.floor(itemsDisplay / 2)) * itemHeight

    return { width, height, left, top, itemHeight, margin, padding, itemsDisplay, scrollY }
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
    <div className="jui jui-select-dropdown">
      <div className="jui-overlay" aria-label="dropdown overlay" onClick={onClickOverlay}/>

      <div
        className={`jui-dropdown-options ${dropdownClass}`}
        aria-label="dropdown"
        style={{
          '--jui-dropdown-top': `${points.top}px`,
          '--jui-dropdown-left': `${points.left}px`,
          '--jui-dropdown-width': `${points.width}px`,
          '--jui-dropdown-height': `${points.height}px`,
          '--jui-dropdown-item-height': `${points.itemHeight}px`,
          '--jui-dropdown-padding': `${points.padding}px`,
        } as CSSProperties}
        ref={optionsRef}
      >
        {options.map((option, i) => (<JuiSelectOption key={option.value} id={id} active={i === activeIndex} icon={option.icon} label={option.label} value={option.value} onClick={onClickItemBtn} />))}
      </div>
    </div>,
    document.body,
  ) : null;
}

export interface IJuiSelectOptionProps extends IJuiSelectOption {
  id: string;
  active: boolean;
  onClick: (value: string) => void;
}

export function JuiSelectOption(props: IJuiSelectOptionProps) {
  const { id, active, label, icon, value, onClick } = props;

  return (
    <button
      id={active ? `${id}-active` : undefined}
      type="button"
      className={`jui-option ${active ? 'active' : ''}`}
      value={value}
      onClick={() => onClick(value)}
    >
      {icon ? (
        <div className="icon">
          {typeof icon === 'string' ? <i className={icon} /> : <>{icon}</>}
        </div>
      ) : null}
      <div className="label">{label}</div>

      {active ? (
        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" className="active">
          <path d="M13.969 2.969L6.5 10.438l-4.469-4.47L.97 7.032l5.531 5.53 8.531-8.53z" fill="currentColor"/>
        </svg>
      ) : null}
    </button>
  );
}