import { CSSProperties, type ForwardedRef, forwardRef, useEffect } from 'react';
import type { BaseControlProps } from './types';
import { cn } from './utils/cn';
import { Label } from './label';
import { Subscript } from './subscript';
import './slider.scss';

export interface SliderProps extends Omit<BaseControlProps<HTMLInputElement>, 'size'> {
  size: 'sm' | 'md' | 'lg';
  min?: number;
  max?: number;
  step?: number;
  orientation?: 'horizontal' | 'vertical';
}

export const Slider = forwardRef(function Slider(
  props: SliderProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const { id, size = 'sm', min, max, step, orientation = 'horizontal', markRequired, className, label, hint, disabled, error, ..._props } = props;
  const trackWidth = size === 'sm' ? 6 : size === 'md' ? 8 : 10;
  const thumbSize = size === 'sm' ? 14 : size === 'md' ? 18 : 24;

  useEffect(() => {
    if (disabled) return;

    const slider = document.getElementById(id) as HTMLDivElement;
    const thumb = document.getElementById(`thumb-end-${id}`) as HTMLDivElement;
    if (!slider || !thumb) {
      throw new Error(`no slider ${id}`);
    }

    let rect: DOMRect | null = null;

    function updateThumb(offset: number): void {
      let end: number;
      if (orientation === 'horizontal') {
        end = offset < 0 ? 0 : offset > slider.offsetWidth ? slider.offsetWidth : offset;
      } else {
        end = offset < 0 ? 0 : offset > slider.offsetHeight ? slider.offsetHeight : offset;
      }

      slider.style.setProperty('--slider-thumb-end', `${end}px`);
      slider.style.setProperty('--slider-thumb-start', `0px`);
    }

    function pointermove(event: MouseEvent): void {
      if (rect == null) return;

      const offset = orientation === 'horizontal' ? event.clientX - rect.left : event.clientY - rect.top;

      updateThumb(offset);
    }

    function pointerup(): void {
      // window.removeEventListener('pointermove', pointermove);
      // window.removeEventListener('pointerup', cancel);
      // window.removeEventListener('pointercancel', cancel);

      rect = null;
      thumb.classList.remove('grub');
    }

    function pointerdown(event: PointerEvent): void {
      rect = slider.getBoundingClientRect();
      const offset = orientation === 'horizontal' ? event.clientX - rect.left : event.clientY - rect.top;


      slider.setPointerCapture(event.pointerId);
      thumb.classList.add('grub');
      thumb.focus();

      updateThumb(offset);
    }

    slider.addEventListener('pointermove', pointermove);
    slider.addEventListener('pointerup', pointerup);
    slider.addEventListener('pointercancel', pointerup);
    slider.addEventListener('pointerdown', pointerdown);
    return () => {
      slider.removeEventListener('pointermove', pointermove);
      slider.removeEventListener('pointerup', pointerup);
      slider.removeEventListener('pointercancel', pointerup);
      slider.removeEventListener('pointerdown', pointerdown);
    };
  }, [id, orientation, disabled, min, max, step]);

  return (
    <div
      className={cn('__prefix__', '__prefix__-slider', className, { disabled, error: !!error })}
      style={{
        '--slider-track-width': `${trackWidth}px`,
        '--slider-thumb-size': `${thumbSize}px`,
      } as CSSProperties}
    >
      <Label id={id} label={label} required={markRequired}/>

      <div className="control">
        <div id={id} className="__prefix__-slider-backdrop" ref={ref} {..._props}>
          <div className="__prefix__-slider-rail">
            <div className="track"/>
            <div className="track-active"/>

            <div
              id={`thumb-end-${id}`}
              className="thumb"
              role="slider"
              tabIndex={0}
              aria-valuemin={min}
              aria-valuenow={0}
              aria-valuetext=""
              aria-valuemax={max}
              aria-labelledby={id}
              aria-orientation={orientation}
            >
              <div className="drag"/>
            </div>
          </div>
        </div>
      </div>

      <Subscript error={error} hint={hint}/>
    </div>
  )
});

