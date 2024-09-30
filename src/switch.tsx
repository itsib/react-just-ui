import { CSSProperties, ForwardedRef, forwardRef } from 'react';
import { BaseCheckedControlProps } from './types';
import { Label } from './label';
import { Subscript } from './subscript';
import { switchCN } from './intermal/css-class';
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
      className={switchCN('switch', className, disabled, rowReverse)}
      style={{
        '--switch-height': `${size}px`,
        '--switch-width': `${Math.round(size * RATIO / 2) * 2}px`,
        '--switch-ratio': `${RATIO}`,
        '--switch-padding': `${PADDING}px`,
        '--switch-thumb-size': `${size - (PADDING * 2)}px`
      } as CSSProperties}
    >
      <Label id={id} label={label} />

      <div className="control-switch">
        <input id={id} type="checkbox" role="checkbox" disabled={disabled} ref={ref} {...rest}/>
        <div className="switch">
          <div className="thumb"/>
        </div>
      </div>

      <Subscript error={error} hint={hint}/>
    </div>
  );
});
