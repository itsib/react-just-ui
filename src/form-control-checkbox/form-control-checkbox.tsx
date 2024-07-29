import React, { forwardRef } from 'react';
import { BaseProps } from '../types';
import { ControlLabel } from '../common/control-label.tsx';
import { ControlError } from '../common/control-error.tsx';

export interface IFormFieldCheckbox extends BaseProps<HTMLInputElement> {
  rowReverse?: boolean;
}

export const FormFieldCheckbox = forwardRef(function FormFieldCheckbox(
  _props: IFormFieldCheckbox,
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
      className={`form-control form-field-checkbox ${rowReverse ? 'row-reverse' : 'row'} ${className ?? ''}`}
    >
      <ControlLabel id={id} label={label} hint={hint} />

      <div className="control-checkbox">
        <input
          id={id}
          type="checkbox"
          role="checkbox"
          ref={_ref}
          {...register}
        />
        <svg
          className="checkbox"
          width="18"
          height="18"
          viewBox="0 0 16 16"
          version="1.1"
          preserveAspectRatio="xMaxYMax"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="tick"
            d="m 11.78,6.28 -4.5,4.5 a 0.75,0.75 0 0 1 -1.06,0 l -2,-2 A 0.75,0.75 0 0 1 4.238,7.738 0.75,0.75 0 0 1 5.28,7.72 l 1.47,1.47 3.97,-3.97 a 0.75,0.75 0 0 1 1.042,0.018 0.75,0.75 0 0 1 0.018,1.042"
          />
          <path
            className=""
            d="m 2.75,1 h 10.5 C 14.216,1 15,1.784 15,2.75 v 10.5 A 1.75,1.75 0 0 1 13.25,15 H 2.75 A 1.75,1.75 0 0 1 1,13.25 V 2.75 C 1,1.784 1.784,1 2.75,1 M 2.5,2.75 v 10.5 c 0,0.138 0.112,0.25 0.25,0.25 h 10.5 A 0.25,0.25 0 0 0 13.5,13.25 V 2.75 A 0.25,0.25 0 0 0 13.25,2.5 H 2.75 A 0.25,0.25 0 0 0 2.5,2.75"
          />
        </svg>
      </div>

      <ControlError error={!_props.disabled ? error : undefined} />
    </div>
  );
});
