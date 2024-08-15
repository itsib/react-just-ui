import { ValidationFn } from './types';

/**
 * Allows you to use several validator functions.
 *
 * @param validators - Array of validator functions
 *
 * @example
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
 *          validate: merge([
 *             email('Email is invalid'),
 *             url('Wrong url format'),
 *          ]),
 *        })}
 *      />
 *   );
 * }
 *
 * ```
 *
 * @public
 */
export function merge(validators: ValidationFn[]): ValidationFn {
  return (value: any, values: any) => {
    for (let i = 0; i < validators.length; i++) {
      const result = validators[i](value, values);
      if (result) {
        continue;
      }
      return result;
    }
    return true;
  }
}