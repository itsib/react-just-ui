import { FC, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Checkbox, Switch } from 'react-just-ui';

export const SwitchPage: FC = () => {
  const { t } = useTranslation();

  const [disabled, setDisabled] = useState(false);
  const { register, reset, formState: { errors } } = useForm<{ enabled: boolean }>({
    defaultValues: {
      enabled: false,
    },
    mode: 'onChange',
  });

  return (
    <div className="">
      <h1><Trans i18nKey="switch"/></h1>
      <p><Trans i18nKey="switch_page_content"/></p>

      <fieldset className="preview">
        <legend><Trans i18nKey="preview"/></legend>

        <div className="actions">
          <Checkbox
            id="demo-disabled"
            label={t('disable_demo_control')}
            value={disabled as any}
            onChange={event => setDisabled((event.target as any).checked)}
          />
        </div>

        <div className="demo">
          <Switch
            id="switch"
            label={t('airplane_mode')}
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
