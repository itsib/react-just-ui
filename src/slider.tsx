import { CSSProperties, type ForwardedRef, forwardRef, useEffect, useRef } from 'react';
import type { BaseControlProps } from './types';
import { cn } from './utils/cn';
import { Label } from './label';
import { Subscript } from './subscript';
import { parseValue, parseValues } from './utils/parse-value';
import './slider.scss';

export interface SliderProps extends Omit<BaseControlProps<HTMLInputElement>, 'size'> {
  /**
   * Enables the double slider mode.
   * To select the minimum and maximum values.
   * For example, to select a price range in
   * the product list filter.
   *
   * In this mode, the value field looks like
   * two numbers separated by `:`. For example:
   * `2.3:10`
   *
   * @default false
   */
  dual?: boolean;
  /**
   * Slider height, if orient property is equal
   * horizontal. Otherwise, this property
   * set up slider with
   *
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * the orient attribute defines the orientation
   * of the slider.
   *
   * @default 'horizontal'
   */
  orient?: 'horizontal' | 'vertical';
  /**
   * The lowest value in the range of permitted values.
   * If the value of the element is less than this,
   * the element fails constraint validation.
   *
   * @default 0
   */
  min?: number;
  /**
   * The greatest value in the range of permitted values.
   * If the value entered into the element exceeds this,
   * the element fails constraint validation.
   *
   * @default 100
   */
  max?: number;
  /**
   * The step attribute is a number that
   * specifies the granularity that the
   * value must adhere to.
   *
   * @default 1
   */
  step?: number;
}

/**
 * An input where the user selects a value from within a given range. Work like input type range.
 *
 * #### Features:
 *
 * - Can be controlled or uncontrolled.
 * - Supports single thumb and duo thumb mode.
 * - Supports mobile touch events and mouse events.
 * - Horizontal and vertical layout.
 * - Full keyboard navigation.
 * - The interface follows the interface of the native HTML input as much as possible.
 * - [React Hook Form](https://react-hook-form.com/) full supports.
 *
 */
export const Slider = forwardRef(function Slider(
  props: SliderProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const {
    id,
    dual,
    size = 'md',
    min: _min = 0,
    max: _max = 100,
    step = 1,
    tabIndex = -1,
    orient = 'horizontal',
    markRequired,
    className,
    label,
    hint,
    disabled,
    error,
    style,
    ..._props
  } = props;
  const trackWidth = size === 'sm' ? 6 : size === 'md' ? 8 : 10;
  const thumbSize = size === 'sm' ? 14 : size === 'md' ? 18 : 24;
  const [min, max] = _min < _max ? [_min, _max] : [_max, _min];

  const sliderRef = useRef<HTMLDivElement | null>(null);

  // Slider control handlers
  useEffect(() => {
    const slider = sliderRef.current as HTMLDivElement;
    const input = slider.previousElementSibling as HTMLInputElement;
    const thumbs = slider.getElementsByClassName('thumb');
    const thumbStart = thumbs.item(0) as HTMLDivElement;
    const thumbEnd = thumbs.item(1) as HTMLDivElement;

    let valueStart: number | null = null;
    let valueEnd: number | null = null;
    let offset: number | null = null;
    let thumbDragged: 'start' | 'end' | null = null;

    function startDrag(event: PointerEvent) {
      const rect = slider.getBoundingClientRect();
      offset = orient === 'horizontal' ? rect.left : rect.top;

      // Slider mouse press handler
      if (event.target === slider) {
        offset += thumbSize / 2;

        if (dual) {
          const mouseOffset = orient === 'horizontal' ? event.offsetX : event.offsetY;
          const thumbStartOffset = _getThumbOffset(thumbStart);
          const thumbEndOffset = _getThumbOffset(thumbEnd);

          if (mouseOffset < thumbStartOffset) {
            thumbDragged = 'start';
          } else if (mouseOffset > thumbEndOffset) {
            thumbDragged = 'end';
          } else {
            const center = (thumbStartOffset - thumbEndOffset - thumbSize) / 2;
            thumbDragged = mouseOffset < (thumbStartOffset - center) ? 'start' : 'end';
          }
        } else {
          thumbDragged = 'end';
        }
        moveDrag(event);
      }
      // Thumb press handler
      else if (event.target === thumbStart || event.target === thumbEnd) {
        thumbDragged = event.target === thumbStart ? 'start' : 'end';
        offset += orient === 'horizontal' ? event.offsetX : event.offsetY;
      }

      const thumb = thumbDragged === 'start' ? thumbStart : thumbEnd;
      thumb.focus();
      thumb.classList.add('active');

      slider.setPointerCapture(event.pointerId);
      slider.classList.add('grabbing');

      _setUserSelect(false);
    }

    function stopDrag(event: PointerEvent) {
      thumbDragged = null;
      thumbStart.classList.remove('active');
      thumbEnd.classList.remove('active');

      slider.releasePointerCapture(event.pointerId);
      slider.classList.remove('grabbing');
      _setUserSelect(true);
    }

    function moveDrag(event: PointerEvent): void {
      if (!thumbDragged || offset == null) return;

      const mouseOffset = (orient === 'horizontal' ? event.clientX : event.clientY) - offset;

      if (thumbDragged === 'start') {
        let offset: number;
        if (orient === 'horizontal') {
          offset = Math.min(Math.max(0, mouseOffset), _getThumbOffset(thumbEnd));
        } else {
          offset = Math.min(Math.max(_getThumbOffset(thumbEnd), mouseOffset), _getRailSize());
        }
        const value = _offsetToValue(offset);
        const thumbStartOffset = _valueToOffset(valueEnd! >= value ? value : valueEnd! - step);
        _setThumbStartOffset(thumbStartOffset);
      } else {
        let offset: number;
        if (orient === 'horizontal') {
          offset = Math.min(Math.max(_getThumbOffset(thumbStart), mouseOffset), _getRailSize());
        } else {
          offset = Math.min(Math.max(0, mouseOffset), _getThumbOffset(thumbStart));
        }
        const value = _offsetToValue(offset);
        const thumbEndOffset = _valueToOffset(valueStart! <= value ? value : valueStart! + step);
        _setThumbEndOffset(thumbEndOffset);
      }

      _fireChange();
    }

    function _fireChange(): void {
      const event = new Event('change', { bubbles: true });
      input.dispatchEvent(event);
    }

    function _getRailSize() {
      return (orient === 'horizontal' ? slider.offsetWidth : slider.offsetHeight) - thumbSize;
    }

    function _valueToOffset(value: number): number {
      const railSize = _getRailSize();
      let offset: number;
      if (orient === 'horizontal') {
        offset = railSize * ((value - min) / (max - min));
      } else {
        offset = railSize * (1 - (value - min) / (max - min));
      }
      return offset;
    }

    function _offsetToValue(offset: number): number {
      let value: number;
      if (orient === 'horizontal') {
        value = min + (max - min) * (offset / _getRailSize());
      } else {
        value = max - (max - min) * (offset / _getRailSize());
      }
      return parseValue(`${value}`, min, max, step);
    }

    function _getThumbOffset(thumb: HTMLDivElement) {
      return orient === 'horizontal' ? thumb.offsetLeft : thumb.offsetTop;
    }

    function _updateThumbStart(value: number) {
      slider.style.setProperty('--slider-thumb-start', `${_valueToOffset(value)}px`);
      thumbStart.setAttribute('aria-valuenow', `${value}`);
      thumbStart.style.zIndex = '4';
      thumbEnd.style.zIndex = '3';
      valueStart = value;
    }

    function _updateThumbEnd(value: number) {
      slider.style.setProperty('--slider-thumb-end', `${_valueToOffset(value)}px`);
      thumbEnd.setAttribute('aria-valuenow', `${value}`);
      thumbEnd.style.zIndex = '4';
      thumbStart.style.zIndex = '3';
      valueEnd = value;
    }

    function _setThumbStartOffset(offset: number): void {
      const value = _offsetToValue(offset);

      _updateThumbStart(value);
    }

    function _setThumbEndOffset(offset: number): void {
      const value = _offsetToValue(offset);

      _updateThumbEnd(value);
    }

    function _applyValue(value: string) {
      if (value.includes(':') && !dual) {
        const values = value.split(':');
        values[0] = `${min}`;
        value = values.join(':');
      }

      const _values = parseValues(value, min, max, step);
      valueStart = _values[0];
      valueEnd = _values[1];

      _updateThumbStart(valueStart);
      _updateThumbEnd(valueEnd);
    }

    function _setUserSelect(allow: boolean) {
      document.body.style.userSelect = allow ? 'auto' : 'none';
    }

    if (input.value) _applyValue(input.value);
    Object.defineProperty(input, 'value', {
      get: () => {
        const _valueStart = valueStart ?? min;
        const _valueEnd = valueEnd ?? (min + (max - min) / 2);
        if (dual) {
          return `${_valueStart}:${_valueEnd}`;
        }
        return `${_valueEnd}`;
      },
      set: (_value: string) => {
        if (thumbDragged) return;
        _applyValue(_value);
      },
    });

    thumbStart.style.display = dual ? 'block' : 'none';

    slider.addEventListener('pointerdown', startDrag);
    slider.addEventListener('pointermove', moveDrag);
    slider.addEventListener('pointerup', stopDrag);
    slider.addEventListener('pointercancel', stopDrag);

    return () => {
      slider.removeEventListener('pointerdown', startDrag);
      slider.removeEventListener('pointermove', moveDrag);
      slider.removeEventListener('pointerup', stopDrag);
      slider.removeEventListener('pointercancel', stopDrag);
    };
  }, [dual, min, max, step, orient, thumbSize]);

  return (
    <div className={cn('__prefix__', '__prefix__-slider', orient, className, { disabled, error: !!error })} style={style}>
      <Label id={id} label={label} required={markRequired}/>

      <div
        className="control"
        style={{
          '--slider-track-width': `${trackWidth}px`,
          '--slider-thumb-size': `${thumbSize}px`,
        } as CSSProperties}
      >
        <input id={id} tabIndex={-1} type="text" ref={ref} disabled={disabled} {..._props} />
        <div ref={sliderRef} className="slider-root">
          <div className="track"/>
          <div className="track track-active"/>

          <div
            className="thumb thumb-start"
            role="slider"
            tabIndex={tabIndex}
            aria-valuemin={min}
            aria-valuenow={0}
            aria-valuetext=""
            aria-valuemax={max}
            aria-labelledby={id}
            aria-orientation={orient}
          />

          <div
            className="thumb thumb-end"
            role="slider"
            tabIndex={tabIndex}
            aria-valuemin={min}
            aria-valuenow={0}
            aria-valuetext=""
            aria-valuemax={max}
            aria-labelledby={id}
            aria-orientation={orient}
          />
        </div>
      </div>

      <Subscript error={error} hint={hint}/>
    </div>
  );
});
