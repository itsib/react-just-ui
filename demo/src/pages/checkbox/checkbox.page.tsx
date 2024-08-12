import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Trans } from 'react-i18next';
import { Checkbox } from 'react-just-ui';

export const CheckboxPage: FC = () => {
  const [disabled, setDisabled] = useState(false);
  const { register, reset, formState: { errors } } = useForm<{ enabled: boolean }>({
    defaultValues: {
      enabled: false,
    },
    mode: 'onChange',
  });

  return (
    <div className="select">
      <h1><Trans i18nKey="checkbox"/></h1>
      <p><Trans i18nKey="checkbox_page_content"/></p>

      <fieldset className="preview">
        <legend><Trans i18nKey="preview"/></legend>

        <div className="actions">
          <Checkbox
            id="demo-disabled"
            label="disable_demo_control"
            value={disabled as any}
            onChange={event => setDisabled((event.target as any).checked)}
          />
        </div>

        <div className="demo">
          <Checkbox
            id="switch"
            label="airplane_mode"
            error={errors?.enabled}
            {...register('enabled', { disabled: disabled })}
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
