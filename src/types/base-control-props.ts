import type { ReactNode, AllHTMLAttributes, ChangeEvent } from 'react';
import { ValidationError } from './validation-error';

/**
 * The basic properties of all form controls.
 *
 * @public
 */
export type BaseControlProps<Element extends HTMLElement> = {
  /**
   * Unique identificator in the form element
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
   * Disable this control.
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
} & Omit<AllHTMLAttributes<Element>, 'prefix' | 'label' | 'value' | 'disabled' | 'id'>;