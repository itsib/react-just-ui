import React, { forwardRef } from 'react';
import { BaseProps } from '../types';
import { ControlLabel } from '../common/control-label.tsx';
import { ControlError } from '../common/control-error.tsx';
import './form-control-radio.css';

export interface IFormControlRadio extends BaseProps<HTMLInputElement> {
  rowReverse?: boolean;
}

export const FormControlRadio = forwardRef(function FormControlCheckbox(
  _props: IFormControlRadio,
  _ref: React.ForwardedRef<HTMLInputElement>
) {
  const { id, label, hint, className, rowReverse, error, ...props } = _props;

  return (
    <div className={`jui jui-radio ${rowReverse ? 'row-reverse' : 'row'} ${className ?? ''}`}>
      <ControlLabel id={id} label={label} hint={hint} />

      <div className="control-radio">
        <input
          id={id}
          type="radio"
          role="radio"
          ref={_ref}
          {...props}
        />
        <svg className="radio" viewBox="0 0 24 24" version="1.1" preserveAspectRatio="xMaxYMax" xmlns="http://www.w3.org/2000/svg">
          <circle className="outline" cx="12" cy="12" r="11" strokeWidth="1" />
          <circle className="center" cx="12" cy="12" r="5" strokeWidth="0" />
        </svg>
      </div>

      <ControlError error={!_props.disabled || error === false ? error : undefined}/>
    </div>
  );
});
