import { FC, useEffect } from 'react';
import {
  FormControlInput,
  FormControlCheckbox,
  FormControlSelect,
  FormControlVerifyCode,
  FormControlTextarea,
  FormControlSwitch,
} from 'react-form-controls';
import { useForm } from 'react-hook-form';
import { Trans } from 'react-i18next';
import './home.css'

const SELECT_OPTIONS = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
  { value: '4', label: 'Option 4' },
  { value: '5', label: 'Option 5' },
  { value: '6', label: 'Option 6' },
  { value: '7', label: 'Option 7' },
  { value: '8', label: 'Option 8' },
  { value: '9', label: 'Option 9' },
  { value: '10', label: 'Option 10' },
  { value: '11', label: 'Option 11' },
  { value: '12', label: 'Option 12' },
  { value: '13', label: 'Option 13' },
  { value: '14', label: 'Option 14' },
  { value: '15', label: 'Option 15' },
  { value: '16', label: 'Option 16' },
  { value: '17', label: 'Option 17' },
  { value: '18', label: 'Option 18' },
  { value: '19', label: 'Option 19' },
];

interface FormFields {
  text: string;
  checkbox: boolean;
  switch: boolean;
  select: string;
  textarea: string;
  code: string;
}

export const Home: FC = () => {
  const { register, watch, formState } = useForm<FormFields>({
    defaultValues: {
      text: '',
      checkbox: false,
      switch: false,
      select: '1',
      textarea: '',
      code: ''
    },
    mode: 'onChange',
  });

  const { errors } = formState;

  useEffect(() => {
    const sub = watch((value, { name, type }) => {
      console.log(name, type, value);
    })
    return () => {
      sub.unsubscribe();
    }
  }, []);

  // useEffect(() => {
  //   console.log(errors?.code);
  // }, [errors?.code]);

  return (
    <div className="home">
      <div className="container">
        <div>
          <FormControlSwitch
            id="switch"
            label="This is switch"
            error={errors?.switch}
            {...register('switch', { disabled: false })}
          />
        </div>
        <div>
          <FormControlSelect
            id="select"
            label="choose_option"
            options={SELECT_OPTIONS}
            error={errors?.select}
            {...register('select', { required: 'required', disabled: false })}
          />
        </div>
        <div>
          <FormControlTextarea
            id="textarea"
            label="summary"
            placeholder="Some text"
            error={errors?.textarea}
            {...register('textarea', { required: 'required' })}
          />
        </div>
        <div>
          <FormControlInput
            id="text-input"
            label="first_name"
            hint="first_name_hint"
            error={errors?.text}
            {...register('text', { required: 'required', disabled: false })}
          />
        </div>
        <div>
          <FormControlVerifyCode
            id="verify-code-input"
            label="enter_six_digit_code"
            upper
            layout="ddd-ddd"
            error={errors?.code}
            {...register('code', { required: 'required' })}
          />
        </div>
        <div>
          <FormControlCheckbox
            id="checkbox-input"
            label={
              <Trans
                i18nKey="accept_terms_checkbox"
                components={{
                  a1: <a className="underline hover:no-underline" href="#"/>,
                  a2: <a className="underline hover:no-underline" href="#"/>,
                }}
              />
            }
          />
        </div>
      </div>
    </div>
  );
};
