import type { SelectOption } from './_option.tsx';
import React, { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Option } from './_option.tsx';
import './_dropdown.css';

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
    <div className="jui jui-select-dropdown jui-scroll">
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
        {options.map((option, i) => (<Option key={option.value} id={id} active={i === activeIndex} icon={option.icon} label={option.label} value={option.value} onClick={onClickItemBtn} />))}
      </div>
    </div>,
    document.body,
  ) : null;
}