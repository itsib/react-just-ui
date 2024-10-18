import type { ValidationFn } from '../types';

/**
 * URL validator function.
 *
 * @remarks
 * The {@link https://developer.mozilla.org/en-US/docs/Web/API/URL/canParse_static | URL.canParse()} method is used for validation.
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
 *        type="url"
 *        error={errors?.url}
 *        {...register('url', {
 *          required: 'Field is required',
 *          validate: url('Wrong url format'),
 *        })}
 *      />
 *   );
 * }
 *
 * ```
 *
 * @param error - The error text that will be displayed inside the form element.
 *
 * @param isHttpOnly - Only url starting with http:// or https:// are validated
 * @returns Validation callback {@link ValidationFn | function}.
 *
 * @public
 */
export function url(error: any, isHttpOnly?: boolean): ValidationFn {
  return (value: string) => {
    if (!value) return true;

    if (isHttpOnly) {
      const prefix = value.split('//')[0];
      if (prefix !== 'http:' && prefix !== 'https:') {
        return error;
      }
    }

    return URL.canParse(value) ? true : error;
  }
}