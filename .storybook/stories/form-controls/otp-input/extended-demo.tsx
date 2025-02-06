import { memo } from 'react';
import { useForm } from 'react-hook-form';
import { OtpInput } from '../../../../src';

export interface ExtendedProps {
  label?: string;
  hint?: string;
  disabled?: boolean;
  layout?: string;
}

export const ExtendedDemo = memo(function ExtendedDemo({ label, hint, layout, disabled }: ExtendedProps) {
  const { register, handleSubmit, formState } = useForm<{ otp: string }>({
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues: {
      otp: '',
    }
  });
  const { errors } = formState;

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <OtpInput
        id="otp-input"
        label={label}
        hint={hint}
        disabled={disabled}
        layout={layout}
        error={errors.otp}
        {...register('otp', {
          required: 'OTP code is required',
          minLength: {
            message: 'The OTP code consists of six characters',
            value: 6,
          }
        })}
      />

      <div className="button-block">
        <button type="submit" className="btn btn-accent">
          Submit
        </button>

        <button type="reset" className="btn btn-secondary">
          Reset
        </button>
      </div>
    </form>
  );
});