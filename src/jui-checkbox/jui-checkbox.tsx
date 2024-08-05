import React, { forwardRef } from 'react';
import { BaseProps } from '../types';
import { JuiLabel } from '../jui-label/jui-label.tsx';
import { JuiError } from '../jui-error/jui-error.tsx';
import './jui-checkbox.css';

export interface IJuiCheckbox extends BaseProps<HTMLInputElement> {
  rowReverse?: boolean;
}

export const JuiCheckbox = forwardRef(function JuiCheckbox(
  _props: IJuiCheckbox,
  _ref: React.ForwardedRef<HTMLInputElement>
) {
  const { id, label, hint, className, rowReverse, error, ...props } = _props;

  return (
    <div
      className={`jui jui-checkbox ${rowReverse ? 'row-reverse' : 'row'} ${className ?? ''}`}
    >
      <JuiLabel id={id} label={label} hint={hint} />

      <div className="control-checkbox">
        <input
          id={id}
          type="checkbox"
          role="checkbox"
          ref={_ref}
          {...props}
        />
        <svg className="checkbox" viewBox="0 0 16 16" version="1.1" preserveAspectRatio="xMaxYMax" xmlns="http://www.w3.org/2000/svg">
          <path className="tick" d="M 3.6,8.32 6.3,11 12.5,5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      </div>

      <JuiError error={!_props.disabled ? error : undefined}/>
    </div>
  );
});
