import React, { forwardRef } from 'react';
import { BaseProps } from '../types';
import { ControlLabel } from '../common/control-label.tsx';
import { ControlError } from '../common/control-error.tsx';

export interface IFormControlSwitch extends BaseProps<HTMLInputElement> {
  rowReverse?: boolean;
}

export const FormControlSwitch = forwardRef(function FormControlSwitch(
  _props: IFormControlSwitch,
  _ref: React.ForwardedRef<HTMLInputElement>
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
      className={`rfc rfc-switch ${rowReverse ? 'row-reverse' : 'row'} ${className ?? ''}`}
    >
      <ControlLabel id={id} label={label} hint={hint} />

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

      <ControlError error={!_props.disabled ? error : undefined}/>
    </div>
  );
});
