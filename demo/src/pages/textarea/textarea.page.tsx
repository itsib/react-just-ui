import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Trans } from 'react-i18next';
import { Textarea, Checkbox } from 'react-just-ui';

export const TextareaPage: FC = () => {
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

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
          <Textarea
            id="first-name-control"
            label="first_name"
            hint="first_name_hint"
            loading={loading}
            minHeight={100}
            maxHeight={280}
            minWidth={300}
            placeholder="Enter a description that make people excited about your token..."
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
