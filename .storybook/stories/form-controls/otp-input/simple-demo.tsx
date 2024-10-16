import { memo } from 'react';
import { OtpInput, OtpInputProps } from '../../../../src';
import { useForm } from 'react-hook-form';

export interface SimpleDemoProps extends Omit<OtpInputProps, 'onChange' | 'value'> {

}

export const SimpleDemo = memo(function SimpleDemo({ label, id, disabled, layout }: SimpleDemoProps) {
  const { register } = useForm<{ otp: string }>({
    defaultValues: {
      otp: ''
    }
  })

  return (
    <div>
      <OtpInput
        id={id}
        label={label}
        disabled={disabled}
        layout={layout}
        {...register('otp', {
          required: 'Field is required',
        })}
      />
    </div>
  );
})