import { ValidationFn } from './types';

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
 * @returns Validation callback {@link ValidationFn | function}.
 *
 * @public
 */
export function url(error: any): ValidationFn {
  return (value: string) => {
    if (!value) return true;

    return URL.canParse(value) ? true : error;
  }
}