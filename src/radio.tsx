import { ForwardedRef, forwardRef } from 'react';
import { BaseToggleControlProps } from './types';
import { Label } from './label';
import { Subscript } from './subscript';
import './radio.scss';
import { cn } from './utils/cn';

export interface RadioProps extends Omit<BaseToggleControlProps<HTMLInputElement>, 'value'> {
  /**
   * If true, then label and checkbox are swapped
   */
  rowReverse?: boolean;
  /**
   * Whether this radio button is checked.
   */
  checked?: boolean;
  /**
   * Value for the radio group. Should equal the value of the selected radio button
   * if there is a corresponding radio button with a matching value. If there is
   * not such a corresponding radio button, this value persists to be applied in
   * case a new radio button is added with a matching value.
   */
  value?: string;
}

/**
 * A radio button or option button is a graphical
 * control element that allows the user to choose
 * only one of a predefined set of mutually
 * exclusive options.
 *
 * Radio uses an internal \<input type="radio"\> to provide an
 * accessible experience. This internal radio button
 * receives focus and is automatically
 * labelled by the text content of the radio button element.
 */
export const Radio = forwardRef(function Checkbox(
  _props: RadioProps,
  _ref: ForwardedRef<HTMLInputElement>
) {
  const { id, label, hint, className, rowReverse, size = 18, error, disabled, markRequired, ...props } = _props;

  return (
    <div className={cn('__prefix__', '__prefix__-base-toggle', '__prefix__-radio', className, rowReverse ? 'row-reverse' : 'row', { disabled })}>
      <Label id={id} label={label} required={markRequired} />

      <div className="control" style={{ width: `${size}px`, height: `${size}px` }}>
        <input id={id} type="radio" role="radio" disabled={disabled} ref={_ref} {...props} />

        <svg className="radio" viewBox="0 0 24 24" version="1.1"
             preserveAspectRatio="xMaxYMax"
             xmlns="http://www.w3.org/2000/svg">
          <circle className="outline" cx="12" cy="12" r="11" strokeWidth="1"/>
          <circle className="center" cx="12" cy="12" r="5" strokeWidth="0"/>
        </svg>
      </div>

      <Subscript error={error} hint={hint}/>
    </div>
  );
});
