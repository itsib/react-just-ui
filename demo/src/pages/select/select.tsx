import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Trans } from 'react-i18next';
import { JuiSelect, JuiCheckbox } from 'react-just-ui';

const SELECT_OPTIONS = [
  {
    value: '1',
    icon: <img src="images/flag-ru.svg" alt="svg" style={{display: 'block'}} />,
    label: 'Option 1',
  },
  {
    value: '2',
    icon: <img src="/images/flag-no.svg" alt="svg" style={{ display: 'block' }}/>,
    label: 'Option 2',
  },
  {
    value: '3',
    icon: <img src="/images/flag-us.svg" alt="svg" style={{ display: 'block' }}/>,
    label: 'Option 3',
  },
  {
    value: '4',
    icon: <img src="/images/flag-jp.svg" alt="svg" style={{ display: 'block' }}/>,
    label: 'Option 4',
  },
  {
    value: '5',
    label: 'Option 5',
    icon: 'icon icon-car',
  },
  {
    value: '6',
    label: 'Option 6',
    icon: 'icon icon-helicopter',
  },
  { value: '7', label: 'Option 7', icon: ' ' },
  { value: '8', label: 'Option 8', icon: ' ' },
  { value: '9', label: 'Option 9', icon: ' ' },
  { value: '10', label: 'Option 10', icon: ' ' },
  { value: '11', label: 'Option 11', icon: ' ' },
  { value: '12', label: 'Option 12', icon: ' ' },
  { value: '13', label: 'Option 13', icon: ' ' },
  { value: '14', label: 'Option 14', icon: ' ' },
  { value: '15', label: 'Option 15', icon: ' ' },
  { value: '16', label: 'Option 16', icon: ' ' },
  { value: '17', label: 'Option 17', icon: ' ' },
  { value: '18', label: 'Option 18', icon: ' ' },
  { value: '19', label: 'Option 19', icon: ' ' },
];

const SELECT2_OPTIONS = [
  {
    value: '1',
    label: 'Option 1',
  },
  {
    value: '2',
    label: 'Option 2',
  },
  {
    value: '3',
    label: 'Option 3',
  },
];

export const Select: FC = () => {
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, reset, formState: { errors } } = useForm<{ select: string; select2: string }>({
    defaultValues: {
      select: '1',
      select2: '1',
    },
    mode: 'onChange',
  });

  return (
    <div className="switch">
      <h1><Trans i18nKey="select"/></h1>
      <p><Trans i18nKey="select_page_content"/></p>

      <fieldset className="preview">
        <legend><Trans i18nKey="preview"/></legend>

        <div className="actions">
          <JuiCheckbox
            id="demo-disabled"
            label="disable_demo_control"
            value={disabled as any}
            onChange={event => setDisabled((event.target as any).checked)}
          />

          <JuiCheckbox
            id="demo-loading"
            label="loading_demo_control"
            value={loading as any}
            onChange={event => setLoading((event.target as any).checked)}
          />
        </div>

        <div className="demo">
          <JuiSelect
            id="select-2"
            label="choose_option"
            options={SELECT2_OPTIONS}
            loading={loading}
            error={errors?.select2}
            {...register('select2', { required: 'required', disabled: disabled })}
          />


          <JuiSelect
            id="select"
            label="choose_option"
            options={SELECT_OPTIONS}
            loading={loading}
            error={errors?.select}
            {...register('select', { required: 'required', disabled: disabled })}
          />

          <div style={{ marginTop: '20px' }}>
            <button className="btn btn-primary" type="button" onClick={() => reset({select: '1', select2: '1'})}>
              <Trans i18nKey="reset"/>
            </button>
          </div>
        </div>
      </fieldset>
    </div>
  );
};
