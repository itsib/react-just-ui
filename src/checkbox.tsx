import { forwardRef, ForwardedRef } from 'react';
import { Label } from './label';
import { ErrorMessage } from './error-message';
import type { BaseControlProps } from './types';
import './checkbox.css';

/**
 * Checkbox
 *
 * @remarks
 * A wrapper for an input element of the checkbox type as boxes that are
 * checked (ticked) when activated, like you might see in an official
 * government paper form. The exact appearance depends upon the operating
 * system configuration under which the browser is running.
 *
 * @public
 */
export interface CheckboxProps extends BaseControlProps<HTMLInputElement> {
  /**
   * Row Reverse
   *
   * @remarks
   * Swap the checkbox and label
   *
   * @public
   */
  rowReverse?: boolean;
}


/**
 * Checkbox
 * @beta
 */
export const Checkbox = forwardRef(function Checkbox(
  _props: CheckboxProps,
  _ref: ForwardedRef<HTMLInputElement>
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
