import { CSSProperties, ForwardedRef, forwardRef } from 'react';
import { BaseCheckedControlProps } from './types';
import { Label } from './label';
import { Subscript } from './subscript';
import './switch.scss';

const RATIO = 1.85;
const PADDING = 3;

export const Switch = forwardRef(function Switch(
  props: BaseCheckedControlProps<HTMLInputElement>,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const { id, label, hint, className, rowReverse, error, disabled, size = 24, ...rest } = props;

  return (
    <div
      className={`__prefix__ __prefix__-switch ${className || ''} ${disabled ? 'disabled' : ''} ${rowReverse ? 'row-reverse' : 'row'}`}
      style={{
        '--__prefix__-switch-height': `${size}px`,
        '--__prefix__-switch-width': `${Math.round(size * RATIO / 2) * 2}px`,
        '--__prefix__-switch-ratio': `${RATIO}`,
        '--__prefix__-switch-padding': `${PADDING}px`,
        '--__prefix__-switch-thumb-size': `${size - (PADDING * 2)}px`
      } as CSSProperties}
    >
      <Label id={id} label={label} />

      <div className="control-toggler">
        <input id={id} type="checkbox" role="checkbox" disabled={disabled} ref={ref} {...rest}/>
        <div className="switch">
          <div className="thumb"/>
        </div>
      </div>

      <Subscript error={error} hint={hint}/>
    </div>
  );
});
