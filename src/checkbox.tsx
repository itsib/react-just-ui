import { type ForwardedRef, forwardRef } from 'react';
import { Label } from './label';
import { Subscript } from './subscript';
import { BaseToggleControlProps } from './types';
import './checkbox.scss';
import { cn } from './utils/cn';

export type CheckboxProps = Omit<BaseToggleControlProps<HTMLInputElement>, 'value'>;

/**
 * A wrapper for an input element of the checkbox type as boxes that are
 * checked (ticked) when activated, like you might see in an official
 * government paper form. The exact appearance depends upon the operating
 * system configuration under which the browser is running.
 */
export const Checkbox = forwardRef(function Checkbox(
  _props: CheckboxProps,
  _ref: ForwardedRef<HTMLInputElement>
) {
  const { id, label, hint, className, style, checked, rowReverse, error, disabled, markRequired, size = 20, ...props } = _props;

  return (
    <div className={cn('__prefix__', '__prefix__-base-toggle', '__prefix__-checkbox', className, rowReverse ? 'row-reverse' : 'row', { disabled })} style={style}>
      <Label id={id} label={label} required={markRequired} />

      <div className="control" style={{ width: `${size}px`, height: `${size}px` }}>
        <input
          id={id}
          type="checkbox"
          role="checkbox"
          disabled={disabled}
          checked={checked}
          ref={_ref}
          {...props}
        />
        <svg className="checkbox" viewBox="0 0 16 16" version="1.1" preserveAspectRatio="xMaxYMax" xmlns="http://www.w3.org/2000/svg">
          <path className="tick" d="M 3.6,8.32 6.3,11 12.5,5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      </div>

      <Subscript error={error} hint={hint} />
    </div>
  );
});
