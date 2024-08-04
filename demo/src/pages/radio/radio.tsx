import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Trans } from 'react-i18next';
import { FormControlRadio, FormControlCheckbox } from 'react-just-ui';
import './radio.css'

export const Radio: FC = () => {
  const [disabled, setDisabled] = useState(false);
  const { register, reset, formState: { errors } } = useForm<{ radio: string }>({
    defaultValues: {
      radio: 'a',
    },
    mode: 'onChange',
  });

  return (
    <div className="select">
      <h1><Trans i18nKey="radio"/></h1>
      <p><Trans i18nKey="radio_page_content"/></p>

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
          <FormControlRadio
            id="demo-radio-a"
            label="Off with your head"
            error={false}
            value="a"
            {...register('radio', { disabled: disabled })}
          />

          <FormControlRadio
            id="demo-radio-b"
            label="Dance ’til you’re dead"
            error={false}
            value="b"
            {...register('radio', { disabled: disabled })}
          />

          <FormControlRadio
            id="demo-radio-c"
            label="Heads will roll"
            error={false}
            value="c"
            {...register('radio', { disabled: disabled })}
          />

          <FormControlRadio
            id="demo-radio-c"
            label="On the floor"
            error={false}
            value="c"
            {...register('radio', { disabled: disabled })}
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
