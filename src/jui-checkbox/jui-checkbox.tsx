import React, { forwardRef } from 'react';
import { BaseControlProps } from '../types';
import { Label } from '../jui-label/jui-label';
import { ErrorMessage } from '../jui-error-message/jui-error-message';
import './jui-checkbox.css';

export interface CheckboxProps extends BaseControlProps<HTMLInputElement> {
  rowReverse?: boolean;
}

export const Checkbox = forwardRef(function Checkbox(
  _props: CheckboxProps,
  _ref: React.ForwardedRef<HTMLInputElement>
) {
  const { id, label, hint, className, rowReverse, error, ...props } = _props;

  return (
    <div className={`jui jui-checkbox ${rowReverse ? 'row-reverse' : 'row'} ${className ?? ''}`}>
      <Label id={id} label={label} hint={hint} />

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

      <ErrorMessage error={error}/>
    </div>
  );
});
