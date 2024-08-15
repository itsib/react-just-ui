import { ValidationFn } from './types';

/**
 * Email validator function.
 *
 * @remarks
 * Email should contain "\@" and ".". This function is used for
 * custom validation in the {@link https://react-hook-form.com/docs/useform/register | react-hook-form} library
 *
 * @example
 * React component with form element:
 *
 * ```tsx
 * export const Component = () => {
 *   const { register, formState: { errors } } = useForm();
 *
 *   return (
 *      <Input
 *        id="field-id"
 *        error={errors?.email}
 *        {...register('email', {
 *          required: 'Field is required',
 *          validate: email('Email is invalid'),
 *        })}
 *      />
 *   );
 * }
 *
 * ```
 *
 * @param error - The error text that will be displayed inside the form element.
 *
 * @returns Validation callback {@link ValidationFn | function}.
 *
 * @public
 */
export function email(error: string): ValidationFn {
  return (value: string) => {
    if (!value) return true;

    const segments = value.split('@');
    if (segments.length === 2 && segments[1].split('.').length >= 2) {
      return true;
    }
    return error
  }
}