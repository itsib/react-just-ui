import React, { forwardRef } from 'react';
import { BaseControlProps } from '../types';
import { Label } from '../jui-label/jui-label.tsx';
import { ErrorMessage } from '../jui-error-message/jui-error-message.tsx';
import './jui-switch.css';

export interface SwitchProps extends BaseControlProps<HTMLInputElement> {
  rowReverse?: boolean;
}

export const Switch = forwardRef(function Switch(
  _props: SwitchProps,
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
      <Label id={id} label={label} hint={hint} />

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

      <ErrorMessage error={error}/>
    </div>
  );
});
