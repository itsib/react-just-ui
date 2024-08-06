import React, { forwardRef } from 'react';
import { BaseProps } from '../types';
import { JuiLabel } from '../jui-label/jui-label.tsx';
import { JuiError } from '../jui-error/jui-error.tsx';
import './jui-switch.css';

export interface IJuiSwitch extends BaseProps<HTMLInputElement> {
  rowReverse?: boolean;
}

export const JuiSwitch = forwardRef(function JuiSwitch(
  _props: IJuiSwitch,
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
      className={`jui jui-switch ${rowReverse ? 'row-reverse' : 'row'} ${className ?? ''}`}
    >
      <JuiLabel id={id} label={label} hint={hint} />

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

      <JuiError error={error}/>
    </div>
  );
});
