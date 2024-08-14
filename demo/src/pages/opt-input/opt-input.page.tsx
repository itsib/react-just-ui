import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Trans } from 'react-i18next';
import { Checkbox, OtpInput } from 'react-just-ui';

export const OptInputPage: FC = () => {
  const [disabled, setDisabled] = useState(false);
  const { register, reset, formState: { errors } } = useForm<{ otpCode: string }>({
    defaultValues: {
      otpCode: '',
    },
    mode: 'onChange',
  });

  return (
    <div className="otp-input">
      <h1><Trans i18nKey="otp_input" /></h1>
      <p><Trans i18nKey="otp_input_page_content" /></p>

      <fieldset className="preview">
        <legend><Trans i18nKey="preview"/></legend>

        <div className="actions">
          <Checkbox
            id="otp-demo-disabled"
            label="disable_demo_control"
            value={disabled as any}
            onChange={event => setDisabled((event.target as any).checked)}
          />
        </div>

        <div className="demo">
          <OtpInput
            id="otp-code-control"
            layout="ddd.ddd"
            label="otp_code"
            hint="otp_code_hint"
            error={errors?.otpCode}
            {...register('otpCode', {
              required: 'required',
              disabled: disabled,
            })}
          />

          <div style={{ marginTop: '20px' }}>
            <button className="btn btn-primary" type="button" onClick={() => reset({ otpCode: '' })}>
              <Trans i18nKey="reset"/>
            </button>
          </div>
        </div>
      </fieldset>
    </div>
  );
};
