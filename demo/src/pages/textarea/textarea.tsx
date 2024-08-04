import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Trans } from 'react-i18next';
import { FormControlTextarea, FormControlCheckbox } from 'react-just-ui';

export const Textarea: FC = () => {
  const [disabled, setDisabled] = useState(false);
  const { register, reset, formState: { errors } } = useForm<{ name: string, email: string }>({
    defaultValues: {
      name: '',
      email: '',
    },
    mode: 'onChange',
  });

  return (
    <div className="textarea">
      <h1><Trans i18nKey="textarea" /></h1>
      <p><Trans i18nKey="textarea_page_content" /></p>

      <fieldset className="preview">
        <legend><Trans i18nKey="preview"/></legend>

        <div className="actions">
          <FormControlCheckbox
            id="demo-disabled"
            label="disable_demo_control"
            value={disabled as any}
            onChange={event => setDisabled((event.target as any).checked)}
          />
        </div>

        <div className="demo">
          <FormControlTextarea
            id="first-name-control"
            label="first_name"
            hint="first_name_hint"
            minHeight={100}
            error={errors?.name}
            {...register('name', { required: 'required', disabled: disabled })}
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
