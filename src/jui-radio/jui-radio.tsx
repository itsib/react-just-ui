import React, { forwardRef } from 'react';
import { BaseProps } from '../types';
import { Label } from '../jui-label/jui-label.tsx';
import { ErrorMessage } from '../jui-error-message/jui-error-message.tsx';
import './jui-radio.css';

export interface RadioButtonProps extends Omit<BaseProps<HTMLInputElement>, 'value'> {
  /**
   * If true, then label and checkbox are swapped
   */
  rowReverse?: boolean;
  /**
   *
   */
  value?: string | number;
}

export const RadioButton = forwardRef(function Checkbox(
  _props: RadioButtonProps,
  _ref: React.ForwardedRef<HTMLInputElement>
) {
  const { id, label, hint, className, rowReverse, error, ...props } = _props;

  return (
    <div className={`jui jui-radio ${rowReverse ? 'row-reverse' : 'row'} ${className ?? ''}`}>
      <Label id={id} label={label} hint={hint} />

      <div className="control-radio">
        <input id={id} type="radio" role="radio" ref={_ref} {...props} />

        <svg className="radio" viewBox="0 0 24 24" version="1.1"
             preserveAspectRatio="xMaxYMax"
             xmlns="http://www.w3.org/2000/svg">
          <circle className="outline" cx="12" cy="12" r="11" strokeWidth="1"/>
          <circle className="center" cx="12" cy="12" r="5" strokeWidth="0"/>
        </svg>
      </div>

      <ErrorMessage error={error}/>
    </div>
  );
});
