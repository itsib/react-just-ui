import { FC, useState } from 'react';
import { Trans } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { JuiCheckbox, JuiInput, email } from 'react-just-ui';

export const Input: FC = () => {
  const [disabled, setDisabled] = useState(false);
  const { register, reset, formState: { errors } } = useForm<{ name: string, email: string }>({
    defaultValues: {
      name: '',
      email: '',
    },
    mode: 'onBlur',
  });

  return (
    <div className="input">
      <h1><Trans i18nKey="input" /></h1>
      <p><Trans i18nKey="input_page_content" /></p>

      <fieldset className="preview">
        <legend><Trans i18nKey="preview"/></legend>

        <div className="actions">
          <JuiCheckbox
            id="demo-disabled"
            label="disable_demo_control"
            value={disabled as any}
            onChange={event => setDisabled((event.target as any).checked)}
          />
        </div>

        <div className="demo">
          <JuiInput
            id="first-name-control"
            label="first_name"
            hint="first_name_hint"
            error={errors?.name}
            {...register('name', { required: 'required', disabled: disabled })}
          />

          <JuiInput
            id="email-control"
            label="email"
            type="email"
            error={errors?.email}
            {...register('email', {
              required: 'required',
              validate: email('invalid_email'),
              disabled: disabled,
            })}
            placeholder="Email"
            prefix={
              <div className="prefix">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path fill="currentColor"
                        d="M12 21.95h5v-2h-5c-4.34 0-8-3.66-8-8s3.66-8 8-8s8 3.66 8 8v1.43c0 .79-.71 1.57-1.5 1.57s-1.5-.78-1.5-1.57v-1.43c0-2.76-2.24-5-5-5s-5 2.24-5 5s2.24 5 5 5c1.38 0 2.64-.56 3.54-1.47c.65.89 1.77 1.47 2.96 1.47c1.97 0 3.5-1.6 3.5-3.57v-1.43c0-5.52-4.48-10-10-10s-10 4.48-10 10s4.48 10 10 10m0-7c-1.66 0-3-1.34-3-3s1.34-3 3-3s3 1.34 3 3s-1.34 3-3 3"></path>
                </svg>
              </div>
            }
          />

          <div style={{ marginTop: '20px' }}>
            <button className="btn btn-primary" type="button" onClick={() => reset()}>
              <Trans i18nKey="reset"/>
            </button>
          </div>
        </div>
      </fieldset>
    </div>
  );
};
