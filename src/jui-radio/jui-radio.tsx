import React, { forwardRef } from 'react';
import { BaseProps } from '../types';
import { JuiLabel } from '../jui-label/jui-label.tsx';
import { JuiError } from '../jui-error/jui-error.tsx';
import './jui-radio.css';

export interface IJuiRadio extends Omit<BaseProps<HTMLInputElement>, 'value'> {
  /**
   * If true, then label and checkbox are swapped
   */
  rowReverse?: boolean;
  /**
   *
   */
  value?: string | number;
}

export const JuiRadio = forwardRef(function JuiCheckbox(
  _props: IJuiRadio,
  _ref: React.ForwardedRef<HTMLInputElement>
) {
  const { id, label, hint, className, rowReverse, error, ...props } = _props;

  return (
    <div className={`jui jui-radio ${rowReverse ? 'row-reverse' : 'row'} ${className ?? ''}`}>
      <JuiLabel id={id} label={label} hint={hint} />

      <div className="control-radio">
        <input id={id} type="radio" role="radio" ref={_ref} {...props} />

        <svg className="radio" viewBox="0 0 24 24" version="1.1"
             preserveAspectRatio="xMaxYMax"
             xmlns="http://www.w3.org/2000/svg">
          <circle className="outline" cx="12" cy="12" r="11" strokeWidth="1"/>
          <circle className="center" cx="12" cy="12" r="5" strokeWidth="0"/>
        </svg>
      </div>

      <JuiError error={error}/>
    </div>
  );
});
