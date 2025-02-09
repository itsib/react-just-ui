import { CSSProperties, ForwardedRef, forwardRef } from 'react';
import { BaseToggleControlProps } from './types';
import { Label } from './label';
import { Subscript } from './subscript';
import { cn } from './utils/cn';
import './switch.scss';

const RATIO = 1.85;
const PADDING = 3;

export interface SwitchProps extends BaseToggleControlProps<HTMLInputElement> {
  /**
   * Switch background color for enabled state
   *
   * @default "rgb(var(--uic-accent))"
   */
  accent?: string;
}

export const Switch = forwardRef(function Switch(
  props: SwitchProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const { id, label, hint, className, accent, rowReverse, error, disabled, markRequired, size = 24, ...rest } = props;

  return (
    <div
      className={cn('__prefix__', '__prefix__-base-toggle', '__prefix__-switch', className, { disabled }, rowReverse ? 'row-reverse' : 'row')}
      style={{
        '--__prefix__-switch-height': `${size}px`,
        '--__prefix__-switch-width': `${Math.round(size * RATIO / 2) * 2}px`,
        '--__prefix__-switch-ratio': `${RATIO}`,
        '--__prefix__-switch-padding': `${PADDING}px`,
        '--__prefix__-switch-thumb-size': `${size - (PADDING * 2)}px`,
        '--__prefix__-switch-accent': accent || 'rgb(var(--__prefix__c-accent))'
      } as CSSProperties}
    >
      <Label id={id} label={label} required={markRequired} />

      <div className="control">
        <input id={id} type="checkbox" role="checkbox" disabled={disabled} ref={ref} {...rest}/>
        <div className="switch">
          <div className="thumb"/>
        </div>
      </div>

      <Subscript error={error} hint={hint}/>
    </div>
  );
});
