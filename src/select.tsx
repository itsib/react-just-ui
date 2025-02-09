import {
  type CSSProperties,
  ForwardedRef,
  forwardRef,
  MouseEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import type { BaseControlProps, SelectOption } from './types';
import { Subscript } from './subscript';
import { Label } from './label';
import { cn } from './cn';
import './select.scss';

export interface SelectProps extends BaseControlProps<HTMLInputElement> {
  options: SelectOption[];
  loading?: boolean;
}

/**
 * Select is a form control for selecting a value
 * from a set of options, similar to the native \<select\> element.
 */
export const Select = forwardRef(function Select(
  props: SelectProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const { id, markRequired, className, label, hint, error, options, loading, disabled, ..._props } = props;
  const controlRef = useRef<HTMLDivElement>(null);

  const [value, setValue] = useState<string>();
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const activeIndex = useMemo(() => (value != null ? options.findIndex(i => i.value === value) : -1), [value, options]);

  const activeLabel = options[activeIndex]?.label;
  const activeValue = options[activeIndex]?.value;
  const activeIcon = options[activeIndex]?.icon;

  function onClick(event: MouseEvent<HTMLDivElement>) {
    const input = document.getElementById(id) as HTMLInputElement;
    if (input.disabled || loading) {
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
    <div className={cn('__prefix__', '__prefix__-base-control', '__prefix__-select', className, { disabled, loading, error: !!error })}>
      <Label id={id} label={label} required={markRequired} />

      <div className="control" ref={controlRef} onClick={onClick}>
        {loading && !disabled ? <div className="overlay" /> : null}
        <input id={id} type="hidden" className="hidden-select" disabled={disabled} ref={ref} {..._props} />

        <div className="__prefix__ __prefix__-select-option select">
          {activeIcon ? (
            <Icon icon={activeIcon} value={activeValue}/>
          ) : null}
          <div className="label">{activeLabel}</div>

          <svg className="mark" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path d="M14,5l-6,6l-6,-6" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <Subscript error={error} hint={hint}/>

      <SelectDropdown
        id={id}
        activeIndex={activeIndex}
        options={options}
        open={open && !loading && !disabled}
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

export interface SelectDropdownProps {
  id: string;
  open?: boolean;
  rect: DOMRect | null;
  options: SelectOption[];
  activeIndex: number;
  onChange?: (value: string) => void;
  onDismiss?: () => void;
}

export function SelectDropdown(props: SelectDropdownProps) {
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
    const itemHeight = 40;
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

  function onClickOverlay(event: MouseEvent<HTMLDivElement>) {
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
    <div className="__prefix__ __prefix__-select-dropdown __prefix__-scroll">
      <div className="__prefix__-overlay" aria-label="dropdown overlay" onClick={onClickOverlay}/>

      <div
        className={`__prefix__ __prefix__-list ${dropdownClass}`}
        aria-label="dropdown"
        style={{
          top: `${points.top}px`,
          left: `${points.left}px`,
          width: `${points.width}px`,
          height: `${points.height}px`,
          padding: `${points.padding}px`,
          scrollPaddingTop: `${points.padding}px`,
        } as CSSProperties}
        ref={optionsRef}
      >
        {options.map((option, i) => (<Option key={option.value} id={id} active={i === activeIndex} onClick={onClickItemBtn} {...option} />))}
      </div>
    </div>,
    document.body,
  ) : null;
}

export interface OptionProps extends SelectOption {
  id: string;
  active: boolean;
  onClick: (value: string) => void;
}

export function Option(props: OptionProps) {
  const { id, active, label, icon, value, onClick } = props;

  return (
    <button
      id={active ? `${id}-active` : undefined}
      type="button"
      className={`__prefix__ __prefix__-select-option ${active ? 'active' : ''}`}
      value={value}
      onClick={() => onClick(value)}
    >
      {icon ? (
        <Icon icon={icon} value={value} />
      ) : null}
      <div className="label">{label}</div>

      {active ? (
        <svg className="mark" viewBox="0 0 16 16">
          <path fill="currentColor" d="M13.969 2.969L6.5 10.438l-4.469-4.47L.97 7.032l5.531 5.53 8.531-8.53z"/>
        </svg>
      ) : null}
    </button>
  );
}

function Icon({ icon, value }: { icon?: ReactNode; value: string; }) {
  const isImg = useMemo(() => {
    if (typeof icon === 'string') {
      return /\.(png|jpg|jpeg|bmp|icon|svg|webp)$/.test(icon);
    }
    return false;
  }, [icon])
  return (
    <div className="icon">
      {typeof icon === 'string' ? (
        <>{URL.canParse(icon) || isImg ? <img src={icon} alt={value}/> :
          <i className={icon}/>}</>
      ) : (
        <>{icon}</>
      )}
    </div>
  );
}