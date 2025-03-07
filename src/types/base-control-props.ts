import type { ReactNode, AllHTMLAttributes, ChangeEvent } from 'react';

import { ValidationError } from './validation-error';

/**
 * The basic properties of all form controls.
 *
 * @public
 */
export type BaseControlProps<Element extends HTMLElement> = {
  /**
   * Unique string fot identification the form element
   */
  id: string;
  /**
   * The contents of this field are wrapped in the HTML
   * label tag and associated with the input tag.
   *
   * If undefined or an empty string, as well as if React.Element,
   * then the <b>hint</b> will also not
   * be displayed.
   */
  label?: string | ReactNode;
  /**
   * Adds the red asterisk symbol "*" to the label
   *
   * @default false
   */
  markRequired?: boolean;
  /**
   * The text of the popup hint. If passed, a
   * question mark icon appears to the
   * right of the label text. It is displayed
   * only if a non-empty string is passed in
   * the <b>label</b> property.
   */
  hint?: string;
  /**
   * The validation error of this element is passed here.
   * Supports <a href="https://react-hook-form.com/ts#FieldError" target="_blank">react-hook-form#FieldError</a>.
   */
  error?: ValidationError | false;
  /**
   * Whether the control is disabled
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * The input control's value
   */
  value?: string;
  /**
   * Callback function when the form control status changes
   * @param event
   */
  onChange?: (event: ChangeEvent<Element>) => void;
} & Omit<AllHTMLAttributes<Element>, 'prefix' | 'label' | 'value' | 'disabled' | 'id' | 'type'>;

export type BaseToggleControlProps<Element extends HTMLElement> = {
  /**
   * Swap the label and form control.
   */
  rowReverse?: boolean;
  /**
   * You can use the checked attribute to
   * control the state of the form control checked/enabled.
   */
  checked?: boolean,
  /**
   * Form control size. For the switch, it means the height
   * of the switch.  The width is calculated with the ratio constant.
   */
  size?: number;
} & BaseControlProps<Element>;