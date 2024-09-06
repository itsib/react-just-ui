import type { ReactNode, AllHTMLAttributes } from 'react';
import { ValidationError } from './validation-error';

/**
 * The basic properties of all form controls.
 *
 * @public
 */
export type BaseControlProps<Element extends HTMLElement> = {
  /**
   * The contents of this field are wrapped in the HTML
   * <label> tag and associated with the <input> tag.
   *
   * @remarks
   * If undefined or an empty string, as well as if React.Element,
   * then the {@link BaseControlProps.hint | hint} will also not
   * be displayed.
   *
   * @public
   */
  label?: string | ReactNode;
  /**
   * The text of the popup hint. If passed, a
   * question mark icon appears to the
   * right of the label text.
   *
   * @remarks
   * It is displayed only if a non-empty string is passed in the {@link BaseControlProps.label | label} property.
   */
  hint?: string;
  /**
   * Unique identification of form element
   *
   * @public
   */
  id: string;
  /**
   * The validation error of this element is passed here.
   *
   * @remarks
   * Supports {@link https://react-hook-form.com/ts#FieldError | react-hook-form#FieldError}
   *
   * @public
   */
  error?: ValidationError | false;
  /**
   * Disable this for m control
   *
   * @public
   */
  disabled?: boolean;
} & Omit<AllHTMLAttributes<Element>, 'prefix' | 'label'>;