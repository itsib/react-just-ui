import { forwardRef, ForwardedRef } from 'react';
import type { BaseControlProps } from './types';
import { Label } from './label';
import { Subscript } from './subscript';
import './switch.css';

export interface SwitchProps extends BaseControlProps<HTMLInputElement> {
  rowReverse?: boolean;
}

export const Switch = forwardRef(function Switch(
  _props: SwitchProps,
  _ref: ForwardedRef<HTMLInputElement>
) {
  const {
    id,
    label,
    hint,
    className,
    rowReverse,
    error,
    ...register
  } = _props;

  return (
    <div
      className={`jj jj-switch ${rowReverse ? 'row-reverse' : 'row'} ${className ?? ''}`}
    >
      <Label id={id} label={label} />

      <div className="control-switch">
        <input
          id={id}
          type="checkbox"
          role="checkbox"
          ref={_ref}
          {...register}
        />
        <div className="switch">
          <div className="thumb"/>
        </div>
      </div>

      <Subscript error={error} hint={hint}/>
    </div>
  );
});
