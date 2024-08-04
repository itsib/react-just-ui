import React, { forwardRef } from 'react';
import { BaseProps } from '../types';
import { ControlLabel } from '../common/control-label.tsx';
import { ControlError } from '../common/control-error.tsx';
import './form-control-checkbox.css';

export interface IFormControlCheckbox extends BaseProps<HTMLInputElement> {
  rowReverse?: boolean;
}

export const FormControlCheckbox = forwardRef(function FormControlCheckbox(
  _props: IFormControlCheckbox,
  _ref: React.ForwardedRef<HTMLInputElement>
) {
  const { id, label, hint, className, rowReverse, error, ...props } = _props;

  return (
    <div
      className={`jui jui-checkbox ${rowReverse ? 'row-reverse' : 'row'} ${className ?? ''}`}
    >
      <ControlLabel id={id} label={label} hint={hint} />

      <div className="control-checkbox">
        <input
          id={id}
          type="checkbox"
          role="checkbox"
          ref={_ref}
          {...props}
        />
        <svg className="checkbox" viewBox="0 0 24 24" version="1.1" preserveAspectRatio="xMaxYMax" xmlns="http://www.w3.org/2000/svg">
          <path className="tick" d="M6 11L11 16L18 7" />
          <rect className="rect" x="1" y="1" width="22" height="22" rx="3px" ry="3px"/>
        </svg>
      </div>

      <ControlError error={!_props.disabled ? error : undefined}/>
    </div>
  );
});
