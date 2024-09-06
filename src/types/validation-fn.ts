/**
 * Interface of the validator function.
 *
 * @remarks
 * Passed in the validate field,
 * see the {@link https://react-hook-form.com/docs/useform/register | register} function
 *
 * @public
 */
export interface ValidationFn {
  (value: any, formValues: Record<string, any>): boolean | string | Promise<boolean | string>;
}