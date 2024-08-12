import { FC, useState } from 'react';
import { Trans } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Checkbox, email, Input } from 'react-just-ui';
import { CodeExample } from '../../components/code-example/code-example.tsx';

const SOURCE = `
import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from 'react-just-ui';

export const InputPage: FC = () => {
    const [loading, setLoading] = useState(false);
    
    const { register, formState: { errors } } = useForm<{ firstName: string }>({
        defaultValues: {
            firstName: '',
        },
        mode: 'onChange',
    });
  
    return (
        <form onSubmit={handleSubmit(values => console.log(values))}>
            <Input
              id="first-name-control"
              label="first_name"
              hint="first_name_hint"
              placeholder="Homer"
              loading={loading}
              error={errors?.firstName}
              {...register('firstName', {
                required: 'Field is required',
              })}
            />
        </form>
    );
};
`.trim();

export const InputPage: FC = () => {
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, reset, formState: { errors } } = useForm<{ firstName: string, lastName: string, email: string }>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
    mode: 'onChange',
  });

  return (
    <div className="input">
      <h1><Trans i18nKey="input" /></h1>
      <p><Trans i18nKey="input_page_content" /></p>

      <fieldset className="preview">
        <legend><Trans i18nKey="preview"/></legend>

        <div className="actions">
          <Checkbox
            id="demo-disabled"
            label="disable_demo_control"
            value={disabled as any}
            onChange={event => setDisabled((event.target as any).checked)}
          />

          <Checkbox
            id="demo-loading"
            label="loading_demo_control"
            value={loading as any}
            onChange={event => setLoading((event.target as any).checked)}
          />
        </div>

        <div className="demo">
          <Input
            id="first-name-control"
            label="first_name"
            hint="first_name_hint"
            placeholder="Homer"
            loading={loading}
            error={errors?.firstName}
            {...register('firstName', {
              required: 'required',
              disabled: disabled,
            })}
          />

          <Input
            id="last-name-control"
            label="last_name"
            hint="last_name_hint"
            placeholder="Simpson"
            loading={loading}
            error={errors?.lastName}
            {...register('lastName', {
              required: 'required',
              disabled: disabled,
            })}
          />

          <Input
            id="email-control"
            label="email"
            type="email"
            loading={loading}
            error={errors?.email}
            {...register('email', {
              required: 'required',
              validate: email('invalid_email'),
              disabled: disabled,
            })}
            placeholder="Email"
            prefix={
              <div className="prefix">
                <i className="icon icon-email"/>
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


      <CodeExample source={SOURCE} />
    </div>
  );
};
